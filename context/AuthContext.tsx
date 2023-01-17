import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  Unsubscribe,
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

export interface IAuthContext {
  user: any;
  loginUser: ILoginData | null;
  authLoading: boolean;
  handleGoogleSignIn: () => void;
  logOut: () => void;
}

const AuthContext = createContext({} as IAuthContext);
export const useAuth: () => IAuthContext = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginUser, setLoginUser] = useState<ILoginData | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [showLogOutModal, setShowLogOutModal] = useState<boolean>(false);

  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        console.log("Google Sign In: ", result);
        toast.success("Đăng nhập thành công");
      })
      .catch((err) => {
        console.log("Google Sign In Error: ", err);
      });
  };
  const logOut = () => {
    setShowLogOutModal(true);
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
    const handleServerAuthentication = async (firebaseUser: any) => {
      try {
        const { data } = await userService.loginWithFirebaseIdToken(
          firebaseUser?.accessToken
        );
        if (data) {
          setLoginUser(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: any) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          if (loginUser?.email !== firebaseUser?.email) {
            await handleServerAuthentication(firebaseUser);
          }
        } else {
          setUser(null);
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
