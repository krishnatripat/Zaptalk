import React from "react";
import { BsCheckAll } from "react-icons/bs";
import { BsCheck } from "react-icons/bs";

function MessageStatus({ messageStatus }) {
  return (<>
    {
      messageStatus === "sent" && <BsCheck className="text-lg" />
    }
    {
      messageStatus === "delivered" && <BsCheckAll className="text-lg" />
    }
    {
      messageStatus === "read" && (<BsCheckAll className="text-lg text-icon-ack" />)
    }
  </>);
}

export default MessageStatus;
