import React, { useState } from 'react';
import "../../assets/css/createCategory.css"

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
        <div className='create-category-container'>
            <div className='create-text-submit-wrapper'>
                <div className='create-text'>
                    Create New Category
                </div>
                <form className='create-category' onSubmit={handleSubmit}>
                    <input className='category-input' type='text' placeholder='Enter Category' onChange={handleInputChange}/>
                    <button className='submit' type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}