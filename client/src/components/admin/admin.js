import React, { useState } from 'react';
import UploadForm from './uploadForm';
import CreateCategory from './createCategory';
import CreateBrand from './createBrand';



export default function Admin() {

    return(        
        <>        
        <UploadForm/>
        <CreateCategory/>
        <CreateBrand/>
        </>        
    );




}