import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React, { useEffect } from "react"
import { BiSearchAlt2 } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { calculateTime } from "@/utils/CalculateTime";


function SearchMessages() {
  const [{ currentChatUser, messages }, dispatch] = useStateProvider()
  const [searchedMessages, setsearchedMessages] = useState([])
  const [searchTerm, setsearchTerm] = useState("")
  useEffect(()=>{  
if(searchTerm){
  setsearchedMessages(messages.filter(message=>message.type==="text" && message.message.includes(searchTerm)))
}
else{
  setsearchedMessages([])
}
  },[searchTerm])
  return <div className="border-conversation-border border-l w-full
   bg-conversation-panel-background flex-col flex z-10 max-h-screen">
    <div className="h-16 px-4 py-5 flex gap-10 item-center bg-panel-header-background text-primary-strong">
      <IoClose className="cursor-pointer text-icon-lighter text-2xl" onClick={() => { dispatch({ type: reducerCases.SET_MESSAGE_SEARCH }) }} />
      <span>Search Messages</span>
    </div>
    <div className="overflow-auto custom-scrollbar h-full text-center ">
      <div className="flex items-center w-full ">
        <div className="flex px-5 items-center gap-3 h-14 w-full">
          <div className="bg-panel-header-background flex items-center gap-3 px-3 py-1 rounded-lg flex-grow">
            <div className="">
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer item-center text-l" />
            </div>
            <div className="">
              <input type="text" placeholder="Search messages"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} />
            </div>
          </div>
          </div> 
        </div>
        <span className="mt-10 text-secondary">
          {!searchTerm.length && `search for messages with ${currentChatUser.name}`}
        </span>
      
      
      </div><div className="flex justify-center h-full flex-col">
        {searchTerm.length>0 && !searchedMessages.length && (<span className="text-secondary w-full justify-center text-center">
          No Messages found
        </span>) }
        <div className="flex flex-col  w-full h-full">
          {searchedMessages.map((message)=>(
          <div className="flex  cursor-pointer flex-col justify-center hover:bg-background-default-hover 
          w-full px-5 border-b-[0.1px] border-secondary py-5 ">
            <div className="text-sm text-secondary">{calculateTime(message.createdAt)}</div>
            <div className="text-icon-green">{message.message}</div>
          </div>))}
        </div>
    </div>
  </div>;
}


export default SearchMessages;
