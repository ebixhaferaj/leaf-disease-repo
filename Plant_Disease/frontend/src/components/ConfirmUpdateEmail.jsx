import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


const ConfirmUpdateEmail = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      const status = searchParams.get("status");
  
      if (status === "success") {
        setMessage("Your new email has been successfully verified.");
      } else if (status === "already_verified") {
        setMessage("Your email is already verified.");
      } else if (status === "expired") {
        setMessage("Verification link has expired.");
      }  else if (status === "already_in_use") {
          setMessage("Email is already in use. Verification failed.");
      } else if (status === "invalid") {
        setMessage("Invalid verification link.");
      } else {
        setMessage("Verification failed.");
      }
    }, [searchParams]);
  
    return (
      <>
        <h1 className="text-center text-xl font-bold mb-4">Email Verification</h1>
        <p className="text-center">{message}</p>
      </>
    );
  };
  

export default ConfirmUpdateEmail;
