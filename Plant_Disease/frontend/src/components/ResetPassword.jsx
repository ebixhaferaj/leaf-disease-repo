import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import instance from "../api/axios";
import Spinner from "../components/Spinner"

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ResetPassword = () => {
    const { token } = useParams();  // get token from URL
    const navigate = useNavigate();
    const errRef = useRef();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [backendMsg, setBackendMsg] = useState("");

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validPwd || !validMatch) {
            setErrMsg("Invalid input.");
            setLoading(false);
            return;
        }

        try {
            const response = await instance.post(
                `/auth/password-reset-confirm/${token}`,
                JSON.stringify({ new_password: pwd, confirm_password: matchPwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setBackendMsg(response.data.message || "Password successfully reset.");
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                toast.error("No Server Response");
            } else if (err.response?.status === 400) {
                toast.error("Invalid or expired reset link.");
            } else {
                toast.error("Reset failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading ? (
            <section>
                <Spinner/>
            </section>
        ) : success ? (
            <section className="max-w-md mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
                <p className="text-green-700 font-semibold text-center">{backendMsg}</p>
                <p className="text-gray-600 text-center">Redirecting to login page...</p>
            </section>
        ) : (
            <section className="w-full max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg font-inter">
  <p
    ref={errRef}
    className={`${errMsg ? "text-red-600 text-sm mb-4 text-center" : "hidden"}`}
    aria-live="assertive"
  >
    {errMsg}
  </p>

  <h1 className="text-3xl font-bold mb-6 text-center text-green-800 tracking-wide">
    Reset Password
  </h1>

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* New Password */}
    <div>
      <label htmlFor="password" className="block text-gray-800 font-medium mb-1">
        New Password
        <span className={`${validPwd ? "text-green-600 ml-1" : "hidden"}`}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={`${validPwd || !pwd ? "hidden" : "text-red-600 ml-1"}`}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>
      <input
        type="password"
        id="password"
        onChange={(e) => setPwd(e.target.value)}
        onFocus={() => setPwdFocus(true)}
        onBlur={() => setPwdFocus(false)}
        required
        className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      />
      <p className={`${pwdFocus && !validPwd ? "text-sm text-gray-500 mt-1" : "hidden"}`}>
        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
        8+ characters, including uppercase, lowercase, number, and symbol.
      </p>
    </div>

    {/* Confirm Password */}
    <div>
      <label htmlFor="confirm_pwd" className="block text-gray-800 font-medium mb-1">
        Confirm Password
        <span className={`${validMatch && matchPwd ? "text-green-600 ml-1" : "hidden"}`}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={`${validMatch || !matchPwd ? "hidden" : "text-red-600 ml-1"}`}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>
      <input
        type="password"
        id="confirm_pwd"
        onChange={(e) => setMatchPwd(e.target.value)}
        onFocus={() => setMatchFocus(true)}
        onBlur={() => setMatchFocus(false)}
        required
        className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      />
      <p className={`${matchFocus && !validMatch ? "text-sm text-gray-500 mt-1" : "hidden"}`}>
        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
        Must match the password above.
      </p>
    </div>

    {/* Submit Button */}
    <button
      disabled={!validPwd || !validMatch}
      className={`w-full py-3 rounded-md text-white font-semibold transition ${
        validPwd && validMatch
          ? "bg-green-700 hover:bg-green-800"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      Change Password
    </button>
  </form>
</section>
        )}
        </>
    );
};

export default ResetPassword;
