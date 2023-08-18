import React, { useState } from 'react';
import '../../assets/css/signup.css'
import {Link} from "react-router-dom"

export default function Signup(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [availability, setAvailability] = useState("")

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }
    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }
    const handleUserNameChange = (e) => {
        setUsername(e.target.value)
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleRePassword = (e) => {
        setRePassword(e.target.value)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(firstName && lastName && username && email && (password === rePassword)) {

            const body = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                email: email,
                password: password
            };
            //TODO: CREATE USER/CREATE ROUTE
            const response = await fetch('/api/user/create', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });

            if(response.ok){
                //REDIRECT TO HOMEPAGE
                window.location.replace('/')
            }

            console.log(body)
        }else{
            return <div>test</div>
        }
    }
    // 
    //

    function checkUsername(e){
        e.preventDefault()
        fetch(`/api/user/username?username=${username}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)            
            setAvailability(data.message)
            const lblAvailability = document.getElementById('username-availability')
            lblAvailability.classList.add(data.message === "Available" ? "available" : "unavailable")
            lblAvailability.classList.remove(data.message === "Available" ? "unavailable" : "available")
        })
    }
    


    return(
        <main className='signup-main'>
            <div className='login-q-backplate'></div>
            <div className='login-q'>Already have an acccount? 
                <Link className='login-link' to={'/login'}> Login</Link>
            </div>
            <div className='form-backplate'></div>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <div className='signup-title'><b>Signup</b></div>
                <div className='form-input-field'>
                    <label className="input-label">First Name:</label>
                    <input className="form-input" type="text" id="first-name-sign-up" onChange={handleFirstNameChange} />
                </div>
        
                <div className='form-input-field'>
                    <label className='input-label'>Last Name:</label>
                    <input className="form-input" type="text" id="last-name-sign-up" onChange={handleLastNameChange} />
                </div>

                <div className='form-input-field'>
                    <label className="input-label">Email:</label>
                    <input className="form-input" type="email" id="email-sign-up" onChange={handleEmailChange}/>
                </div>

                <div className='form-input-field'>
                    <label className="input-label">Username:</label>
                    <input className="form-input" type="text" id="username-sign-up" onChange={handleUserNameChange}/>
                    {/* <button className='availability' onClick={checkUsername}>Check username availability</button> */}
                    <label id='username-availability'>{availability}</label>
                </div>

                <div className='form-input-field'>
                    <label className="input-label">Password:</label>
                    <input className="form-input" type="password" id="password-sign-up" onChange={handlePasswordChange}/>
                </div>    

                <div className='form-input-field'>
                    <label className="input-label">Re-enter Password:</label>
                    <input className="form-input" type="password" id="retype-password" onChange={handleRePassword}/>
                </div>
                
                <button type='submit' id="submit-sign-up" className="signup-btn">Sign up!</button>
            </form>
        </main>
    )
}
