import React, { useRef, useState } from 'react';
import { auth, db } from '../config/firebase/firebasefunctions'; // Assuming these are correctly set up for Firebase authentication
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const firstnameval = useRef(null);
  const emailval = useRef(null);
  const passwordval = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input
  const [userImageURL, setUserImageURL] = useState(''); // State for storing uploaded image URL

  function getUser(event) {
    event.preventDefault();
    const userData = {
      firstname: firstnameval.current.value,
      email: emailval.current.value,
      password: passwordval.current.value,
    };
    setUser(userData);

    createUserWithEmailAndPassword(auth, emailval.current.value, passwordval.current.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);

        async function addData() {
          try {
            // Upload user image to Firebase Storage
            const storage = getStorage();
            const imageFile = fileInputRef.current.files[0]; // Get the selected file
            const storageRef = ref(storage, `userImages/${user.uid}`); // Create a reference to the image

            // Upload the file
            await uploadBytes(storageRef, imageFile);
            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Image uploaded and accessible at:", imageUrl);
            setUserImageURL(imageUrl); // Save the image URL to state

            // Add user data to Firestore
            const docRef = await addDoc(collection(db, "users"), {
              userData: userData,
              userImage: imageUrl, // Store the image URL in Firestore
              uid: user.uid,
            });
            console.log("Document written with ID: ", docRef.id);
           {imageUrl && navigate("/login") } 
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }

        addData();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage)
      });

  }

  return (
    <>
      <div className='bg-gray-200 h-screen  overflow-hidden'>
        <div className='bg-white'>
          <h1 className='px-14 py-5 text-5xl mb-10 font-bold '>Register</h1>
        </div>
        <div className="flex items-center justify-center h-screen  ">
      <div className=" shadow-lg rounded-lg p-8 w-full max-w-xs bg-white">
        <h1 className="text-center text-2xl font-bold  ">Register</h1>

        {user && (
          <div role="alert" className="alert alert-success ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Your Registration has been confirmed!</span>
          </div>
        )}

        <form onSubmit={getUser} className="space-y-4">
          {/* First Name Input */}
          <input
            type="text"
            placeholder="First Name"
            ref={firstnameval}
            required
            className="input input-bordered input-neutral w-full bg-white hover:border-violet-600"
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            ref={emailval}
            required
            className="input input-bordered input-neutral w-full bg-white hover:border-violet-600"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            ref={passwordval}
            required
            className="input input-bordered input-neutral w-full bg-white hover:border-violet-600"
          />

          {/* File Input */}
          <div>
            <label className="block text-gray-600 mb-1">Upload Image:</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              required
              className="file-input w-full input-bordered bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full bg-[#7749F8] border-none hover:bg-[#5e3acd]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
      </div>
    </>
  );
};

export default Register;
