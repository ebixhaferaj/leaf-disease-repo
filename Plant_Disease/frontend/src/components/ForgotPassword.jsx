// components/ForgotPasswordRequest.jsx
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import instance from "../api/axios";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_URL = "/auth/password-reset-request";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const userRef = useRef();
  const errRef = useRef();

  const [backendMsg, setBackendMsg] = useState("");
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [email]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!EMAIL_REGEX.test(email)) {
      setErrMsg("Invalid Email");
      setLoading(false);
      return;
    }

    try {
      const response = await instance.post(
        REQUEST_URL,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setBackendMsg(response.data.message || "Password reset email sent.");
      setSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <section className="max-w-md mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
          <ClipLoader color="#2F855A" loading={loading} size={35} />
        </section>
      ) : success ? (
        <section className="max-w-md mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
          <p className="text-green-700 font-semibold text-center">{backendMsg}</p>
          <p className="text-gray-600 text-center">Redirecting to login page...</p>
        </section>
      ) : (
        <section className="max-w-md mx-auto p-8 mt-12 bg-white rounded-lg shadow-lg font-inter">
          <p
            ref={errRef}
            className={`${errMsg ? "text-red-600 mb-4" : "hidden"}`}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="text-3xl font-bold mb-6 text-center text-green-800 tracking-wide">
            Reset Password
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium mb-1 text-gray-900">
                Email:
                <span className={`${validEmail ? "text-green-700 ml-1" : "hidden"}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={`${validEmail || !email ? "hidden" : "text-red-600 ml-1"}`}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="text"
                id="email"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <p
                id="uidnote"
                className={`${userFocus && email && !validEmail ? "text-sm text-gray-500 mt-1" : "hidden"}`}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Must be a valid email format like user@example.com.
              </p>
            </div>
            {/* Submit button */}
            <button
              disabled={!validEmail}
              className={`w-full py-3 rounded-md text-white font-semibold transition
              ${
                validEmail
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Send Reset Link
            </button>
          </form>
          <p className="pt-5 text-sm text-center text-gray-600">
            Remembered your password?{" "}
            <Link to="/login" className="text-green-700 hover:underline font-medium">
              Log In
            </Link>
          </p>
        </section>
      )}
    </>
  );
};

export default ForgotPassword;
