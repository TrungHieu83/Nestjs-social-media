import "./sidebar.css";
import {
  RssFeed,
  Chat,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../context/Socket";
export default function Sidebar() {
  const socket = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(async () => {
    try {
      const res = await axios.get(`${url}notifications`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } })
      setNotifications(res.data)
    } catch (error) {

    }
  }, [userInfo.userId])

  useEffect(() => {
    socket.on(`notification-${userInfo.userId}`, (res) => {

      setNotifications([res, ...notifications]);
    });
  }, [notifications])
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to="/" style={{ textDecoration: "none" }}>
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>

            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to="/messenger" style={{ textDecoration: "none" }}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </Link>
          </li>
        </ul>
        <hr className="sidebarHr" />
      </div>
      <div className="sidebar-notifications">
        <div className="notification-title">Notifications</div>
        {notifications.map((notification) => (
          <Notification notification={notification} key={notification.id} />
        ))}
        {notifications.length == 0 && <img className="notification-img" src="https://s3.amazonaws.com/iconbros/icons/icon_pngs/000/004/233/original/notification.png?1632675433" />}

      </div>
    </div>
  );
}
