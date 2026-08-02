import "./css/LoginSignup.css"
<<<<<<< HEAD
import { useState } from "react";
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
=======
import { useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
>>>>>>> ebdaa90 (fixed route)
function LoginSignUp(){
    const[state,setstate]=useState("Login");
    const { setServerDown } = useContext(ShopContext);
    const [formdata,setformdata]=useState({
        username:"",
        password:"",
        email:""
    })

    async function login(){
<<<<<<< HEAD
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formdata),
        });
=======
        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata),
            });
>>>>>>> ebdaa90 (fixed route)

            const responseData = await response.json();
            setServerDown(false);

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                console.log("Response:", responseData);

<<<<<<< HEAD
        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            localStorage.setItem("login-time", new Date().getTime().toString());
            console.log("Response:", responseData);

            // Redirect
            window.location.href = "/";
            
        } else {
            toast.error(responseData.message || "Invalid Credentials");
=======
                // Redirect
                window.location.href = "/";
                
            } else {
                alert(responseData.message || "Invalid Credentials");
            }
        } catch (error) {
            setServerDown(true);
            alert("Backend Server is currently down or unreachable.");
>>>>>>> ebdaa90 (fixed route)
        }
    }
    









     async function signup(){
<<<<<<< HEAD
    
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formdata),
        });
=======
        try {
            const response = await fetch("http://localhost:4000/signup", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata),
            });
>>>>>>> ebdaa90 (fixed route)

            const responseData = await response.json();
            setServerDown(false);

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                console.log("Response:", responseData);

<<<<<<< HEAD
        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            localStorage.setItem("login-time", new Date().getTime().toString());
            console.log("Response:", responseData);

            // Redirect
            window.location.href = "/";
            toast.success(`Welcome ${formdata.username}`)
        } else {
            toast.error(responseData.message || "Signup failed");
=======
                // Redirect
                window.location.href = "/";
                alert(`Welcome ${formdata.username}`)
            } else {
                alert(responseData.message || "Signup failed");
            }
        } catch (error) {
            setServerDown(true);
            alert("Backend Server is currently down or unreachable.");
>>>>>>> ebdaa90 (fixed route)
        }
    }

    function changeHandler(e){
        setformdata({
            ...formdata,[e.target.name]:e.target.value
        })
    }

    
    return (
        <div className="loginsignup">
            <div className="loginsignupcontainer">
                <h1>{state}</h1>
                <div className="loginsignupfields">
                    {state==="Sign Up"?<input name="username" value={formdata.username} onChange={changeHandler}type="text" placeholder="Your Name" />:<></>}
                    <input name="email" value={formdata.email} onChange={changeHandler} type="email" placeholder="Email Address"/>
                    <input name="password" value={formdata.password} onChange={changeHandler} type="password" placeholder="Password"/>

                </div>
                <button onClick={(state==="Sign Up")?(()=>signup()):(()=>login())}>Continue</button>
                {state==="Sign Up"? <p className="loginsignup-login">Already have an account?<span onClick={()=>setstate("Login")}>Login here</span></p>:<p className="loginsignup-login">Create an Account <span onClick={()=>setstate("Sign Up")}>Click here</span></p>}
               
                
                <div className="loginsignup-agree">
                    <input type="checkbox" name='' id=''/>
                    <p>By Continuing, I agree to terms of use & privacy policy</p>
                </div>
            </div>





        </div>
    )
}

export default LoginSignUp;