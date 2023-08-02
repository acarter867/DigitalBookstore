import React, { useState } from 'react';
import UploadForm from './uploadForm';
import CreateCategory from './createCategory';
import CreateBrand from './createBrand';
import PdfUpload from './pdfUpload';



export default function Admin() {

    return(        
        <>        
        <PdfUpload/>
        <CreateCategory/>
        <CreateBrand/>
        </> 
    );




}