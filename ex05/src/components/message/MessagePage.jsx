import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MessageRouter from '../router/MessageRouter'

const MessagePage = () => {
    return (
        <Row>
            <Col xs={2}>
                <div>
                    <a href="/message/insert">메시지 작성</a>
                </div>
                <div>
                    <a href="/message/receive">받은 메시지</a>
                </div>
                <div>
                    <a href="/message/send">보낸 메시지</a>
                </div>
                <div>
                    <a href="/message/delete">휴지통</a>
                </div>
            </Col>
            <Col>
                <MessageRouter/>
            </Col>
        </Row>
    )
}

export default MessagePage