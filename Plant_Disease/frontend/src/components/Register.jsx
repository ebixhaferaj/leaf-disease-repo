import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import instance from "../api/axios";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const REGISTER_URL = "/auth";

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [backendMsg, setBackendMsg] = useState("");

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => userRef.current?.focus(), []);
    useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);
    useEffect(() => setErrMsg(""), [email, pwd, matchPwd]);
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate("/login"), 5000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrMsg("");

        if (!EMAIL_REGEX.test(email) || !PASSWORD_REGEX.test(pwd)) {
            setErrMsg("Invalid Entry");
            setLoading(false);
            return;
        }

        try {
            const response = await instance.post(
                REGISTER_URL,
                JSON.stringify({ username, email, password: pwd, role }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setBackendMsg(response.data.message);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                toast.error("No Server Response");
            } else if (err.response?.status === 409) {
                const errorDetail = err.response.data?.detail;
                if (typeof errorDetail === "string") {
                    if (errorDetail.toLowerCase().includes("username")) {
                        toast.error("Username already taken.");
                    } else if (errorDetail.toLowerCase().includes("email")) {
                        toast.error("Email already registered.");
                    } else {
                        toast.error(errorDetail);
                    }
                } else {
                    toast.error("Conflict: Username or Email already in use.");
                }
            } else {
                toast.error("Registration Failed. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <section className="max-w-sm mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
                    <ClipLoader color="#2F855A" loading={loading} size={35} />
                </section>
            ) : success ? (
                <section className="max-w-md mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
                    <p className="text-leaf-700 font-semibold text-center">{backendMsg}</p>
                    <p className="text-gray-600 text-center">Redirecting to login page...</p>
                </section>
            ) : (
                <section className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
                    <p ref={errRef} className={`${errMsg ? "text-red-600 mb-4" : "hidden"}`} aria-live="assertive">
                        {errMsg}
                    </p>
                    <h1 className="text-4xl font-bold mb-6 text-center text-leaf-800 tracking-wide">
                        Register
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block font-medium mb-1 text-gray-900">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-400 transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block font-medium mb-1 text-gray-900">
                                Email:
                                <span className={`${validEmail ? "text-leaf-700 ml-1" : "hidden"}`}>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-400 transition"
                            />
                            <p
                                id="uidnote"
                                className={`${userFocus && email && !validEmail ? "text-sm text-gray-500 mt-1" : "hidden"}`}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                Must be a valid email format like user@example.com.
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block font-medium mb-1 text-gray-900">
                                Password:
                                <span className={`${validPwd ? "text-leaf-700 ml-1" : "hidden"}`}>
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
                                required
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-400 transition"
                            />
                            <p className={`${pwdFocus && !validPwd ? "text-sm text-gray-500 mt-1" : "hidden"}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                8+ characters, upper & lower case, digit, and symbol '@$!%*?&'
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirm_pwd" className="block font-medium mb-1 text-gray-900">
                                Confirm Password:
                                <span className={`${validMatch && matchPwd ? "text-leaf-700 ml-1" : "hidden"}`}>
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
                                required
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-400 transition"
                            />
                            <p className={`${matchFocus && !validMatch ? "text-sm text-gray-500 mt-1" : "hidden"}`}>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                Must match the password above.
                            </p>
                        </div>

                        {/* Role Buttons */}
                        <label className="block font-medium mb-2 text-gray-900">
                            What best describes you?
                        </label>
                        <div className="flex space-x-3">
                            {["user", "farmer"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setRole(option)}
                                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition
                                        ${
                                            role === option
                                                ? "bg-leaf-700 text-white border-leaf-700"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {option === "user" ? "Regular User" : "Farmer"}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-leaf-700 text-white py-2 px-4 rounded-md hover:bg-leaf-800 transition"
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-700 text-center">
                        Already registered?{" "}
                        <Link to="/login" className="text-leaf-700 font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </section>
            )}
        </>
    );
};

export default Register;
