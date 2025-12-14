import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState,  useEffect } from 'react';
import { loginUser,auth } from '../config/firebase/firebasefunctions'; // Make sure this function handles login properly
import { onAuthStateChanged } from 'firebase/auth';

const Login = () => {

  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.uid);
        
        navigate('/Dashboard')

   }
    });
  }, []);

  
  let [user, setUser] = useState(null);
  let emailval = useRef(null);
  let passwordval = useRef(null);

  function getUser(event) {
    event.preventDefault();
    const userData = {
      email: emailval.current.value,
      password: passwordval.current.value,
    };
    setUser(userData);
    console.log(userData);

    loginUser(userData)
      .then(() => {
        // Navigate to a different page after successful login
        navigate('/dashboard'); // Update this route to whatever fits your app
      })
      .catch((error) => {
        // Handle errors (display a message, etc.)
        console.error("Login failed", error);
        alert("Login failed! Please check your credentials.");
      });
  }

  return (
    <>
      <div className='bg-gray-200'>
        <div className='bg-white'>
          <h1 className='px-14 py-5 text-5xl mb-10 font-bold'>LogIn</h1>
        </div>

        <div className=" min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xs">
        <h1 className="text-center text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={getUser} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="text"
              ref={emailval}
              placeholder="Email"
              className="input input-bordered input-neutral w-full bg-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          {/* Password Input */}
          <div>
            <input
              type="password"
              ref={passwordval}
              placeholder="Password"
              className="input input-bordered input-neutral w-full bg-white focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 bg-[#7749F8] text-white border-none hover:bg-[#5e3acd] rounded-lg w-full"
            >
              Login
            </button>
          </div>
          {/* Register Link */}
          <div className="mt-5 text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
      </div>
    </>
  );
}

export default Login;
