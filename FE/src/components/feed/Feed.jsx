import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { refreshToken } from "../../apiCalls";
import { Spinner } from "react-bootstrap";
export default function Feed({ username }) {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [isAuth, setIsAuth] = useState(true);
  const url = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    try {
      setIsLoading(false);
      const res = await axios.get(`${url}posts/get-posts?page=1&limit=10`, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
      setPosts(res.data.data);
      setIsAuth(true);
      setIsLoading(true);
    } catch (error) {
      await refreshToken();
      setIsAuth(false);
    }

  }, [user, isAuth]);
  const test = async () => {
    const result = await axios.get(`${url}auth/facebook`);
    
  }
  return (
    <div className="feed">
      <div className="feedWrapper">
        {<Share />}
        
        {!isLoading ? <Spinner animation="border" className="isLoading-btn1" /> 
        :
        <>
        {posts.map((p) => (
          <Post key={p.postId} post={p} />
        ))}
        </>

        }
        
      </div>
      
    </div>
  );
}
