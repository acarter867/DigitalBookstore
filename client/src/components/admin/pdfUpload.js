import React, { useEffect, useRef, useState } from "react";
import ImageSlicer from './imageSlicer';
import { Document, Page, pdfjs } from 'react-pdf';
import '../../assets/css/uploadForm.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfUpload() {
    const fileInputRef = useRef(null)
    const [firstPageUrl, setFirstPageUrl] = useState(null);
    const [lastPageUrl, setLastPageUrl] = useState(null);
    const [fileExt, setFileExt] = useState("")
    const [coverUrl, setCoverUrl] = useState(null)
    const [selectedCover, setSelectedCover] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [pdfProdImages, setPdfProdImages] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandId, setBrandId] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [isZip, setIsZip] = useState(false);
    const [subtitle, setSubtitle] = useState("");
    const [displayTitle, setDisplayTitle] = useState("");
    const [prodImagesLoaded, setProdImagesLoaded] = useState(false);
    const [step, setStep] = useState(1)
    const [aPlusPics, setAPlusPics] = useState([])

    useEffect(() => {
        fetchCategoryData();
        fetchBrandData()
    }, []);

    //Get list of all categories for dropdown selection
    async function fetchCategoryData() {
        try {
            const response = await fetch('/api/upload/category');
            const data = await response.json();
            setCategories(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    //Get List of all brands for dropdown selection
    async function fetchBrandData() {
        try {
            const response = await fetch('/api/upload/brand');
            const data = await response.json();
            setBrands(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    //Generate 20% of pdf into images for "look inside" feature
    const generateProductPics = async (file) => {
        const imageUrls = []
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        await new Promise((resolve) => (reader.onload = resolve));
        const pdf = await pdfjs.getDocument({ data: reader.result }).promise;
        const totalPages = pdf.numPages;
        const twentyPercent = Math.floor(totalPages * .2);
        console.log(twentyPercent)
        for (let i = 2; i <= twentyPercent; i++) {
            const currPage = await pdf.getPage(i);
            const currViewport = currPage.getViewport({ scale: 1 });
            const currCanvas = document.createElement("canvas");
            const currContext = currCanvas.getContext("2d");
            currCanvas.height = currViewport.height;
            currCanvas.width = currViewport.width;
            await currPage.render({ canvasContext: currContext, viewport: currViewport }).promise;
            const currPageUrl = currCanvas.toDataURL();
            imageUrls.push(currPageUrl);
        }
        setProdImagesLoaded(true)
        return imageUrls;
    }
    //convert cover page to png for splitting
    const fetchPdfThumbnail = async (file) => {
        setPdfProdImages([]);
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        await new Promise((resolve) => (reader.onload = resolve));
        const pdf = await pdfjs.getDocument({ data: reader.result }).promise;
        const firstPage = await pdf.getPage(1);
        const firstViewport = firstPage.getViewport({ scale: 1 });
        const firstCanvas = document.createElement("canvas");
        const firstContext = firstCanvas.getContext("2d");
        firstCanvas.height = firstViewport.height;
        firstCanvas.width = firstViewport.width;
        await firstPage.render({ canvasContext: firstContext, viewport: firstViewport }).promise;
        const firstPageUrl = firstCanvas.toDataURL();
        console.log(firstPageUrl);
        return firstPageUrl;
    };
    // Generate Blob data for images.
    function generateBlobData(imageUrl) {
        try {
            const binaryData = atob(imageUrl.split(',')[1]);
            const array = [];
            for (let i = 0; i < binaryData.length; i++) {
                array.push(binaryData.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], { type: 'image/png' });
        } catch {
            console.log("nothing to split")
        }
    }

    //Create new png images files from thumbnail blob data ->
    //push all images to single array for server upload
    const bundleThumbnails = () => {
        const thumbnails = []
        const firstFile = new File([generateBlobData(firstPageUrl)], `${title}-${type}-front`, { type: "image/png" });
        const lastFile = new File([generateBlobData(lastPageUrl)], `${title}-${type}-back`, { type: "image/png" });
        thumbnails.push(firstFile, lastFile);
        return thumbnails;
    }

    //Create new png image files from product picture blob data -> 
    //push all prod images to single array for server upload.
    const bundleProductImages = async () => {
        const processedImages = [];
        for (let i = 0; i < pdfProdImages.length; i++) {
            const newImage = new File([generateBlobData(pdfProdImages[i])], `${title}-${type}-${i}`, { type: "image/png" });
            processedImages.push(newImage);
        }
        console.log(processedImages)
        return processedImages;
    }

    const bundleAPlusImages = async() => {
        const processedImages = [];
        for(let i = 0; i < aPlusPics.length; i++){
            const newImage = new File([generateBlobData(aPlusPics[i])], `Decorative-Image-${i}`, {type: 'image/png'});
            processedImages.push(newImage);
        }
        return processedImages;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //bundle thumbnails and product pictures to array
        const thumbnails = bundleThumbnails();
        const processedProductImages = await bundleProductImages();
        const processedAPlusPics = await bundleAPlusImages();

        console.log(processedAPlusPics);

        //Create form data for thumbnails 
        const thumbnailData = new FormData();
        thumbnails.forEach(thumbnail => {
            thumbnailData.append("thumbnails", thumbnail);
        });

        //Create form data for productPics
        const productPicData = new FormData();
        console.log(processedProductImages)

        try {
            const formData = new FormData();
            //Rename file to standardized format
            const newFile = new File([selectedFile], `${title}-${type}`, { type: selectedFile.type })
            if (title && brandId && categoryId && description && type && newFile) {
                formData.append('file', newFile);
                const response = await fetch('/api/upload/book/file', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    console.log("File upload success")
                }

                //send thumbnails to cloudinary & database
                const thumbnailResponse = await fetch('/api/upload/book/thumbnails', {
                    method: 'POST',
                    body: thumbnailData,
                });
                if (thumbnailResponse.ok) {
                    const responseJSON = await thumbnailResponse.json()
                    const imageUrls = responseJSON.imageUrls;
                    console.log("thubmnail response is good");
                    console.log("Image URL's: ", imageUrls);
                    //use image urls to send to cloudinary
                    const body = {
                        title: `${title}-${type}`,
                        display_title: displayTitle,
                        subtitle: subtitle,
                        brand_id: brandId,
                        category_id: categoryId,
                        description: description,
                        type: type,
                        extension: fileExt,
                        front_thumbnail: imageUrls[0],
                        back_thumbnail: imageUrls[1],
                    }
                    const dataResponse = await fetch('/api/upload/book/data', {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: { "Content-Type": "application/json" },
                    });
                    if (dataResponse.ok) {
                        const responseData = await dataResponse.json();
                        const book_id = responseData.id;

                        //Send product image data to cloudinary
                        for (const image of processedProductImages) {
                            try {
                                const imageFormData = new FormData();
                                imageFormData.append('productimage', image)
                                const imageUploadResponse = await fetch('/api/upload/book/productimage', {
                                    method: "POST",
                                    body: imageFormData
                                });
                                if (imageUploadResponse.ok) {
                                    const imageUploadResponseData = await imageUploadResponse.json();
                                    const prodImageUrl = imageUploadResponseData.imageUrl;
                                    console.log(prodImageUrl)
                                    const imageBody = {
                                        product_id: book_id,
                                        name: image.name,
                                        alt_text: `product-preview`,
                                        url: prodImageUrl
                                    }
                                    console.log(imageBody)
                                    const prodImgData = await fetch('/api/upload/book/productimg/data', {
                                        method: 'POST',
                                        body: JSON.stringify(imageBody),
                                        headers: { "Content-Type": "application/json" },
                                    })
                                    if (prodImgData.ok) {
                                        console.log("product pictures response good")
                                    }
                                }
                            } catch (error) {
                                // Handle the error if the image upload fails
                                console.log(error)
                            }
                        }
                        for(const image of processedAPlusPics){
                            try{
                                const imageFormData = new FormData();
                                imageFormData.append("productimage", image);
                                const imageUploadResponse = await fetch('/api/upload/book/aplusimage', {
                                    method: "POST",
                                    body: imageFormData
                                });
                                if(imageUploadResponse.ok){
                                    const imageUploadResponseData = await imageUploadResponse.json();
                                    const aPlusImageUrl = imageUploadResponseData.imageUrl;
                                    const imageBody = {
                                        product_id: book_id,
                                        name: image.name,
                                        alt_text: "Decorative Product Preview",
                                        url: aPlusImageUrl
                                    }
                                    const aPlusImgData = await fetch('/api/upload//book/aplusimage/data',{
                                        method: "POST",
                                        body: imageBody,
                                        headers: { "Content-Type": "application/json" },
                                    });

                                    if(aPlusImgData.ok){
                                        console.log("A PLUS CONTENT UPLOAD SUCCESS")
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }
                    }
                }
                console.log("FILE UPLOADED")
                setSelectedFile(null);
            } else {
                console.log("SOMETHING IS NULL")
            }
        } catch {
            console.log("something went wrong")
        }
    }

    function handleCategoryChange(e) {
        setCategoryId(e.target.value);
    }

    function handleBrandChange(e) {
        setBrandId(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleTypeChange(e) {
        setType(e.target.value);
    }

    function handleDisplayTitleChange(e) {
        setDisplayTitle(e.target.value);
    }

    function handleSubtitleChange(e) {
        setSubtitle(e.target.value);
    }

    const handleFileInput = async (e) => {
        const file = e.target.files[0]
        setSelectedFile(file);
        const ext = file.name.toString().slice(-3);
        setFileExt(ext)
        if (ext === "pdf") {
            setPdfProdImages(await generateProductPics(file));
        } else if (ext === "zip") {
            setIsZip(true)
        }
    }
    const handleCoverInput = async (e) => {
        const file = e.target.files[0];
        setSelectedCover(file);
        const coverUrl = await fetchPdfThumbnail(file);
        setCoverUrl(coverUrl);
    };

    const handleSplitImages = (leftImageData, rightImageData) => {
        setFirstPageUrl(leftImageData);
        setLastPageUrl(rightImageData);
    };

    function onChooseFile() {
        setSelectedFile(null)
    }
    const onChooseCover = () => {
        setSelectedCover(null);
    }

    function incrementStep(e) {
        e.preventDefault()
        setStep(step + 1)
    }

    function decrementStep(e) {
        e.preventDefault()
        if (step != 1) {
            setStep(step - 1);
        }
    }

    const handleAPlusClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (event) => {
        // Handle file change here
        const files = event.target.files;
        const newSelectedFiles = Array.from(files);
        setAPlusPics((prevSelectedFiles) => [...prevSelectedFiles, ...newSelectedFiles]);
    };

    return (
        <div className="App">
            <form className='upload-form' onSubmit={handleSubmit}>
                {step === 1 && <div className='upload-cover'>
                    <div className="step-header">Step 1: Upload Cover</div>
                    <input type="file" onChange={handleCoverInput} onClick={onChooseCover} />
                    {coverUrl && (
                        <ImageSlicer imageUrl={coverUrl} onSplit={handleSplitImages} />
                    )}
                    <div className="options-container">
                        <button onClick={incrementStep}>Next</button>
                    </div>
                </div>
                }
                {step === 2 && <div className='upload-book'>
                    <div className="step-header">Step 2: Upload Book</div>
                    <input type="file" onChange={handleFileInput} onClick={onChooseFile} />
                    <div className="product-image-container">
                        {prodImagesLoaded && <h3>PRODUCT IMAGES</h3>}
                        {pdfProdImages.map((image, index) =>
                            <img key={index} src={image} />
                        )}
                    </div>
                    <div className="options-container">
                        <button onClick={decrementStep}>Back</button>
                        <button onClick={incrementStep}>Next</button>
                    </div>
                </div>
                }
                {step === 3 && <div>
                    <div className="a-plus-image" >
                        <div className="step-header">Step 3: Upload A+ Content</div>
                        <div>
                            {aPlusPics && aPlusPics.map((image, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(image)}
                                />
                            ))}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {/* Custom upload button */}
                        <button className="a-plus-btn" onClick={handleAPlusClick}>Schmuck</button>

                    </div>
                    <div className="options-container">
                        <button onClick={decrementStep}>Back</button>
                        <button onClick={incrementStep}>Next</button>
                    </div>

                </div>}
                {step === 4 && <div className='book-details'>
                    <div className="step-header">Step 4: Enter Product Info</div>
                    <textarea placeholder='Enter Book Description' onChange={handleDescriptionChange} />
                    <select id="select-category" onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                    <select id="select-brand" onChange={handleBrandChange}>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.brand_name}
                            </option>
                        ))}
                    </select>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="Hard Cover"
                                checked={type === "Hard Cover"}
                                onChange={handleTypeChange}
                            />
                            Hard Cover
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="Paperback"
                                checked={type === "Paperback"}
                                onChange={handleTypeChange}
                            />
                            Paperback
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Digital"
                                checked={type === "Digital"}
                                onChange={handleTypeChange}
                            />
                            Digital
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Printable"
                                checked={type === "Printable"}
                                onChange={handleTypeChange}
                            />
                            Printable
                        </label>
                    </div>
                    <div>
                        Title:
                        <input onChange={handleTitleChange} placeholder='Short Title For Database' />
                    </div>
                    <div>
                        Display Title:
                        <input onChange={handleDisplayTitleChange} placeholder='What Users Will See' />
                    </div>
                    <div>
                        Subtitle:
                        <input onChange={handleSubtitleChange} placeholder='Subtitle' />
                    </div>
                    <div className="options-container">
                        <button onClick={decrementStep}>Back</button>
                        <button type='submit' >Upload</button>
                    </div>
                </div>}

            </form>
        </div>
    );
}