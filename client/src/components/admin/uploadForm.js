
// import React, { useEffect, useState } from 'react';
// import ImageSlicer from './imageSlicer';
// import { Document, Page, pdfjs } from 'react-pdf';
// import '../../assets/css/uploadForm.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// export default function UploadForm() { 

//     /*Use Blob data from thumbnails -> 
//     convert to new png file with standardized names -> 

//     */
//     async function bundleThumbnails() {
//         const thumbnails = [];
//           const zipThumbNails = [firstThumbnail, secondThumbnail];
//           console.log(zipThumbNails);
      
//           try {
//             const response1 = await fetch(firstThumbnail);
//             const blob1 = await response1.blob();
//             const firstFile = new File([blob1], `${title}-${type}-front.png`, { type: blob1.type });
//             thumbnails.push(firstFile);
      
//             const response2 = await fetch(secondThumbnail);
//             const blob2 = await response2.blob();
//             const secondFile = new File([blob2], `${title}-${type}-back.png`, { type: blob2.type });
//             thumbnails.push(secondFile);
//           } catch (error) {
//             console.error(error);
//           }
//           return thumbnails;
//         }      
        

//     async function processProductImages(){
//         const processedImages = [];
//         for(let i = 0; i < productImages.length; i++){
//             const response = await fetch(productImages[i])
//             const resopnseBlob = await response.blob();
//             const processedFile = new File([resopnseBlob], `${title}-${type}-${i}`);
//             processedImages.push(processedFile);
//         }
//         return processedImages;
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();        
//         const thumbnails = await bundleThumbnails();
//         const processedProductImages = await processProductImages();
//         console.log(processedProductImages);
//         const thumbnailData = new FormData();        
//         thumbnails.forEach(thumbnail => {
//             thumbnailData.append("thumbnails", thumbnail);
//         });

//         const productPicData = new FormData();
//         processedProductImages.forEach(image => {
//             productPicData.append("productimages", image);
//         });

//         console.log(productPicData)        

//         try{
//             const formData = new FormData();   
//             const newFile = new File([selectedFile], `${title}-${type}`, {type: selectedFile.type})
//             if(title && brandId && categoryId && description && type && newFile){
//                 formData.append('file', newFile);
//                 //Upload file to cloudinary
//                 const response = await fetch('/api/upload/book/file', {
//                     method: 'POST',
//                     body: formData,
//                 });
//                 if(response.ok){
//                     console.log("File upload success")
//                 }

//                 //send bookdata to db
                
//                 //send thumbnails to cloudinary & database
//                 const thumbnailResponse = await fetch('/api/upload/book/thumbnails', {
//                     method: 'POST',
//                     body: thumbnailData,
//                 });
//                 if(thumbnailResponse.ok){
//                     const responseJSON = await thumbnailResponse.json()
//                     const imageUrls = responseJSON.imageUrls;
//                     console.log("thubmnail response is good");
//                     console.log("Image URL's: ", imageUrls);
//                     //use image urls to send to cloudinary
//                     const body = {
//                         title: `${title}-${type}`,
//                         brand_id: brandId,
//                         category_id: categoryId,
//                         description: description,
//                         type: type,
//                         extension: fileExt,
//                         front_thumbnail: imageUrls[0],
//                         back_thumbnail: imageUrls[1],
//                     }
//                     const dataResponse = await fetch('/api/upload/book/data', {
//                         method: 'POST',
//                         body: JSON.stringify(body),
//                         headers: { "Content-Type": "application/json" },
//                     });
//                     if(dataResponse.ok){
//                         const responseData = await dataResponse.json();
//                         const book_id = responseData.id;
//                         processedProductImages.forEach((image, index) => {
//                             const imageBody = {
//                                 product_id: book_id,
//                                 name: image.name,
//                                 alt_text: `product-preview-${index}`
//                             }
//                             const prodImgData = fetch('/api/upload/book/productimg/data', {
//                                 method: 'POST',
//                                 body: JSON.stringify(imageBody),
//                                 headers: { "Content-Type": "application/json" },
//                             })
//                             if(prodImgData.ok){
//                                 console.log("product pictures response good")
//                             }
//                         })
//                     }
//                 }

//                 //send product images to cloudinary
//                 const prodImageResponse = await fetch('/api/upload/book/productimages', {
//                     method: 'POST',
//                     body: productPicData
//                 })
//                 if(prodImageResponse.ok){
//                     console.log("response good")
//                 }
//                 console.log("FILE UPLOADED")
//                 setSelectedFile(null);
//             }else{
//             console.log("SOMETHING IS NULL")
//         }}catch{
//             console.log("something went wrong")
//         }
//       }

//       function handleCategoryChange(e) {
//         setCategoryId(e.target.value);
//       }

//       function handleBrandChange(e) {
//         setBrandId(e.target.value);
//       }

//       function handleDescriptionChange(e){
//         setDescription(e.target.value)
//       }

//       function handleTitleChange(e){
//         setTitle(e.target.value)
//       }

//       function handleTypeChange(e){
//         setType(e.target.value)
//       }

//     //On file selection
//     const handleFileInput = async (e) => {
//         const file = e.target.files[0]
//         setSelectedFile(file);
//         const ext = file.name.toString().slice(-3);
//         setFileExt(ext)
//         if(ext === "pdf"){
//             setPdfProdImages(await generateProductPics(file));
//         }else if(ext === "zip"){
//             setIsZip(true)
//         }
//     }
//     const handleCoverInput = async (e) => {
//         const file = e.target.files[0];
//         setSelectedCover(file);
//         const coverUrl = await fetchPdfThumbnail(file);
//         setCoverUrl(coverUrl);
//       };
//       /**********************ZIP FILE*************** */
//     const handleImageInput = async (e) => {
//         const selectedImages = e.target.files;
//         const newImages = [...productImages];
      
//         for(let i = 0; i < selectedImages.length; i++) {
//           const imageObjectURL = URL.createObjectURL(selectedImages[i]);
//           newImages.push(imageObjectURL);
//         }
      
//         setProductImages(newImages);
//         setImagesLoaded(false); // set imagesLoaded to false to indicate that images are still loading
      
//         // Wait for all images to finish loading
//         for (let i = 0; i < newImages.length; i++) {
//           await new Promise((resolve) => {
//             const image = new Image();
//             image.onload = () => {
//               resolve();
//             };
//             image.src = newImages[i];
//           });
//         }
      
//         setImagesLoaded(true); // set imagesLoaded to true when all images have finished loading
//       };

//       const handleFirstThumbnail = (e) => {
//         const selectedImage = e.target.files[0];
//         console.log(selectedImage.type)
//         setFirstThumbnail(URL.createObjectURL(selectedImage));
//       }
//       const handleSecondThumbnail = (e) => {
//         const selectedImage = e.target.files[0];
//         console.log(selectedImage.type)
//         setSecondThumbnail(URL.createObjectURL(selectedImage));
//       }

//     function onChooseFile(){
//         setSelectedFile(null)
//     }
//     const onChooseCover = () => {
//         setSelectedCover(null);
//     }

//     const handleSplitImages = (leftImageData, rightImageData) => {
//         setFirstPageUrl(leftImageData);
//         setLastPageUrl(rightImageData);
//     };

//     return (
//       <div className="App">
//         <form className='upload-form' onSubmit={handleSubmit}>
//             <div className='upload-book'>
//                 <div>UPLOAD BOOK</div>
//                 <input type="file" onChange={handleFileInput} onClick={onChooseFile}/>
//                 <button type='submit' >Upload</button>
//             </div> 
//             <div className='upload-cover'>
//                 <div>UPLOAD COVER</div>
//                 <input type="file" onChange={handleCoverInput} onClick={onChooseCover}/>
//                 {coverUrl && (
//                     <ImageSlicer imageUrl={coverUrl} onSplit={handleSplitImages}/>
//                 )}
//             </div> 
//             <div className='book-details'>
//                 <textarea placeholder='Enter Book Description' onChange={handleDescriptionChange}/>
//                 <select id="select-category"  onChange={handleCategoryChange}>
//                     {categories.map((category) => (
//                         <option key={category.id} value={category.id}>
//                             {category.category_name}
//                         </option>
//                     ))}
//                 </select>
//                 <select id="select-brand"  onChange={handleBrandChange}>
//                     {brands.map((brand) => (
//                         <option key={brand.id} value={brand.id}>
//                             {brand.brand_name}
//                         </option>
//                     ))}
//                 </select>
//                 <div>
//                     <label>
//                         <input
//                             type="radio"
//                             value="Hard Cover"
//                             checked={type === "Hard Cover"}
//                             onChange={handleTypeChange}
//                         />
//                         Hard Cover
//                         </label>

//                         <label>
//                         <input
//                             type="radio"
//                             value="Paperback"
//                             checked={type === "Paperback"}
//                             onChange={handleTypeChange}
//                         />
//                         Paperback
//                     </label>
//                     <label>
//                         <input
//                             type="radio"
//                             value="Digital"
//                             checked={type === "Digital"}
//                             onChange={handleTypeChange}
//                         />
//                         Digital
//                         </label>
//                         <label>
//                         <input
//                             type="radio"
//                             value="Printable"
//                             checked={type === "Printable"}
//                             onChange={handleTypeChange}
//                         />
//                         Printable
//                     </label>
//                 </div>
//                 <div>
//                     Title:
//                     <input onChange={handleTitleChange} placeholder='Enter title'/>
//                 </div>
//                 <div>
//                     <h3>PRODUCT IMAGES</h3>
//                     {pdfProdImages.map((image, index) => 
//                         <img key={index} src={image}/>
//                     )}
//                 </div>
//                  {isZip && <div> 
//                     <div> 
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                             document.getElementById("front-cover-upload").click();
//                         }}>Select Front Cover</button>
//                         <input type='file' id="front-cover-upload" onChange={handleFirstThumbnail}/>
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                             document.getElementById('back-cover-upload').click();
//                         }}>Select Back Cover</button>
//                         <input type='file' id="back-cover-upload" onChange={handleSecondThumbnail}/>
                        
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                         }}>Check Cover Images</button>

//                         <div id='thumbnails'>
//                             <img src={firstThumbnail}/>
//                             <img src={secondThumbnail}/>
//                         </div>
                        
//                     </div>
                        
//                     <div>
//                         <button onClick={(e) => {
//                             e.preventDefault()
//                             document.getElementById('getFile').click()
//                         }}>Add Product Image</button>
//                         <input type='file' id="getFile" onChange={handleImageInput}/>
//                         <button onClick={() => {
//                             setProductImages([])
//                         }}>Clear Images</button>
//                     <div>
//                         {productImages.map((pimg, index) =>
//                             <img key={index} src={pimg}/>
//                         )}
//                     </div>
//                     </div>
//                 </div>
//                 }           
//             </div>
//         </form>
//       </div> 
//     );
// }   