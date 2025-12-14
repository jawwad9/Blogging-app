import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase/firebasefunctions';
import { onAuthStateChanged, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Profile = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          console.log("User Data:", userDoc);
          setUserinfo(userDoc);
        } else {
          console.log("No user data found for UID");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User UID:", user.uid);
        await fetchUserData(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert('Password should be at least 6 characters long.');
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert('Password updated successfully.');
        setNewPassword('');
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert('Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
       <div className='bg-white'>
          <h1 className='px-14 py-5 text-5xl mb-10 font-bold '>Profile</h1>
        </div>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        {userinfo ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
            <div className="flex items-center mb-4">
              <img
                src={userinfo.userImage || 'https://via.placeholder.com/150'}
                alt={`${userinfo.userData?.firstname || 'User'}'s profile`}
                className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{userinfo.userData?.firstname || 'N/A'}</h2>
                <p className="text-gray-600">{userinfo.userData?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Update Password</h3>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              />
              <button
                onClick={handlePasswordUpdate}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update Password
              </button>
            </div>
          </>
        ) : (
          <h2 className="text-xl font-semibold text-center">Loading user data...</h2>
        )}
      </div>
    </div>
  );
};

export default Profile;
