import React, { useEffect, useRef, useState } from 'react';
import { auth, db, getData, sendData, updateDocument, deleteDocument } from '../config/firebase/firebasefunctions';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();

  const [userinfo, setUserinfo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchBlogs(user.uid);
        await fetchUserData(user.uid);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setUserinfo(userDoc);
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchBlogs = async (uid) => {
    try {
      const blogsData = await getData("blogs", uid);
      const blogsWithId = blogsData.map((doc) => ({ ...doc, id: doc.id })); // Adding ID to each blog
      setBlogs(blogsWithId || []);
    } catch (error) {
      console.error("Error fetching blogs data:", error);
    }
  };

  const sendDatatoFirestore = async (event) => {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descriptionRef.current.value;

    if (!title || !description) {
      alert('Both title and description are required');
      return;
    }

    if (!userinfo) {
      alert('User information is not loaded yet. Please wait.');
      return;
    }

    try {
      const newBlog = {
        title,
        description,
        uid: auth.currentUser.uid,
        userinfo: userinfo,
      };

      const response = await sendData(newBlog, 'blogs'); // Assuming sendData returns a response with the ID
      const blogWithId = { ...newBlog, id: response.id };  // Assuming the response contains an ID
      setBlogs([...blogs, blogWithId]); // Add the new blog with ID to state

      titleRef.current.value = '';
      descriptionRef.current.value = '';
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const handleEdit = async (blog) => {
    const newTitle = prompt("Enter new title:", blog.title);
    const newDescription = prompt("Enter new description:", blog.description);

    if (!newTitle || !newDescription) {
      alert("Title and description cannot be empty");
      return;
    }

    if (!blog.id) {
      alert("Invalid blog ID");
      return;
    }

    try {
      await updateDocument("blogs", blog.id, { title: newTitle, description: newDescription });

      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, title: newTitle, description: newDescription } : b));
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid blog ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDocument(id, "blogs");
        setBlogs(blogs.filter(blog => blog.id !== id));
        alert("Blog deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-6 flex-1">
        <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center">Dashboard</h1>
        </div>

        <form onSubmit={sendDatatoFirestore} className="bg-white shadow-md rounded-lg p-8 mt-8">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Enter blog title" 
              ref={titleRef} 
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="mb-6">
            <textarea 
              cols="25" 
              rows="5" 
              placeholder="Enter blog description" 
              ref={descriptionRef} 
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Add Blog
          </button>
        </form>

        <h1 className="text-3xl font-semibold text-center my-8">User Blogs</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {loading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            <>
              {blogs.length > 0 ? blogs.map((item, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                  <div className="flex items-center p-6">
                    <img
                      src={item.userinfo.userImage || "https://via.placeholder.com/150"} // Default image
                      alt={`${item.userinfo.email}'s profile`}
                      className="w-16 h-16 rounded-full border-2 border-gray-300 mr-4 object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-semibold">{item.title}</h2>
                      <p className="text-gray-500 text-sm">Posted by: {item.userinfo.email}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 px-6 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center p-4 border-t">
                    <button 
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                      onClick={() => handleEdit(item)}
                    >
                      Edit  

                    </button>
                    <button 
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )) : (
                <h2 className="text-xl font-semibold text-center col-span-full h-screen bg-gray-100 ">No blogs found</h2>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
