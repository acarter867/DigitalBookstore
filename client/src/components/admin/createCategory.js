import React, { useState } from 'react';

export default function CreateCategory(){
    const [category, setCategory] = useState("");

    const handleSubmit = async (e) =>{
        const body = {
            category_name: category
        };
        const response = await fetch('/api/upload/category', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
        if(response.ok){
            console.log("IT WORKED")
        }
    }

    const handleInputChange = (e) => {
        setCategory(e.target.value)
    }

    return(
        <div>
            <div>
                Create New Category
            </div>
            <form className='create-category' onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Category' onChange={handleInputChange}/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}