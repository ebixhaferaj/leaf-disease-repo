import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const RedirectIfLoggedIn = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth?.accessToken && auth?.role) {
    const redirectPath = auth.role === 'farmer' ? '/farmer/home' : '/user/home';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;
