import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import Swal from 'sweetalert2';

const InsertPage = () => {
    const [form, setForm] = useState({
        uid: sessionStorage.getItem('uid'),
        title: '',
        contents: ''
    });
    const { uid, title, contents } = form;

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onReset = () => {
        setForm({ ...form, title: '', contents: '' });
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        await axios.post('/bbs/insert', form);
        Swal.fire({
            title: "게시글 등록완료!",
            text: "",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href='/bbs/list';
            }else{
                window.location.href='/bbs/list';
            }
        });
        
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-2'>글쓰기</h1>
            <Row className='justify-content-center'>
                <Col xs={12} md={10} lg={10}>
                    <form onReset={onReset} onSubmit={onSubmit}>
                        <Form.Control name='title' value={title} className='mb-2' placeholder='제목을 입력하세요.' onChange={onChangeForm} />
                        <Form.Control name='contents' value={contents} as='textarea' rows={10} placeholder='내용을 입력하세요.' onChange={onChangeForm} />
                        <div className='mt-3 text-center'>
                            <Button type='submit' className='px-5 me-2' variant='dark'>등록</Button>
                            <Button type='reset' className='px-5' variant='secondary'>취소</Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    )
}

export default InsertPage