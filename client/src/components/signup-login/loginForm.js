import React, { useState } from 'react';
import '../../assets/css/loginForm.css'
import {Link} from "react-router-dom"

export default function Login(){
    const [loginCred, setLoginCred] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginCredChange = (e) => {
        setLoginCred(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const body = {
            login: loginCred,
            password: password
        }

        await fetch('/api/user/login', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(body),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // check the response data
          
            if (data.message === 'Successful login') {
              window.location.replace('/') // access the userData object
            }
          })
          .catch(error => console.error(error));
    }

    return(
        <main className='login-main'>
            <div className='login-q-backplate'></div>
            <div className='login-q'>Dont have an account yet? 
                <Link className='login-link' to={'/signup'}> Create an Account</Link>
            </div>
            <div className='login-form-backplate'></div>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-title'><b>Login</b></div>
                <div className='login-credential'>
                    <label className='lbl-credential'>Username or Email</label>
                    <input type='text' className='txt-credential login-inp' placeholder='Username or Email'onChange={handleLoginCredChange}/>
                </div>

                <div>
                    <label className='lbl-password'>Password: </label>
                    <input type='password' className='txt-password login-inp' placeholder='Password' onChange={handlePasswordChange}/>
                </div>
                
                <button className='login-submit-btn' type='subimt'>Login</button>

            </form>
        </main>
    )
}