import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Tooltip, OverlayTrigger, Popover, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { SocketContext } from "../../context/Socket";
import axios from "axios";
import { BiLogOut } from "react-icons/bi";

export default function Topbar() {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const [isAuth, setIsAuth] = useState(true);
  const [notification, setNotification] = useState(0);
  const [show, setShow] = useState(false);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    socket.on(`message-${userInfo.userId}`, ({ conversationId }) => {
      if (!conversations.includes(conversationId)) {
        setNotification(notification + 1);
        setConversations([...conversations, conversationId]);
      }
    });
  }, [notification]);
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">NestJS social</span>
          <img className="top-bar-img" src="https://docs.nestjs.com/assets/logo-small.svg" />
        </Link>
      </div>
      <div className="topbarCenter">
        
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to="/messenger">
              <Chat />
              {notification != 0 && <span className="topbarIconBadge">{notification}</span>}
            </Link>
          </div>
        </div>
        <Link to={`/profile/${userInfo.userId}`} className="link-name">
          <img
            src={
              userInfo.avatar
            }
            alt=""
            className="topbarImg"
          />
          {userInfo.fullName}
        </Link>
        <OverlayTrigger
          key="bottom"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-bottom`}>
              <strong>Logout</strong>.
            </Tooltip>
          }
        >
          <button className="logout-btn" onClick={e => setShow(true)}><BiLogOut /></button>

        </OverlayTrigger>
        <Modal show={show} onHide={e => setShow(false)}>
          <Modal.Body>Do you want to logout?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={e => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}
