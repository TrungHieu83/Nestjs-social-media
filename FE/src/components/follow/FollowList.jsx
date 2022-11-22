import { Modal, Button } from "react-bootstrap"
import axios from "axios"
import { useState, useContext } from "react";
import { SocketContext } from "../../context/Socket";
import { useHistory } from "react-router-dom";


export default function FollowList({ follow }) {
    const history = useHistory();
    const socket = useContext(SocketContext);
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const handleShowConfirmBox = () => setShowConfirmBox(true);
    const handleCloseConfirmBox = () => setShowConfirmBox(false);
    const [isFollowing, setIsFollowing] = useState(follow.isFollowing);
    const handleUnFollow = async () => {
        try {
            const res = await axios.delete(`http://localhost:3000/following-relationships/unfollow`, {
                headers: {
                    "Authorization": `Bearer ${userInfo.access_token}`
                },
                data: { followedUserId: parseInt(follow.user.id) }
            });

            setIsFollowing(false);
            setShowConfirmBox(false);
        } catch (error) {
            
        }
    }
    const handleFollow = async () => {
        const payload = {
            type: 1,
            fromUserId: userInfo.userId,
            toUserId: follow.user.id
        }
        socket.emit('notification', payload);
        setIsFollowing(true)
    }
    const handleChangePage = () =>{
        history.push(`/profile/${follow.user.id}`);
        window.location.reload();
    }
    return (
        <div className="follow-item">
            <img className="follow-img-modal" src={follow.user.avatar} />
            <span className="follow-user-name-modal" onClick={handleChangePage}>{follow.user.fullName}</span>
            {follow.user.id === userInfo.userId ? <></>
                : <>
                    {!isFollowing ? <button className="follow-btn-modal" onClick={handleFollow}>Follow</button>
                        : <button className="unfollow-btn-modal" onClick={handleShowConfirmBox}>Unfollow</button>}
                </>}
            <Modal show={showConfirmBox} onHide={handleCloseConfirmBox} className="confirm-modal">
            <Modal.Header closeButton>
                <Modal.Title>Unfollow?</Modal.Title>
              </Modal.Header>
              <Modal.Body>NestJS won't let {follow.user.fullName}  know they've been removed from your follower list</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmBox}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUnFollow}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}