import React, { useState } from 'react';

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
        <div>
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='login-credential'>
                    <label className='lbl-credential'>Username or Email</label>
                    <input type='text' className='txt-credential' placeholder='Username or Email'onChange={handleLoginCredChange}/>
                </div>

                <div>
                    <label className='lbl-password'>Password: </label>
                    <input type='password' className='txt-password' placeholder='Password' onChange={handlePasswordChange}/>
                </div>
                
                <button type='subimt'>Login</button>

            </form>
        </div>
    )
}