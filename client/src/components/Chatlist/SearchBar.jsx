import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import React from "react";
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsFilter } from "react-icons/bs";

function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider()
  return <div className="bg-search-input-container-background flex py-3 pl-3 items-center h-14">
    <div className="bg-panel-header-background flex items-center gap-3 px-3 py-1 rounded-lg flex-grow">
      <div className="">
        <BiSearchAlt2 className="text-panel-header-icon cursor-pointer item-center text-l" />
      </div>
      <div className="">
        <input type="text" placeholder="Search or start new Chat"
          className="bg-transparent text-sm focus:outline-none text-white w-full"
          value={contactSearch}
          onChange={(e) =>  dispatch({
            type: reducerCases.SET_CONTACT_SEARCH
            , contactSearch: e.target.value,
          }) } />
          
      </div>
    </div>
    <div className="pr-5 pl-3">
      <BsFilter className="text-panel-header-icon cursor-pointer item-center text-l" />
    </div>
  </div>;
}

export default SearchBar;
