import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

interface IPostContext {
  data: any;
  setData: (data: any) => void;
}

const PostContext = createContext({} as IPostContext);
export const usePostContext = () => React.useContext(PostContext);
const PostContextProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState(null);

  return (
    <PostContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
