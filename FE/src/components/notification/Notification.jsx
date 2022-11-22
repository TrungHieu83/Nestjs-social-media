import { Card } from "react-bootstrap";
import "./notification.css"
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Notification({ notification }) {
    return (
        <>
            <Card bg="light" className="notificatio">
                <Card.Header className="card-header-1">
                    <Link className="profile-link" to={`/profile/${notification.userId}`}>
                        <img className="notification-user-img" src={notification.avatar} />
                        <span className="notification-user-name">{notification.fullName}</span>
                    </Link>
                    <span className="notification-time">{format(notification.createdDate)}</span>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        {notification.content}
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
}