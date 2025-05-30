import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GETR_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY = 2000;

function Container({ data }) {
  const [zgVar, setzgVar] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);
  const [callAccepted, setCallAccepted] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => {
        setCallAccepted(true);
      });
    } else {
      setTimeout(() => setCallAccepted(true), 1000);
    }
  }, [data, socket]);

  // No need for camera permissions now

  useEffect(() => {
    const fetchToken = async () => {
      if (!userInfo?.id) return;
      try {
        const { data: { token: returnedToken } } = await axios.get(`${GETR_CALL_TOKEN}/${userInfo.id}`);
        setToken(returnedToken);
      } catch (err) {
        console.error("❌ Token fetch error:", err);
      }
    };

    if (callAccepted && userInfo?.id) fetchToken();
  }, [callAccepted, userInfo]);

  const attemptWebSocketConnection = async (zg) => {
    try {
      await zg.loginRoom(
        data.roomId.toString(),
        token,
        { userID: userInfo.id.toString(), userName: userInfo.name },
        { userUpdate: true }
      );
    } catch (err) {
      console.error("❌ WebSocket connection failed, retrying...", err);
      if (retryAttempts < MAX_RETRY_ATTEMPTS) {
        setRetryAttempts(prev => prev + 1);
        setTimeout(() => attemptWebSocketConnection(zg), RETRY_DELAY);
      } else {
        console.error("❌ Max retry attempts reached. WebSocket connection failed.");
      }
    }
  };

  useEffect(() => {
    const startCall = async () => {
      if (typeof window === "undefined" || !token) return;

      const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");

      const zg = new ZegoExpressEngine(
        Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
        process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
      );

      zg.setLogConfig({ logLevel: "error", remoteLogLevel: "disable" });
      setzgVar(zg);

      zg.on("debugError", (code, msg) => {
        console.error("🛑 Zego debugError:", code, msg);
      });

      zg.on("roomStreamUpdate", async (roomId, updateType, streamList) => {
        const streamID = streamList[0]?.streamID;
        if (!streamID) return;

        if (updateType === "ADD") {
          const remoteContainer = document.getElementById("remote-audio");
          const mediaEl = document.createElement("audio");
          mediaEl.id = streamID;
          mediaEl.autoplay = true;
          mediaEl.playsInline = true;
          mediaEl.muted = false;

          if (remoteContainer) remoteContainer.appendChild(mediaEl);

          try {
            const remoteStream = await zg.startPlayingStream(streamID, {
              audio: true,
              video: false,
            });
            mediaEl.srcObject = remoteStream;
          } catch (err) {
            console.error("❌ Error playing remote stream:", err);
          }
        }

        if (updateType === "DELETE") {
          if (localStream) zg.destroyStream(localStream);
          if (publishStream) zg.stopPublishingStream(streamList[0]?.streamID);
          zg.logoutRoom(data.roomId.toString());
          dispatch({ type: reducerCases.END_CALL });
        }
      });

      try {
        await attemptWebSocketConnection(zg);

        const stream = await zg.createStream({ camera: { audio: true, video: false } });

        if (!stream) {
          console.error("❌ Failed to create audio stream.");
          return;
        }

        setLocalStream(stream);

        const localContainer = document.getElementById("localAudio");
        const mediaEl = document.createElement("audio");
        mediaEl.id = "audio-local-zego";
        mediaEl.autoplay = true;
        mediaEl.muted = true;
        mediaEl.playsInline = true;
        mediaEl.srcObject = stream;

        if (localContainer) {
          localContainer.innerHTML = "";
          localContainer.appendChild(mediaEl);
        }

        const streamID = `stream_${Date.now()}`;
        setPublishStream(streamID);
        await zg.startPublishingStream(streamID, stream);
      } catch (err) {
        console.error("❌ Error during call setup:", err);
      }
    };

    if (token) startCall();
  }, [token, data, userInfo]);

  const endCall = () => {
    const id = data.id;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }

    socket.current.emit("reject-voice-call", { from: id });
    dispatch({ type: reducerCases.END_CALL });
  };

  return (
    <div className="border-conversation-border w-full border-1 bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data?.name}</span>
        <span className="text-lg">
          {callAccepted ? "On going Call" : "Calling"}
        </span>
      </div>

      <div className="my-24">
        <Image src={data.profilePicture} alt="avatar" height={250} width={300} className="rounded-full" />
      </div>

      <div className="my-5 relative" id="remote-audio">
        <div className="absolute bottom-5 right-0" id="localAudio" />
      </div>

      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={endCall} />
      </div>
    </div>
  );
}

export default Container;
