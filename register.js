import {createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";


import { auth, } from "./config.js";

const firstName = document.querySelector("#firstname")
const lastName = document.querySelector("#lastname")
const password = document.querySelector("#password")
const email = document.querySelector("#email")
const form = document.querySelector("#form")


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log(firstName.value)
    console.log(lastName.value)
    console.log(email.value)
    console.log(password.value)
    
    createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user.uid);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });

})




