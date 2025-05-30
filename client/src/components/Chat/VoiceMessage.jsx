import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider()
  const [audioMessage, setaudioMessage] = useState(null)
  const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0)
  const [totalDuration, settotalDuration] = useState(0)

  const [isPlaying, setisPlaying] = useState(false)

  const waveFormRef = useRef(null);
  const waveForm = useRef(null)
  useEffect(() => {

  }, [])

  useEffect(() => {
    if (!waveForm.current) {
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        responsive: true,
        height: 30
      });
      waveForm.current.on("finish", () => {
        setisPlaying(false)
      })
    }
    return () => {
      waveForm.current.destroy();
    }
  }, []);
  useEffect(() => {
    if (!message.message) return;
    const audioURL = `${HOST}/${message.message}`
    const audio = new Audio(audioURL)
    setaudioMessage(audio)
    // waveForm.current.load(audioURL);
    fetch(audioURL)
      .then(response => response.blob())
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        waveForm.current.load(objectURL);
      })
      .catch(error => console.error("WaveSurfer load error:", error));

    waveForm.current.on("ready", () => {

      // console.log("Audio Loaded. Duration:", waveForm.current.getDuration());
      settotalDuration(waveForm.current.getDuration())
    })
    waveForm.current.on("error", (error) => {
      console.error("WaveSurfer load error:", error);
    });
  }, [message.message])
  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setcurrentPlaybackTime(audioMessage.currentTime);

      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);

      };
    }
  }, [audioMessage])
  const handlePlayAudio = () => {
    if (audioMessage) {
      waveForm.current.play();
      waveForm.current.stop();
      audioMessage.play();
      setisPlaying(true);
    }
  }
  const handlePauseAudio = () => {

    waveForm.current.stop();
    audioMessage.pause();
    setisPlaying(false);
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return <div className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === currentChatUser.id ?
    "bg-incoming-background" : "bg-outgoing-background"}`}>
    <div>
      <Avatar type="lg" image={currentChatUser?.profilePicture} />
    </div>
    <div className="cursor-pointer text-xl">
      {!isPlaying ? (<FaPlay onClick={handlePlayAudio} />) : (<FaStop onClick={handlePauseAudio} />)}
    </div>
    <div className="relative">
      <div className="w-60 " ref={waveFormRef} />
      <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
        <span>
          {formatTime(isPlaying ? currentPlaybackTime : totalDuration)}
        </span>
        <div className="flex gap-1 ">

          <span>{calculateTime(message.createdAt)}</span>

          {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus
          } />} </div>
      </div>
    </div>
  </div>;
}

export default VoiceMessage;
