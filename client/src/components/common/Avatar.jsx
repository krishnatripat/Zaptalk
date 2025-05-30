import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import Image from "next/image";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";
function Avatar({ type, image, setImage }) {
  const [hover, sethover] = useState(false);
  const [showCapturePhoto, setshowCapturePhoto] = useState(false)
  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setcontextMenuCordinates] = useState({
    x: 0, y: 0,
  })
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const showContextMenu = (e) => {
    setisContextMenuVisible(true);
    e.preventDefault();
    setcontextMenuCordinates({ x: e.pageX, y: e.pageY });
  }
  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();

      document.body.onfocus = (e) => {
        setTimeout(() => {

          setGrabPhoto(false)

        }, 1000)
      }
    }
  }, [grabPhoto])

  const ContextMenuOptions = [
    {
      name: "take photo", callback: () => {
        setshowCapturePhoto(true);
      }
    }, {
      name: "choose from library", callback: () => {
        setShowPhotoLibrary(true);
      }
    }, {
      name: "upload photo", callback: () => {
        setGrabPhoto(true);
      }
    }, {
      name: "Remove photo", callback: () => {
        setImage("/default_avatar.png");
      }
    }
  ];
  const PhotoPickerchange = async (e) => {
    const file = e.target.files[0];
    console.log({ file });

    const reader = new FileReader();
    const data = document.createElement("img")
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result)
    }
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100)
  }
  return <>
    <div className="flex items-center justify-center">

      {
        type === "sm" && (
          <div className="relative cursor-pointer z-0">
            <div className=" h-10 w-10">
              <Image src={image} alt="avtar" className="rounded-full" fill />
            </div>
          </div>
        )}
      {
        type === "lg" && (
          <div className="relative cursor-pointer z-0">
            <div className=" h-14 w-14">
              <Image src={image} alt="avtar" className="rounded-full" fill />
            </div>
          </div>
        )}
      {
        type === "xl" && (
          <div className="relative cursor-pointer z-0"
            onMouseEnter={() => sethover(true)}
            onMouseLeave={() => sethover(false)}
          >
            <div className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 
              flex items-center z-20 rounded-full justify-center flex-col  text-center gap-2 ${hover ? "visible" : "hidden"}`}
              onClick={e => showContextMenu(e)}>
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={e => showContextMenu(e)} />
              <span onClick={e => showContextMenu(e)} >Change profile photo</span>
            </div>
            <div className="flex items-center justify-center h-60 w-60 ">
              <Image src={image} alt="avtar" className="rounded-full" fill />
            </div></div>
        )}

    </div >
    {
      isContextMenuVisible && <ContextMenu options={ContextMenuOptions} cordinates={contextMenuCordinates}
        setContextMenu={setisContextMenuVisible} />
    }
    {showCapturePhoto && <CapturePhoto setImage={setImage} hide={setshowCapturePhoto} />}
    {showPhotoLibrary && <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLibrary} />}
    {grabPhoto && <PhotoPicker onChange={PhotoPickerchange} />}
  </>
}

export default Avatar;
