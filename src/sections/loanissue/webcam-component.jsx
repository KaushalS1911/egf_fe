import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Iconify from '../../components/iconify';

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 360,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {!isCameraOpen ? (
        <button
          onClick={() => setIsCameraOpen(true)}
          style={{
            fontSize: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Iconify icon="ion:camera-sharp" width={24} sx={{color: "gray", cursor: "pointer"}} />
        </button>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={360}
            videoConstraints={videoConstraints}
          />
          <button
            onClick={capture}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Capture Photo

          </button>
          <button
            onClick={() => setIsCameraOpen(false)}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
            }}
          >
            Close Camera
          </button>
          {capturedImage && (
            <div style={{ marginTop: "20px" }}>
              <h2>Captured Image:</h2>
              <img src={capturedImage} alt="Captured" style={{ border: "1px solid #ccc" }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WebcamComponent;
