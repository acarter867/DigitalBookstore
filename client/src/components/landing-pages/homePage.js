import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


export default function HomePage(){
    const [query, setQuery] = useState("")
    useEffect(() => {

    }, [])


    function getAllBooks(){
        fetch('/api/search/book/category/5', {
          "category_id": 5
        })
        .then(result => result.json())
        .then(data => console.log(data))
    }
    

    async function handleLogout(){
        const response = await fetch('/api/user/logout', {
          credentials: 'include',
          method: "POST"
        })
        if (response.ok) {
          console.log("Logged out successfully");
          window.location.reload()
        } else {
          console.log("Logout failed");
        }
    }
    

    const downloadPdf = async (key) => {
        try {
          const response = await fetch(`/api/download/${key}`);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', key);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.log(error);
        }
      }

    return(
        <>
        <button onClick={() => downloadPdf('Hide&Seek-Hard Cover.pdf')}>Download PDF</button>
        <Link to='/admin'>
          <button>
            ADMIN
          </button>
        </Link>
        <Link to='/signup'>
          <button>
            Sign up!
          </button>
        </Link>
    
        <Link to={'/login'}>
          <button>Login!</button>
        </Link>
    
        <Link to={'/'}>
          <button onClick={handleLogout}>logout!</button>
        </Link>
      
        </>

    )
}