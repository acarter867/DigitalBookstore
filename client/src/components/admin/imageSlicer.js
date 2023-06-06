import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/imageSlicer.css';

const ImageSlicer = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lineWidth, setLineWidth] = useState(200);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null)

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleSliderChange = (event) => {
    setLineWidth(Number(event.target.value));
  };

  const splitImage = () => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions
      canvas.width = imageRef.current.offsetWidth;
      canvas.height = imageRef.current.offsetHeight;

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original image on the canvas
      context.drawImage(imageRef.current, 0, 0);

      // Clip the canvas based on the slider position
      context.globalCompositeOperation = 'destination-out';
      context.fillRect(lineWidth, 0, canvas.width - lineWidth, canvas.height);

      // Get the left image as data URL
      const leftImageUrl = canvas.toDataURL();

      // Clear the canvas again
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original image on the canvas
      context.drawImage(imageRef.current, 0, 0);

      // Clip the canvas based on the slider position
      context.globalCompositeOperation = 'destination-out';
      context.fillRect(0, 0, lineWidth, canvas.height);

      // Get the right image as data URL
      const rightImageUrl = canvas.toDataURL();
      setRightImage(rightImage)
      setLeftImage(leftImageUrl)

      // Use the leftImageUrl and rightImageUrl as needed (e.g., display or save them)
      console.log('Left Image:', leftImageUrl);
      console.log('Right Image:', rightImageUrl);
    }
  };

  return (
    <div className="image-slicer">
      <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
        <img
          className="image"
          src={imageUrl}
          alt="Image"
          ref={imageRef}
          onLoad={() => setImageLoaded(true)}
        />
        {imageLoaded && (
          <React.Fragment>
            <div className="vertical-line" style={{ width: lineWidth }} />
          </React.Fragment>
        )}
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="5"
          max="40"
          value={lineWidth}
          onChange={handleSliderChange}
          className="line-slider"
        />
        <button onClick={splitImage}>Split Image</button>
      </div>
      <canvas ref={canvasRef} className="hidden-canvas" />
      {leftImage && (
        <img src={leftImage}/>
      )}
      {rightImage && (
        <img src={rightImage}/>
      )}

    </div>
  );
};

export default ImageSlicer;
