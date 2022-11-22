import "./rightbar.css";
import Online from "../online/Online";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

export default function Rightbar() {


  const userInfo = JSON.parse(localStorage.getItem("user"));
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  useEffect(async () => {
    setIsLoading(false);
    const res = await axios.get(`${url}following-relationships/recommend-friend`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` }, "Content-Type": "multipart/form-data" });
    setUsers(res.data)
    setIsLoading(true);
  }, [userInfo.userId])




  return (
    <div className="sidebar">
      <div className="rightbarWrapper">
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Recommend friends</h4>
        <ul className="rightbarFriendList">

          {!isLoading ? <Spinner animation="border" className="isLoading-btn" />
            :
            <>
              {users.map((u) => (
                <Online key={u.id} user={u} />
              ))}
            </>

          }
        </ul>
      </div>
    </div>
  );
}
