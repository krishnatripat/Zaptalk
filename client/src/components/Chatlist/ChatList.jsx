import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contactsPage }] = useStateProvider()
  const [PageType, setPageType] = useState("default")
  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    }
    else {
      setPageType("default")
    }
  }, [contactsPage])
  return (<div className="bg-panel-header-background w-96  flex flex-col max-h-screen z-10">
    {
      PageType === "default" &&
      (<>
        <ChatListHeader />
        <SearchBar />
        <List />
      </>)
    }
    {
      PageType==="all-contacts" && <ContactsList/>
    }
  </div>);
}

export default ChatList;
