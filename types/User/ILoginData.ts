export interface ILoginData {
  id: string;
  accessToken: string;
  isFirstLogin: boolean;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: number;
  dob: string | null;
  imageUrl: string | null;
}
