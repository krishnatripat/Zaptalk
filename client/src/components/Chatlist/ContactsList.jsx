import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BiSearchAlt } from 'react-icons/bi'
import ChatList from "./ChatList";
import ChatLIstItem from "./ChatLIstItem";
function ContactsList() {
  const [allContacts, setallContacts] = useState([]);
  const [searchTerm, setsearchTerm] = useState("")
  const [searchContacts, setsearchContacts] = useState([])
  const [{ }, dispatch] = useStateProvider()
  useEffect(()=>{
if(searchTerm.length){
const filtereddata={};
Object.keys(allContacts).forEach((key)=>{
  filtereddata[key]=allContacts[key].filter((obj)=>obj.name.toLowerCase().includes(searchTerm.toLowerCase()))
})
setsearchContacts(filtereddata)
}
else{
  setsearchContacts(allContacts);
}
  },[searchTerm])
  useEffect(() => {
    const getContacts = async () => {
      try {

        const { data: { users }, } = await axios.get(GET_ALL_CONTACTS);
        setallContacts(users)
        setsearchContacts(users)
      }
      catch (err) {
        console.log(err);
      }
    }
    getContacts();
  }, [])
  return (<div className="h-full flex flex-col ">
    <div className="h-24 flex items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white ">
        <BiArrowBack className="cursor-pointer text-xl"
          onClick={() =>
            dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })}
        />
        <span>New Chat
        </span>
      </div>
    </div>
    <div className="bg-search-input-container-background h-full flex-auto overflow-auto  custom-scrollbar">
      <div className="flex py-3 items-center gap-3 h-14">


        <div className="bg-panel-header-background flex items-center gap-3 px-3 py-1 rounded-lg flex-grow mx-4">
          <div className="">
            <BiSearchAlt className="text-panel-header-icon cursor-pointer item-center text-l" />
          </div>
          <div className="">
            <input type="text" placeholder="seach contacts " 
            className="bg-transparent text-sm focus:outline-none text-white w-full" 
            value={searchTerm}
            onChange={(e)=>setsearchTerm(e.target.value)}/>
          </div>
        </div>
      </div>
      {
        Object.entries(searchContacts).map(([initialLetter, userList ]) => {
          
          return ( userList.length>0 &&(
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map(contact=>{
                return (<ChatLIstItem 
                data={contact} 
                isContactPage={true}
                key={contact.id} />)
              })}
            </div>)
          )
        })
      }
    </div>
  </div>
  );
}

export default ContactsList;
