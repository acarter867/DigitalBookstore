import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/imageSlicer.css';

const ImageSlicer = ({ imageUrl, onSplit }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lineWidth, setLineWidth] = useState(200);
  const imageRef = useRef(null);
  const [leftImageSrc, setLeftImageSrc] = useState('');
  const [rightImageSrc, setRightImageSrc] = useState('');
  const [imageHasSplit, setImageHasSplit] = useState(false)
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

  const handleSliderChange = (event) => {
    const sliderValue = Number(event.target.value);
    const imageWidth = imageRef.current ? imageRef.current.width : 0;
    const maxLineWidth = imageWidth / 2;
    const newLineWidth = (sliderValue / 100) * maxLineWidth;
    setLineWidth(newLineWidth);
  };

  const handleSplitImage = (e) => {
    e.preventDefault();
    setImageHasSplit(true)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const image = imageRef.current;
    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    const leftImage = context.getImageData(
      0,
      0,
      image.width / 2 - lineWidth / 2,
      image.height
    );
    const rightImage = context.getImageData(
      image.width / 2 + lineWidth / 2,
      0,
      image.width / 2 - lineWidth / 2,
      image.height
    );

    canvas.width = image.width / 2 - lineWidth / 2;
    context.putImageData(leftImage, 0, 0);
    const leftImageDataURL = canvas.toDataURL('image/png');
    setLeftImageSrc(leftImageDataURL);

    canvas.width = image.width / 2 - lineWidth / 2;
    context.clearRect(0, 0, image.width / 2 - lineWidth / 2, image.height);
    context.putImageData(rightImage, 0, 0);
    const rightImageDataURL = canvas.toDataURL('image/png');
    setRightImageSrc(rightImageDataURL);
    onSplit(rightImageDataURL, leftImageDataURL);
  };

  const confirmSplitImage = () => {
    setConfirm(true)
  }

  return (
    <div className="image-slicer">
      {!confirm && <div>
        <div className={`image-container ${imageLoaded ? 'loaded' : ''}`}>
          <img
            className="image"
            src={imageUrl}
            alt="Image"
            ref={imageRef}
            onLoad={() => setImageLoaded(true)}
          />
          {imageLoaded && (
            <div
              className="vertical-line"
              style={{
                left: `calc(50% - ${lineWidth}px)`,
                right: `calc(50% - ${lineWidth}px)`,
              }}
            />
          )}
        </div>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={imageRef.current ? (lineWidth / (imageRef.current.width / 2)) * 100 : 0}
            onChange={handleSliderChange}
            className="line-slider"
          />
          <button onClick={handleSplitImage}>Split Image</button>
          {imageHasSplit &&
            <div>
              <button onClick={confirmSplitImage}>Looks Good!</button>
            </div>
          }
        </div>
      </div>}

      <div className='sliced-images'>
        {leftImageSrc && (
          <div>
            <h3>Left Image:</h3>
            <img src={rightImageSrc} alt="Left" />
          </div>
        )}
        {rightImageSrc && (
          <div>
            <h3>Right Image:</h3>
            <img src={leftImageSrc} alt="Right" />
          </div>
        )}
      </div>

    </div>
  );
};

export default ImageSlicer;
