import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { SocketContext, socket } from "../../context/Socket";
import "./home.css"

export default function Home() {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <Topbar />
      </SocketContext.Provider>
      <div className="homeContainer">
        <SocketContext.Provider value={socket}>
          <Sidebar />
          <Feed />
          <Rightbar />
        </SocketContext.Provider>
      </div>
    </>
  );
}
