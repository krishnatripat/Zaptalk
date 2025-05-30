import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import dynamic from 'next/dynamic';
import ImageMessage from "./ImageMessage";

const VoiceMessage = dynamic(() => import("./VoiceMessage"), { ssr: false });

function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  if (!currentChatUser) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-white text-lg">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="h-[80vh] relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-index-0"></div>

      <div className="mx-10 my-10 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end gap-1 w-full overflow-auto">
            {Array.isArray(messages) &&
              messages.map((message, index) => (
                message && (
                  <div
                    key={message.id || index}
                    className={`flex ${message.senderId === currentChatUser.id
                      ? "justify-start"
                      : "justify-end"}`}
                  >
                    {message.type === "text" && (
                      <div
                        className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message.senderId === currentChatUser.id
                          ? "bg-incoming-background"
                          : "bg-outgoing-background"
                          }`}
                      >
                        <span className="break-all">{message.message}</span>
                        <div className="flex gap-1 items-end">
                          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                            {calculateTime(message.createdAt)}
                          </span>
                          {message.senderId === userInfo?.id && (
                            <MessageStatus messageStatus={message.messageStatus} />
                          )}
                        </div>
                      </div>
                    )}

                    {message.type === "image" && <ImageMessage message={message} />}
                    {message.type === "audio" && <VoiceMessage message={message} />}
                  </div>
                )
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
