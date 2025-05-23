import { useRef, useState, useEffect, useContext } from "react";
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import instance from "../api/axios";
import { Leaf } from 'lucide-react';

const LOGIN_URL = '/auth/token';

const Login = () => {

    const { setAuth } = useAuth();
    const userRef = useRef();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const [userFocus, setUserFocus] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await instance.post(
                LOGIN_URL,
                {
                    email,
                    password: pwd,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setSuccess(true);
            toast.success("Login successful");
            console.log('Login response:', response.data);
            
            // TODO: Handle saving the token / redirecting user
            const accessToken = response?.data.access_token;
            const refreshToken = response?.data.refresh_token;
            
            const role = response?.data?.role;
            const roles = Array.isArray(role) ? role : [role];

            setAuth({ 
                email, 
                roles, 
                accessToken })
                
            console.log({setAuth})
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("role", JSON.stringify(roles));
            localStorage.setItem("email", email);

            if (roles.includes('farmer')) {
                navigate('/farmer/home');
            } else if (roles.includes('user')) {
                navigate('/user/home');
            } else {
                navigate('/');
            }

        } catch (err) {
            if (!err?.response) {
                toast.error("No Server Response");
            } else if (err.response?.status === 401) {
                toast.error("Invalid email or password.");
            } else {
                toast.error("Login Failed");
            }
        } finally{
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? ( 
            <section className="max-w-md mx-auto p-8 mt-12 flex flex-col items-center justify-center space-y-4 font-inter">
                <ClipLoader color="#2F855A" loading={loading} size={35} />
            </section>
            ) : (
            <section className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold mb-6 text-center text-leaf-800 font-inter tracking-wide">
                    Welcome back, plant saver!
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block font-semibold mb-2 text-gray-900 font-inter items-center">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            placeholder="user@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-leaf-400 transition-shadow duration-200"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block font-semibold mb-2 text-gray-900 font-inter items-center">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-leaf-400 transition-shadow duration-200"
                        />

                    </div>
                    <button
                        className={"bg-leaf-700 hover:bg-leaf-800 focus:ring-4 focus:ring-leaf-300 cursor-pointer w-full py-2 rounded-md text-white font-semibold transition"}
                    >
                        Log In
                    </button>
                </form>
                <div className="pt-5 text-center">
                    <Link to="/forgot-password" className=" text-sm  700 hover:underline font-medium">
                        Forgot Password
                    </Link>
                </div>
                <p className="pt-5 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-leaf-700 hover:underline font-medium">
                        Register
                    </Link>
                </p>
            </section>
            )}
        </>
    );
};

export default Login;
