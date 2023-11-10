import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const canvasRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Inside the img.onload function
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Change green pixels to blue
          if (data[i] < 150 && data[i + 1] > 200 && data[i + 2] < 200) {
            data[i] = 0; // Set red channel to 0
            data[i + 1] = 0; // Set green channel to 0
            data[i + 2] = 255; // Set blue channel to 255
          }
        }

        console.log(data);

        ctx.putImageData(imageData, 0, 0);
        downloadImage(); // Move this line inside the img.onload function
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }, []);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "modified-image.png";
    link.click();
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Accept only image files
  });

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select one</p>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
