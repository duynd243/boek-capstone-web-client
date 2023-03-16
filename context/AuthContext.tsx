import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    Unsubscribe,
    User,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import LoadingProgress from "../components/LoadingProgress";
import { toast } from "react-hot-toast";
import LogoutModal from "../components/Modal/LogoutModal";
import { ILoginData } from "../types/User/ILoginData";
import { UserService } from "../services/UserService";
import { Roles } from "../constants/Roles";
import { IUser } from "../types/User/IUser";

export interface IAuthContext {
    user: User | null;
    loginUser: ILoginData | null;
    authLoading: boolean;
    handleGoogleSignIn: () => void;
    logOut: () => void;
    updateLoginUser: (user: IUser) => void;
}

const AuthContext = createContext({} as IAuthContext);
export const useAuth: () => IAuthContext = () => useContext(AuthContext);

type Props = {
    children: ReactNode;
};

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth();
    const router = useRouter();
    const user = auth.currentUser;
    const [loginUser, setLoginUser] = useState<ILoginData | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const [showLogOutModal, setShowLogOutModal] = useState<boolean>(false);

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {
                console.log("Google Sign In: ", result);
            })
            .catch((err) => {
                console.log("Google Sign In Error: ", err);
            });
    };
    const logOut = () => {
        setShowLogOutModal(true);
    };

    const updateLoginUser = (user: IUser) => {
        setLoginUser((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                name: user?.name || prev.name,
                imageUrl: user?.imageUrl || prev.imageUrl,
            };
        });
    };

    const doLogOut = async () => {
        await toast.promise(signOut(auth), {
            loading: "Đang đăng xuất...",
            success: "Đăng xuất thành công",
            error: "Xảy ra lỗi khi đăng xuất",
        });
        await router.push("/");
        setShowLogOutModal(false);
    };

    useEffect(() => {
        const userService = new UserService();
        const handleServerAuthentication = async (idToken: string) => {
            try {
                const { data } = await userService.loginWithFirebaseIdToken(
                    idToken
                );
                if (!data) return;
                switch (data?.role) {
                    case Roles.CUSTOMER.id:
                        await signOut(auth);
                        toast.error(
                            "Tài khoản của bạn hiện không hỗ trợ đăng nhập bằng website. Vui lòng đăng nhập lại trên ứng dụng điện thoại."
                        );
                        return;
                    case Roles.STAFF.id:
                        await signOut(auth);
                        toast.error(
                            "Tài khoản nhân viên không hỗ trợ đăng nhập bằng website. Vui lòng đăng nhập lại trên ứng dụng điện thoại."
                        );
                        return;
                    default:
                        break;
                }
                console.log("Login User: ", data);
                setLoginUser(data);
                toast.success("Đăng nhập thành công");
            } catch (err: any) {
                await signOut(auth);
                toast.error(err?.message || "Đã xảy ra lỗi khi đăng nhập");
            }
        };
        const unsubscribe: Unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                console.log("Firebase User: ", firebaseUser);
                if (firebaseUser && firebaseUser.email !== loginUser?.email) {
                    const token = await firebaseUser.getIdToken();
                    await handleServerAuthentication(token);
                } else if (!firebaseUser) {
                    setLoginUser(null);
                }
                setAuthLoading(false);
            }
        );
        return () => unsubscribe();
    }, [auth, loginUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loginUser,
                updateLoginUser,
                authLoading,
                handleGoogleSignIn,
                logOut,
            }}
        >
            {authLoading ? <LoadingProgress /> : children}
            {loginUser && (
                <LogoutModal
                    doLogout={doLogOut}
                    isOpen={showLogOutModal}
                    onClose={() => setShowLogOutModal(false)}
                />
            )}
        </AuthContext.Provider>
    );
};