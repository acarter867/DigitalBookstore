import React, { useEffect, useState } from 'react'
import '../assets/css/nav.css'
import { Link } from 'react-router-dom'
import Search from '../assets/icons/search.png'
import Cart from '../assets/icons/cart.png'
import Account from '../assets/icons/account.png'

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/user/admin', {credentials: 'include'})
    .then(response => response.json())
    .then(data => {
      setIsAdmin(data.isAdmin)
    })
    .catch(err => err)
  }, []);

  return (
    <header className="header">
      <section className="header-container">
        <nav className="navbar">
          <ul>
            <Link to={'/'} className='nav-link'><img src={Search}/></Link>
            <Link to={'/admin'} className='nav-link'> Admin </Link>
            <Link to={'/signup'} className='nav-link'><img src={Account} /></Link>
            {/* <Link to={'/login'} className='nav-link'> Login </Link> */}
            <Link to={'/'} className='nav-link'> Logout </Link>

            {isAdmin && <li><a href="/admin">Admin</a></li>}
          </ul>
        </nav>
      </section>
      <div className='nav-bottom-border'></div>
    </header>
  );
}

export default Navbar;