import React, { useRef } from "react";
import { useEffect } from "react";
function ContextMenu({ options, cordinates, setContextMenu }) {
  const ContextMenuRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "context-opener") {
        if (ContextMenuRef.current && !ContextMenuRef.current.contains(event.target)) {
          setContextMenu(false);
        }
      }
    };


    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [setContextMenu])

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(true);
    callback();

  }
  return (<div className={`bg-dropdown-background shadow-xl fixed py-2 z-[100] 
  `} ref={ContextMenuRef}
    style={{
      top: cordinates.y,
      left: cordinates.x
    }}
  >
    <ul>
      {
        options.map(({ name, callback }) => (
          < li key={name} onClick={(e) => handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover ">
            <span className="text-white">{name}</span>
          </li>
        ))
      }
    </ul>
  </ div>)
}





export default ContextMenu;
