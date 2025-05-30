import React from "react";
import { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";
function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
const [showCapturePhoto, setshowCapturePhoto] = useState(false)
  const [isContextMenuVisible, setisContextMenuVisible] = useState(false);
 const router=useRouter()
const [contextMenuCordinates, setcontextMenuCordinates] = useState({
    x: 0, y: 0,
  })
  const contextMenuOptions = [{
      name: "Log-Out",

      callback: async () => {
        setisContextMenuVisible(false);
        router.push("/logout")
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      }
    }]
  const showContextMenu = (e) => {
    setisContextMenuVisible(true);
    e.preventDefault();
    setcontextMenuCordinates({ x: e.pageX, y: e.pageY });
  }

  const handleAllContactPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  }
  return (<div className="h-16 px-4 py-3 flex justify-between items-center">
    <div className="cursor-pointer">
      <Avatar type="sm" image={userInfo?.profileImage} />
    </div>
    <div className="flex gap-6 ">
      <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer item-center text-xl"
        onClick={handleAllContactPage}
        title="New Chat" />
      <>
        <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer item-center text-xl"
        onClick={showContextMenu} title="Menu" id="context-opener" />
       { isContextMenuVisible && (
        <ContextMenu options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          setContextMenu={setisContextMenuVisible} />)}

</>
    </div>
  </div>
  );
}

export default ChatListHeader;
