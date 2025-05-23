import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const RedirectIfLoggedIn = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (auth?.accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;
