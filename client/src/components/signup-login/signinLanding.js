import React from 'react';
import {Link} from 'react-router-dom';
import '../../assets/css/signinLanding.css'

export default function Signin() {
    return(
        <main className='signin-main'>
            <Link to={'/signup'}>signup</Link>
            <Link to={'/login'}>login</Link>
        </main>
    )
}