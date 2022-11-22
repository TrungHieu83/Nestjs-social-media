import "./share.css";
import {
  PermMedia,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const content = useRef();
  const [tag, setTag] = useState([Number]);
  const [file, setFile] = useState([]);
  const [dataUpload, setDataUpload] = useState([]);
  const url = process.env.REACT_APP_PUBLIC_FOLDER;

  const submit = async () => {
    const data = new FormData();
    for (let i = 0; i < dataUpload.length; i++) {
      data.append(`files`, dataUpload[i])
    }
    try {
      const res = await axios.post(`${url}posts/create-post`, { content: content.current.value, tags: tag }, { headers: { "Authorization": `Bearer ${userInfo.access_token}` } });
      await axios.post(`${url}posts/upload-photos/${res.data.postId}`, data, { headers: { "Authorization": `Bearer ${userInfo.access_token}` }, "Content-Type": "multipart/form-data" });
      window.location.reload();
    } catch (err) { }
  }
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => {
        setDataUpload([...dataUpload, file])
        return URL.createObjectURL(file)
      }

      );
      setFile((prevImages) => prevImages.concat(filesArray));
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file)
      );
    }
  };
  const renderPhotos = (source) => {
    
    return source.map((photo) => {
      return <img src={photo} alt="" key={photo} />;
    });
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              userInfo.avatar
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + userInfo.fullName + "?"}
            className="shareInput"
            ref={content}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            {/* <img className="shareImg" src={URL.createObjectURL(file)} alt="" /> */}
            <div className="result">{renderPhotos(file)}</div>
            
          </div>
        )}
        <form className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Add photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                multiple
                onChange={handleImageChange}
              />
            </label>
            {/* <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div> */}
          </div>
          <button className="shareButton" type="button" onClick={submit}>
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
