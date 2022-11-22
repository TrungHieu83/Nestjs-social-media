import './comment.css'
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect, useContext } from 'react';
import { SocketContext } from '../../context/Socket';
import axios from 'axios';
import { format } from 'timeago.js';
import Picker from 'emoji-picker-react';
import { OverlayTrigger, Popover } from "react-bootstrap";
import { BsEmojiSmile } from "react-icons/bs";


export default function Comments({ post, show }) {
    const url = process.env.REACT_APP_PUBLIC_FOLDER;
    const socket = useContext(SocketContext);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [replyForComment, setReplyForComment] = useState(null);
    const [tag, setTag] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const [displayReply, setDisplayReply] = useState([]);
    const onEmojiClick = (event, emojiObject) => {
        setComment(comment + emojiObject.emoji)
    };
    useEffect(() =>{
        socket.on(`post-${post.postId}`, (res) => {
            
            if (res.replyForComment === null) {
                const newComment = {
                    id: res.id,
                    content: res.content,
                    createdDate: res.createdDate,
                    user: {
                        userId: res.userId,
                        fullName: res.fullName,
                        avatar: res.avatar
                    },
                    replyComment: []
                }
                if (comments.length == 0) {
                    setComments([newComment]);
                } else {
                    setComments([newComment, ...comments]);
                }
            } else {
                const addReply = comments.map((item) => {
                    if (item.id === res.replyForComment) {
                        const newComment = {
                            id: res.id,
                            content: res.content,
                            createdDate: res.createdDate,
                            user: {
                                userId: res.userId,
                                fullName: res.fullName,
                                avatar: res.avatar
                            }
                        }
                        item.replyComment.push(newComment);
                    }
                    return item;
                })
                setComments([...addReply]);
            }


        })
    },[comments])
    useEffect(async () => {
        const listComment = await axios.get(`${url}post-comments/get-comment?postId=${post.postId}&page=1&limit=10`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        setComments(listComment.data.data);
        return () => {
            socket.removeListener(`post-${post.postId}`);
        }
    }, [userInfo.userId]);
    const sendMess = async () => {
        
        const payload = {
            type: 3,
            fromUserId: userInfo.userId,
            toUserId: post.userId,
            postId: post.postId,
            comment: comment,
            replyForComment: replyForComment
        }
        socket.emit('notification', payload);
        setComment('');
        setReplyForComment(null);
    };

    const replyHandle = (event, commentId, userId, fullName) => {
        if (!displayReply.includes(commentId)) {
            setDisplayReply([...displayReply, commentId]);
        }
        setComment(`@${fullName} `);
        setReplyForComment(commentId);
        // setTag(<a className='userName' href={`profile/${userId}`}>@{fullName}</a>)

    }
    const isDisplayReply = (commentId) => {
        if (displayReply.includes(commentId)) {
            return true;
        }
        return false;

    }
    const haveReply = (list) => {
        if (list.length !== 0) {
            return true;
        }
        return false;
    }
    const displayHide = (totalComments, commentId) => {
        if (displayReply.includes(commentId)) {
            return (
                <p className='display-reply' onClick={() => {
                    for (var i = 0; i < displayReply.length; i++) {
                        if (displayReply[i] === commentId) {
                            displayReply.splice(i, 1);
                        }
                    }
                    setDisplayReply([...displayReply])
                }}>Hide reply comments</p>
            );
        }
        return (
            <p className='display-reply' onClick={() => setDisplayReply([...displayReply, commentId])}>View {totalComments} reply comments</p>
        );
    }


    return (
        <div className="comment-contain">
            <div className='comment-item top'>

                <Row className='row-top'>
                    <Col sm={2}>
                        <img
                            className="topProfileImg"
                            src={post.avatar}
                            alt=""
                        />
                    </Col>
                    <Col sm={10} className='top-user-name'>{post.fullName}</Col>
                    {tag}
                </Row>
            </div >
            <div className='comment-item center'>
                {comments.map((postComment) => (
                    <div className='comment' key={postComment.id}>
                        <Row className='row-center'>
                            <Col sm={2}>
                                <img
                                    className="centerProfileImg"
                                    src={postComment.user.avatar}
                                    alt=""
                                />
                            </Col>
                            <Col sm={10} className='center-user-name'>
                                <a className='userName' href={`profile/${postComment.user.userId}`}>{postComment.user.fullName}</a> {postComment.content}
                                <div className='time-ago'>
                                    <Row>
                                        <Col sm={4}>
                                            <span>{format(postComment.createdDate)}</span>
                                        </Col>
                                        <Col sm={2}>
                                            <span className='reply-btn' onClick={e => replyHandle(e, postComment.id, postComment.user.userId, postComment.user.fullName)}>Reply</span>
                                        </Col>
                                    </Row>
                                </div>
                                {haveReply(postComment.replyComment) && displayHide(postComment.replyComment.length, postComment.id)}
                            </Col>
                        </Row>
                        {isDisplayReply(postComment.id) && postComment.replyComment.map((reply) => (
                            <Row className='reply-comment' key={reply.id}>
                                <Col sm={2}>
                                    <img
                                        className="centerReplyProfileImg"
                                        src={reply.user.avatar}
                                        alt=""
                                    />
                                </Col>
                                <Col sm={10} className='center-user-name-reply'>
                                    <a className='userName' href={`profile/${reply.user.userId}`}>{reply.user.fullName}</a> {reply.content}
                                    <div className='time-ago'>
                                        <Row>
                                            <Col sm={4}>
                                                <span>{format(reply.createdDate)}</span>
                                            </Col>
                                            <Col sm={3}>
                                                <span className='reply-btn' onClick={e => replyHandle(e, postComment.id, reply.user.userId, reply.user.fullName)}>Reply</span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </div>
                ))}
            </div>
            <div className='comment-item bottom'>
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
                        placeholder="Write your comment..."
                        onChange={(e) => setComment(e.target.value)} value={comment}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={sendMess}>
                        Send
                    </button>

                </div>
            </div>
        </div>
    );
}