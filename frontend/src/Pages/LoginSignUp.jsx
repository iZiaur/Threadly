import "./css/LoginSignup.css"
import { useState, useContext } from "react";
import { toast } from 'react-toastify';
import { ShopContext } from "../Context/ShopContext";

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
function LoginSignUp(){
    const[state,setstate]=useState("Login");
    const { setServerDown } = useContext(ShopContext);
    const [formdata,setformdata]=useState({
        username:"",
        password:"",
        email:""
    })

    async function login(){
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata),
            });

            const responseData = await response.json();
            setServerDown(false);

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                console.log("Response:", responseData);

                localStorage.setItem("login-time", new Date().getTime().toString());
                // Redirect
                window.location.href = "/";
                
            } else {
                toast.error(responseData.message || "Invalid Credentials");
            }
        } catch (error) {
            setServerDown(true);
            toast.error("Backend Server is currently down or unreachable.");
        }
    }
    









     async function signup(){
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata),
            });

            const responseData = await response.json();
            setServerDown(false);

            if (responseData.success) {
                localStorage.setItem("auth-token", responseData.token);
                console.log("Response:", responseData);

                localStorage.setItem("login-time", new Date().getTime().toString());
                // Redirect
                window.location.href = "/";
                toast.success(`Welcome ${formdata.username}`);
            } else {
                toast.error(responseData.message || "Signup failed");
            }
        } catch (error) {
            setServerDown(true);
            toast.error("Backend Server is currently down or unreachable.");
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