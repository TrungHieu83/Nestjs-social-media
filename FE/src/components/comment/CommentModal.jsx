import { Modal, Row, Col, Carousel, Card } from "react-bootstrap";
import './comment.css'
import Comments from "./Comments";


export default function CommentModal({ show, onHide, post }) {
    const modalShow = { show, onHide }

    return (
        <Modal
            {...modalShow}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal"
        >
                <Row>
                    <Col sm={8}>
                        <Carousel fade >
                            {post.photos.map((photo) => (
                                <Carousel.Item>
                                    <img
                                        className="d-block w-100 postImgComment"
                                        src={photo.url}
                                        alt="image"
                                        key={photo.id}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col sm={4}>
                        <Comments post={post} show={show} />
                    </Col>
                </Row>
            

        </Modal>
    );
}