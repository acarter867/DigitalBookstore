import React, { useState } from 'react';
import UploadForm from './uploadForm';
import CreateCategory from './createCategory';
import CreateBrand from './createBrand';
import PdfUpload from './pdfUpload';
import "../../assets/css/admin.css"



export default function Admin() {

    return(        
        <div className='admin-main'>       
            <CreateCategory/>
            <CreateBrand/>
            <PdfUpload/>
        </div> 
    );




}