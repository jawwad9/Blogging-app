import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import app from "./firebaseconfig";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const auth = getAuth(app);

// Initialize Firestore database
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Register user
const signUpUser = (obj) => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
      .then(async (res) => {
        obj.id = res.user.uid; // Set user ID
        try {
          await addDoc(collection(db, "users"), obj);
          console.log("User added to database successfully");
          resolve(obj.id); // Resolve with user ID
        } catch (err) {
          console.error("Error adding user to Firestore:", err);
          reject(err);
        }
      })
      .catch((err) => {
        console.error("Error signing up user:", err);
        reject(err.message);
      });
  });
};

// Login user
const loginUser = (obj) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, obj.email, obj.password)
      .then(async () => {
        const q = query(collection(db, "users"), where("id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          resolve(doc.data());
        });
      })
      .catch((err) => {
        console.error("Error logging in user:", err);
        reject(err);
      });
  });
};

// Sign out user
const signOutUser = () => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        reject(error);
      });
  });
};

// Send data to Firestore
const sendData = (obj, colName) => {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, colName), obj)
      .then((res) => {
        resolve("Data sent to Firestore successfully");
      })
      .catch((err) => {
        console.error("Error sending data to Firestore:", err);
        reject(err);
      });
  });
};

// Get data with uid from Firestore
const getData = (colName, uid) => {
  return new Promise(async (resolve, reject) => {
    const dataArr = [];
    try {
      const q = query(collection(db, colName), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArr.push(doc.data());
      });
      resolve(dataArr); // Resolve with the fetched data
    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
      reject("Error occurred while fetching data");
    }
  });
};

// Get all data from Firestore
const getAllData = (colName) => {
  return new Promise(async (resolve, reject) => {
    const dataArr = [];
    try {
      const querySnapshot = await getDocs(collection(db, colName));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), documentId: doc.id };
        dataArr.push(obj);
      });
      resolve(dataArr); // Resolve with the fetched data
    } catch (err) {
      console.error("Error fetching all data from Firestore:", err);
      reject("Error occurred while fetching all data");
    }
  });
};

// Delete document by ID
const deleteDocument = async (id, name) => {
  try {
    const docRef = doc(db, name, id);
    await deleteDoc(docRef); // Delete document from Firestore
    return "Document deleted successfully";
  } catch (err) {
    console.error("Error deleting document:", err);
    throw new Error("Error occurred while deleting document");
  }
};

// Update document by ID
const updateDocument = async (obj, id, name) => {
  try {
    const docRef = doc(db, name, id);
    await updateDoc(docRef, obj); // Update document in Firestore
    return "Document updated successfully";
  } catch (err) {
    console.error("Error updating document:", err);
    throw new Error("Error occurred while updating document");
  }
};

// Upload image to Firebase Storage and get download URL
const uploadImage = async (files, email) => {
  const storageRef = ref(storage, email); // Store image with email as reference
  try {
    const uploadImg = await uploadBytes(storageRef, files); // Upload image
    const url = await getDownloadURL(storageRef); // Get download URL of uploaded image
    console.log(url); // Log the URL
    return url; // Return the URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image");
  }
};

export {
  auth,
  db,
  signUpUser,
  loginUser,
  signOutUser,
  sendData,
  getData,
  getAllData,
  deleteDocument,
  updateDocument,
  uploadImage,
};
