import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2';

const InsertPage = () => {
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState('');
    const [users, setUsers] = useState([]);

    const callAPI = async() => {
        const res = await axios.get('/users');
        setUsers(res.data);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onSend = async() => {
        if(message === ""){
            Swal.fire({
                title: "메시지 내용을 입력하세요!",
                text: "",
                icon: "error"
            });
            return;
        }
        await axios.post('/message/insert', {
            sender:sessionStorage.getItem('uid'),
            receiver,
            message
        });
        Swal.fire({
            title: "메시지가 전송되었습니다.",
            text: "",
            icon: "success"
        }).then(() => {
            window.location.href='/message';
        });
    }

    return (
        <div>
            <h1 className='text-center my-5'>메시지 작성</h1>
            <div className='mb-3'>
                <Form.Select value={receiver} onChange={(e)=>setReceiver(e.target.value)}>
                    {users.map(user=>
                        <option key={user.uid} value={user.uid}>
                            {user.uname}({user.uid})
                        </option>
                    )}
                </Form.Select>
            </div>
            <div>
                <Form.Control as='textarea' rows={10} value={message} onChange={(e)=>setMessage(e.target.value)}/>
            </div>
            <div className='text-center mt-3'>
                <Button className='px-5' variant='dark' onClick={onSend}>보내기</Button>
            </div>
        </div>
    )
}

export default InsertPage