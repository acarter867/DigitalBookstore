import React, { useEffect, useState } from 'react'
import '../assets/css/nav.css'
import { Link } from 'react-router-dom'

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/user/admin', {credentials: 'include'})
    .then(response => response.json())
    .then(data => {
      setIsAdmin(data.isAdmin)
    })
    .catch(err => err.json())
  }, []);

  return (
    <header className="header">
      <section className="header-container">
        <nav className="navbar">
          <ul>
            <li><a href='/'>Homepage</a></li>
            {isAdmin && <li><a href="/admin">Admin</a></li>}
          </ul>
        </nav>
      </section>
    </header>
  );
}

export default Navbar;