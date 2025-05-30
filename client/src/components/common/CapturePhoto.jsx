import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
function CapturePhoto({ hide, setImage }) {
  const videoRef = useRef(null);
  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      videoRef.current.srcObject = stream;
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    }
  })
  const CapturePhoto = () => {
    const canvas = document.createElement("canvas")
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150)
    setImage(canvas.toDataURL("image/jpeg"))
    hide(false)
  };
  return <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 gap-3  rounded large pt-2  flex flex-col text-center items-center justify-center">
    <div className=" gap-4 w-full justify-center ">
      <div className="pt-2 pr-2 cursor-pointer flex  flex-col justify-center items-center" onClick={() => { hidePhotoLibrary(false); }}>
        <IoClose className="h-10 w-10 cursor-pointer" />
      </div>
      <div className="flex flex-col items-center  justify-center">
        <video ref={videoRef} id="video" width={400} autoPlay></video>
      </div>
      <button className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-tl justify-center items-center "
        onClick={CapturePhoto}></button>
    </div>
  </div>;
}

export default CapturePhoto;
