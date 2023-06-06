import React, { useState } from 'react';

export default function CreateBrand(){
    const [brand, setBrand] = useState("");

    const handleSubmit = async (e) =>{
        const body = {
            brand_name: brand
        };
        const response = await fetch(' /api/upload/brand', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
        if(response.ok){
            console.log("IT WORKED")
        }
    }

    const handleInputChange = (e) => {
        setBrand(e.target.value)
    }

    return(
        <div>
            <div>
                Create New Brand
            </div>
            <form className='create-category' onSubmit={handleSubmit}>
                <input type='text' placeholder='Enter Brand' onChange={handleInputChange}/>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}