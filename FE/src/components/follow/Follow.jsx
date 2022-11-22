import { useEffect } from "react"
import { Modal } from "react-bootstrap"
import "./follow.css"
import axios from "axios"
import { useState } from "react";
import FollowList from "./FollowList";
import { Spinner } from "react-bootstrap";

export default function Follow({ show, onHide, type, userId, loginUserId }) {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const url = process.env.REACT_APP_PUBLIC_FOLDER;
    const [listFollow, setListFollow] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(async () => {
        setIsLoading(false);
        const res = await axios.get(`${url}following-relationships/get-${type}?page=1&limit=10&userId=${userId}`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
        setListFollow(res.data.data);
        setIsLoading(true);
    }, [userId, type])
    const modalShow = { show, onHide }
    return (
        <>
            <Modal
                {...modalShow}
                size="xm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal"
            >
                <div className="follow-title">
                    {type}
                </div>


                {!isLoading ? <Spinner animation="border" className="isLoading-btn2" />
                    :
                    <>
                        {listFollow.map((follow) => (
                            <div className="list-follow-modal" key={follow.user.id}>
                                <FollowList follow={follow} />
                            </div>
                        ))}
                    </>

                }
            </Modal>
        </>
    )
}