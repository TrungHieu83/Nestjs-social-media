import "./online.css";
import { SocketContext } from "../../context/Socket";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Online({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const socket = useContext(SocketContext);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollow = async () => {
    const payload = {
      type: 1,
      fromUserId: userInfo.userId,
      toUserId: user.id
    }
    socket.emit('notification', payload);
    setIsFollowing(true)
  }
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={user.avatar} alt="" />
      </div>
      <Link className="rightbarUsername" to={`/profile/${user.id}`}>
        <span >{user.fullName}</span>
      </Link>
      {isFollowing ? <div className="followed">Followed</div> :
        <button className="btn-follow" onClick={(handleFollow)}>Follow</button>}


    </li>
  );
}
