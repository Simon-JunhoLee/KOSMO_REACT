import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import '../ChatPage.css'
import { app } from '../../firebaseInit'
import { getDatabase, set, ref, push, onValue } from 'firebase/database' 
import moment from 'moment'

const ChatPage = () => {
    const email = sessionStorage.getItem('email');
    const [chats, setChats] = useState([]);
    const db = getDatabase(app);
    const [content, setContent] = useState('');

    const callAPI = () => {
        onValue(ref(db, 'chat'), res => {
            let rows = [];
            res.forEach(row => {
                rows.push({key:row.key, ...row.val()});
            });
            // console.log(rows);
            setChats(rows);
        });
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        if(content === ""){
            alert("보내실 내용을 입력하세요.");
            return;
        }

        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const key = push(ref(db, 'chat')).key;
        // 메시지 보내기
        const data = {
            key,
            email:sessionStorage.getItem('email'),
            date,
            content
        }
        // console.log(data);
        await set(ref(db, `chat/${key}`), data);
        setContent('');
    }


    return (
        <Row className='justify-content-center my-5'>
            <Col>
                <Card>
                    <Card.Header>
                        <h3 className='text-center mt-3'>채팅방</h3>
                    </Card.Header>
                    <Card.Body className='wrap'>
                        {chats.map(chat => 
                            <div key={chat.key} className={chat.email===email?'chat ch2':'chat ch1'}>
                                {chat.email !== email &&
                                <div className='icon'>
                                    <img src="http://via.placeholder.com/50x50" alt="" />
                                    <div className='sender'>
                                        {chat.email}
                                    </div>
                                </div>
                                }
                                <div className='textbox'>
                                    <div>
                                        {chat.content}
                                        {chat.email===email && <a href="#">x</a> }
                                    </div>
                                    <div>{chat.date}</div>
                                </div>
                            </div>
                        )}
                    </Card.Body>
                    <form onSubmit={onSubmit}>
                        <Form.Control value={content} onChange={(e)=>setContent(e.target.value)} placeholder='내용을 입력하세요.'/>
                    </form>
                </Card>
            </Col>
        </Row>
    )
}

export default ChatPage