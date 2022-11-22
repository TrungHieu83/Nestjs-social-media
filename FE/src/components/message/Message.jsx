import "./message.css";
import { format } from "timeago.js";
import { useState } from "react";

export default function Message({ message, own }) {
  const [time, setTime] = useState(false)
  return (
    <div className={own ? "message own" : "message"}>
      {time && <div className="messageBottom">{format(message.createdDate)}</div>}
      <div className="messageTop">
        <img
          className="messageImg"
          src={message.userReply.avatar}
          alt=""
        />

        <p onClick={() => setTime(!time)} className="messageText">{message.text}</p>
      </div>
    </div>
  );
}
