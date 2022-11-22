import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { SocketContext } from "../../context/Socket";
import Picker from 'emoji-picker-react';
import { OverlayTrigger, Popover } from "react-bootstrap";
import { BsEmojiSmile } from "react-icons/bs";
import { Spinner } from "react-bootstrap";
export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const scrollRef = useRef();
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji)
  };




  useEffect(() => {
    if (currentChat != null) {
      socket.on(`message-${currentChat.id}-${userInfo.userId}`, (res) => {
        setMessages([...messages, res]);
      });
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        setIsLoading(false);
        const res = await axios.get(`${url}conversations?userId=${userInfo.userId}&page=1&limit=10`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        socket.removeListener(`message-${userInfo.userId}`);
        setConversations(res.data.data);
        setIsLoading(true);
      } catch (err) {
      }
    };
    getConversations();
  }, [userInfo.id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const listMessages = await axios.get(`${url}conversation-reply?conversationId=${currentChat.id}&page=1&limit=10`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        setMessages(listMessages.data.data);
      } catch (err) {
      }
    };
    getMessages();
  }, [currentChat]);

  const conversationPickHandle = (event, conversation) => {
    setCurrentChat(conversation);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      id: null,
      text: newMessage,
      createdDate: Date.now(),
      isRead: false,
      conversationId: currentChat.id,
      userReply: {
        id: currentChat.user.id,
        fullName: currentChat.user.fullName,
        avatar: currentChat.user.avatar
      }
    };
    setMessages([...messages, message])
    const receiverId = currentChat.user.id;
    socket.emit("sendMessage", {
      receiverId: receiverId,
      text: newMessage,
      conversationId: currentChat.id
    });
    setNewMessage('');

  };

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {!isLoading ? <Spinner animation="border" className="isLoading-btn2" />
              :
              <>
                {conversations.map((c) => (
                  <div key={c.id} onClick={(e) => conversationPickHandle(e, c)}>
                    <Conversation conversation={c} currentUser={user} />
                  </div>
                ))}
              </>
            }
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.length !== 0 && messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.userReply.id !== userInfo.userId} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <OverlayTrigger
                    trigger="click"
                    key="left"
                    placement="left"
                    overlay={
                      <Popover id={`popover-positioned-left`}>
                        <Picker onEmojiClick={onEmojiClick} />
                      </Popover>
                    }
                  >
                    <button variant="secondary" className="chatEmojiButton">
                      <BsEmojiSmile />
                    </button>
                  </OverlayTrigger>

                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>

                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
                <img className="message-img-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Line-style-icons-chat.svg/1280px-Line-style-icons-chat.svg.png" />
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">

          </div>
        </div>
      </div>
    </>
  );
}
