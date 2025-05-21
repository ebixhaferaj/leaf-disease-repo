//import { useRef, useState, useEffect } from "react";
//import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import axios from "../api/axios";
//import { toast } from 'react-hot-toast';
//
//const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const PASSWORD_REGEX = 8;
//
//const LOGIN_URL = '/auth/token';
//
//const Login = () => {
//    const userRef = useRef();
//
//    const [email, setEmail] = useState('');
//    const [validEmail, setValidEmail] = useState(false);
//    const [userFocus, setUserFocus] = useState(false);
//
//    const [pwd, setPwd] = useState('');
//    const [validPwd, setValidPwd] = useState(false);
//    const [pwdFocus, setPwdFocus] = useState(false);
//
//    const [role, setRole] = useState('user');
//
//    useEffect(() => {
//        userRef.current.focus();
//    }, []);
//
//    useEffect(() => {
//        setValidEmail(EMAIL_REGEX.test(email));
//    }, [email]);
//
//    useEffect(() => {
//        setValidPwd(PASSWORD_REGEX.test(pwd));
//    }, [pwd]);
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//
//        if (!validEmail || !validPwd) {
//            toast.error("Invalid Email or Password");
//            return;
//        }
//
//        try {
//            const response = await axios.post(
//                LOGIN_URL,
//                {
//                    email,
//                    password: pwd,
//                    role
//                },
//                {
//                    headers: { "Content-Type": "application/json" },
//                    withCredentials: true,
//                }
//            );
//            toast.success("Login successful");
//            // TODO: Handle saving the token / redirecting user
//        } catch (err) {
//            if (!err?.response) {
//                toast.error("No Server Response");
//            } else if (err.response?.status === 401) {
//                toast.error("Invalid email or password.");
//            } else {
//                toast.error("Login Failed");
//            }
//        }
//    };
//
//    return (
//        <section>
//            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 font-inter">Sign In</h1>
//            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
//                {/* Email */}
//                <div>
//                    <label htmlFor="email" className="block font-medium mb-1 text-gray-900 font-inter">
//                        Email:
//                        <span className={`${validEmail ? "text-green-700 ml-1" : "hidden"}`}>
//                            <FontAwesomeIcon icon={faCheck} />
//                        </span>
//                        <span className={`${validEmail || !email ? "hidden" : "text-red-600 ml-1"}`}>
//                            <FontAwesomeIcon icon={faTimes} />
//                        </span>
//                    </label>
//                    <input
//                        type="text"
//                        id="email"
//                        ref={userRef}
//                        autoComplete="off"
//                        onChange={(e) => setEmail(e.target.value)}
//                        required
//                        aria-invalid={validEmail ? "false" : "true"}
//                        onFocus={() => setUserFocus(true)}
//                        onBlur={() => setUserFocus(false)}
//                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                    />
//                    <p className={`${userFocus && email && !validEmail ? "text-sm text-gray-600 mt-1 font-inter" : "hidden"}`}>
//                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
//                        Must be a valid email format like user@example.com.
//                    </p>
//                </div>
//
//                {/* Password */}
//                <div>
//                    <label htmlFor="password" className="block font-medium mb-1 text-gray-900 font-inter">
//                        Password:
//                        <span className={`${validPwd ? "text-green-700 ml-1" : "hidden"}`}>
//                            <FontAwesomeIcon icon={faCheck} />
//                        </span>
//                        <span className={`${validPwd || !pwd ? "hidden" : "text-red-600 ml-1"}`}>
//                            <FontAwesomeIcon icon={faTimes} />
//                        </span>
//                    </label>
//                    <input
//                        type="password"
//                        id="password"
//                        onChange={(e) => setPwd(e.target.value)}
//                        required
//                        onFocus={() => setPwdFocus(true)}
//                        onBlur={() => setPwdFocus(false)}
//                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                    />
//                    <p className={`${pwdFocus && !validPwd ? "text-sm text-gray-600 mt-1 font-inter" : "hidden"}`}>
//                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
//                        8+ characters, upper & lower case, digit, and symbol.
//                    </p>
//                </div>
//
//                {/* Role */}
//                <div>
//                    <label htmlFor="role" className="block font-medium mb-1 text-gray-900 font-inter">
//                        Role:
//                    </label>
//                    <select
//                        id="role"
//                        value={role}
//                        onChange={(e) => setRole(e.target.value)}
//                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
//                    >
//                        <option value="user">User</option>
//                        <option value="farmer">Farmer</option>
//                    </select>
//                </div>
//
//                <button
//                    disabled={!validEmail || !validPwd}
//                    className={`w-full py-2 rounded-md text-white font-semibold font-inter transition ${
//                        validEmail && validPwd
//                            ? "bg-green-700 hover:bg-green-800"
//                            : "bg-gray-400 cursor-not-allowed"
//                    }`}
//                >
//                    Sign In
//                </button>
//            </form>
//        </section>
//    );
//};
//
//export default Login;
//