import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { toast } from 'react-hot-toast';




const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const REGISTER_URL = '/auth';

const Register = () => {

    const [loading, setLoading] = useState();

    const userRef = useRef();
    const errRef = useRef();

    const [backendMsg, setBackendMsg] = useState("");

    const [username, setUsername] = useState('');

    const [role, setRole] = useState('user');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PASSWORD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd]);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({
                    username,
                    email,
                    password: pwd,
                    role,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setBackendMsg(response.data.message);  // Store backend message here
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
        }
    };

    return (
        <>
        {success ? (
            <section>
                <p className="mb-4">{backendMsg}</p>
                <p>
                   test
                </p>`
            </section>
        ) : (
            <section>
                <p
                    ref={errRef}
                    className={`${errMsg ? "text-red-600 mb-4" : "hidden"}`}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 font-inter">Register</h1>
                <form  onSubmit={handleSubmit} className="flex flex-col space-y-6">
                    <div>
                        <label htmlFor="username" className="block font-medium mb-1 text-gray-900 font-inter">
                            Username:
                        </label>
                        <input
                          type="text"
                          id="username"
                          autoComplete="off"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1 text-gray-900 font-inter">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <p
                            id="uidnote"
                            className={`${userFocus && email && !validEmail ? "text-sm text-gray-600 mt-1 font-inter" : "hidden"}`}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            Must be a valid email format like user@example.com.
                        </p>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block font-medium mb-1 text-gray-900 font-inter">
                            Password:
                            <span className={`${validPwd ? "text-green-700 ml-1" : "hidden"}`}>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <p
                            className={`${pwdFocus && !validPwd ? "text-sm text-gray-600 mt-1 font-inter" : "hidden"}`}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            8+ characters, upper & lower case, digit, and symbol '!, $, #'
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirm_pwd" className="block font-medium mb-1 text-gray-900 font-inter">
                            Confirm Password:
                            <span className={`${validMatch && matchPwd ? "text-green-700 ml-1" : "hidden"}`}>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <p
                            className={`${matchFocus && !validMatch ? "text-sm text-gray-600 mt-1 font-inter" : "hidden"}`}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            Must match the password above.
                        </p>
                    </div>
                    <label htmlFor="confirm_pwd" className="block font-medium mb-1 text-gray-900 font-inter">
                            What best describes you?                        
                    </label>
                    <div className="flex space-x-2">
                        {["user", "farmer"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRole(option)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            role === option
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                        {option === "user" ? "Regular User" : "Farmer"}
                        </button>
                        ))}
                    </div>
                     {/* Hidden input for form submission */}
                    <input type="hidden" name="role" value={role} />
                    <button
                        disabled={!validEmail || !validPwd || !validMatch}
                        className={`w-full py-2 rounded-md text-white font-semibold font-inter transition ${
                            validEmail && validPwd && validMatch
                                ? "bg-green-700 hover:bg-green-800"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Sign Up
                    </button>
                </form>
            </section>
            )}
        </>
    );
};

export default Register;
