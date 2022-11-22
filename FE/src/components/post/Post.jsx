import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ItemsCarousel from "react-items-carousel";
import 'react-slideshow-image/dist/styles.css'
import { Carousel, Row, Col } from "react-bootstrap";
import { AiOutlineLike, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { HiOutlineHeart } from "react-icons/hi";
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from "socket.io-client";
import CommentModal from "../comment/CommentModal";
import { SocketContext } from "../../context/Socket";

export default function Post({ post }) {
  const socket = useContext(SocketContext);
  const [user, setUser] = useState({});
  const [active, setaActive] = useState(0);
  const [isLike, setIsLike] = useState(post.isLike);
  const [modalShow, setModalShow] = useState(false);
  const [totalLikes, setTotalLikes] = useState(post.totalLikes);
  const [totalComments, setTotalComments] = useState(post.totalComments);
  const likeHandler = async () => {
    setIsLike(!isLike);
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const payload = {
      type: 2,
      fromUserId: userInfo.userId,
      toUserId: post.userId,
      postId: post.postId
    }
    socket.emit('notification', payload);
    socket.on(`post-total-like-${post.postId}`, ({ totalLikes }) => {
      setTotalLikes(totalLikes);
    })
  };
  useEffect(() =>{
    socket.on(`post-total-comment-${post.postId}`, ({ totalComments }) => {
      setTotalComments(totalComments);
    })
    return () => {
      socket.removeListener(`post-total-like-${post.postId}`);
      socket.removeListener(`post-total-comment-${post.postId}`);
    }
  },[post.postId]);
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.userId}`}>
              <img
                className="postProfileImg"
                src={
                  post.avatar
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{post.fullName}</span>
            <span className="postDate">{format(post.createdDate)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.content}</span>
          <Carousel fade >
            {post.photos.map((photo) => (
              <Carousel.Item>
                <img
                  className="d-block w-100 postImg"
                  src={photo.url}
                  alt="image"
                  key={photo.id}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <Row xs="auto" className="comment-like">
            {totalLikes !== 0 && <Col>{totalLikes} like</Col>}
            {totalComments !== 0 && <Col onClick={() => setModalShow(true)} className="total-comment" >{totalComments} comments</Col>}
          </Row>
        </div>
        <div className="postBottom">
          <Row className="test">
            <Col className="colPost" onClick={likeHandler}>
              <div>
                {isLike ? <FcLike /> : <HiOutlineHeart />}
              </div>
            </Col>
            <Col className="colPost">
              <div>
                <AiOutlineComment onClick={() => setModalShow(true)} />
                <CommentModal
                  show={modalShow}
                  post={post}
                  onHide={() => setModalShow(false)}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
