import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router";
import { SocketContext } from "../../context/Socket";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post"
import Follow from "../../components/follow/Follow";
import { Row, Col } from "react-bootstrap";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { BiMessageAltDetail } from "react-icons/bi";
import { Modal, Button } from "react-bootstrap";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";


export default function Profile() {
  const history = useHistory();
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const userId = useParams().userId;
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [following, setFollowing] = useState(0);
  const [follower, setFollower] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [cover, setCover] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const socket = useContext(SocketContext);
  const [posts, setPosts] = useState([]);
  const [dataUpload, setDataUpload] = useState(null);
  const [changeAvatarBtn, setChangeAvatarBtn] = useState(false);
  const [changeCoverBtn, setChangeCoverBtn] = useState(false);
  const [sniper, setSniper] = useState(false);
  const [showFollow, setShowFollow] = useState(false);
  const [typeFollow, setTypeFollow] = useState('');
  const [displayUser, setDisplayUser] = useState();
  const [isExist, setIsExist] = useState(true);
  const [fullName, setFulName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleUnFollow = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/following-relationships/unfollow`, {
        headers: {
          "Authorization": `Bearer ${userInfo.access_token}`
        },
        data: { followedUserId: parseInt(userId) }
      });

      setIsFollowing(false);
      setShow(false);
      setFollower(follower - 1);
    } catch (error) {
    }
  }
  const handleFollow = async () => {
    const payload = {
      type: 1,
      fromUserId: userInfo.userId,
      toUserId: userId
    }
    socket.emit('notification', payload);
    setIsFollowing(true)
    setFollower(follower + 1);
  }
  const handleAvatarChange = (e) => {
    if (e.target.files) {
      const file = URL.createObjectURL(e.target.files[0]);
      if (dataUpload == null) {
        setDataUpload(e.target.files[0]);
        setAvatar(file);
        setChangeAvatarBtn(true);
      }
    }
  }
  const handleCoverChange = (e) => {
    if (e.target.files) {
      const file = URL.createObjectURL(e.target.files[0]);
      if (dataUpload == null) {
        setDataUpload(e.target.files[0]);
        setCover(file);
        setChangeCoverBtn(true)
      }
    }
  }
  const uploadAvatar = async () => {
    const data = new FormData();
    data.append('files', dataUpload);
    try {
      setChangeAvatarBtn(false);
      setSniper(true);
      const res = await axios.post(`${url}users/upload-avatar`, data, { headers: { "Authorization": `Bearer ${userInfo.access_token}` }, "Content-Type": "multipart/form-data" });
      NotificationManager.success('Success message', 'Avatar is uploaded');
      localStorage.setItem("user", JSON.stringify({
        access_token: userInfo.access_token,
        refresh_token: userInfo.refresh_token,
        userId: userInfo.userId,
        fullName: userInfo.fullName,
        avatar: res.data.avatarUrl
      }));
      setDataUpload(null);
      setSniper(false);
    } catch (error) {

    }
  }
  const uploadCover = async () => {
    const data = new FormData();
    data.append('files', dataUpload);
    try {
      setChangeCoverBtn(false);
      setSniper(true);
      await axios.post(`${url}users/upload-cover`, data, { headers: { "Authorization": `Bearer ${userInfo.access_token}` }, "Content-Type": "multipart/form-data" });
      NotificationManager.success('Success message', 'Cover is uploaded');
      setDataUpload(null);
      setSniper(false);
    } catch (error) {

    }
  }
  const handleDisplayFollower = () => {
    if (follower != 0) {
      setShowFollow(true);
      setTypeFollow('follower');
      setDisplayUser(userId);
    }
  }
  const handleDisplayFollowing = () => {
    if (following != 0) {
      setShowFollow(true);
      setTypeFollow('following');
      setDisplayUser(userId);
    }
  }



  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(false);
        const res = await axios.get(`${url}users/user-profile/${userId}`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        setFollowing(res.data.totalFollowing);
        setFollower(res.data.totalFollower);
        setTotalPost(res.data.totalPost);
        setIsFollowing(res.data.isFollowing);
        setAvatar(res.data.avatar);
        setCover(res.data.cover);
        setFulName(res.data.fullName);
        const listPost = await axios.get(`${url}posts/profile/get-posts?page=1&limit=5&userId=${userId}`
          , { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        setPosts(listPost.data.data);
        setIsLoading(true);
      } catch (error) {
        if (error.response.data.message == `User have id-${userId} does not exist!`) {
          setIsExist(false);
        }
      }

    };
    fetchUser();
  }, [userId]);

  const handleChat = async () => {
    const res = await axios.get(`${url}conversations/${userId}`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } })
    history.push("/messenger");
  }
  return (
    <>
      <Topbar />
      <NotificationContainer />
      {isExist ?
        <div className="profile">
          <Sidebar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">

                <label htmlFor="cover" className="shareOption">
                  <img
                    className="profileCoverImg"
                    src={cover}
                    alt=""
                  />
                  {userInfo.userId == userId &&
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="cover"
                      accept=".png,.jpeg,.jpg"
                      multiple
                      onChange={handleCoverChange}
                    />
                  }
                </label>
                <label htmlFor="avatar" className="shareOption">
                  <img
                    className="profileUserImg"
                    src={
                      avatar
                    }
                    alt=""
                  />
                  {userInfo.userId == userId && <input
                    style={{ display: "none" }}
                    type="file"
                    id="avatar"
                    accept=".png,.jpeg,.jpg"
                    multiple
                    onChange={handleAvatarChange}
                  />}

                </label>
                {changeAvatarBtn && <button className="change-img-btn" onClick={uploadAvatar}>Change avatar</button>}
                {changeCoverBtn && <button className="change-img-btn" onClick={uploadCover}>Change cover</button>}
                {sniper && <button className="change-img-btn"><Spinner animation="border" /></button>}
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{fullName}</h4>
                <span className="profileInfoDesc">
                  <Row>
                    <Col >
                      <div className="user-count">
                        {totalPost}
                      </div>
                      posts
                    </Col>
                    <Col >
                      <div className="user-count" onClick={handleDisplayFollowing}>
                        {following}
                      </div>
                      following
                    </Col>
                    <Col >
                      <div className="user-count" onClick={handleDisplayFollower}>
                        {follower}
                      </div>
                      follower
                    </Col>
                  </Row>
                </span>
                {userId != userInfo.userId &&
                  <span>
                    {isFollowing
                      ? <button className="unfollow-btn" onClick={handleShow} >Unfollow <RiUserUnfollowLine /></button>
                      : <button className="follow-btn" onClick={handleFollow} >Follow <RiUserFollowLine /></button>
                    }

                    <button className="chat-btn" onClick={handleChat}><BiMessageAltDetail /></button>


                  </span>
                }
              </div>
            </div>
            <div className="profileRightBottom">
              <div className="feed">
                <div className="feedWrapper">
                  {<Share />}
                  {!isLoading ? <Spinner animation="border" className="isLoading-btn5" />
                    :
                    <>
                      {posts.map((p) => (
                        <Post key={p.postId} post={p} />
                      ))}
                    </>

                  }

                </div>

              </div>
            </div>
            <Follow
              show={showFollow}
              userId={displayUser}
              loginUserId={userInfo.userId}
              type={typeFollow}
              onHide={() => setShowFollow(false)}

            />
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Unfollow?</Modal.Title>
              </Modal.Header>
              <Modal.Body>NestJS won't let {fullName}  know they've been removed from your follower list</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleUnFollow}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        : <div className="error-not-found">
          Sorry, this page is currently unavailable. Back to <Link to="/">homepage</Link>
        </div>}
    </>
  );
}
