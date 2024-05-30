import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, InputGroup, Button, FormControl } from 'react-bootstrap';
import ModalAddress from './ModalAddress';
import Swal from 'sweetalert2'
import ModalPhoto from './ModalPhoto';

const ReadPage = () => {
    const uid = sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        uname: '',
        phone: '',
        address1: '',
        address2: ''
    });

    const { uname, phone, address1, address2, photo } = form;

    const callAPI = async () => {
        const url = `/users/read/${uid}`;
        const res = await axios.get(url);
        // console.log(res.data);
        setForm(res.data);
    }

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (uname === "") {
            Swal.fire({
                title: "정보수정 에러",
                text: "이름을 입력하세요!",
                icon: "warning"
            });
            return;
        }
        Swal.fire({
            title: "수정한 정보를 저장하시겠습니까?",
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = '/users/update';
                const res = await axios.post(url, form);
                if (res.data.result == 1) {
                    Swal.fire({
                        title: "정보수정 완료",
                        text: "",
                        icon: "success"
                    });
                    callAPI();
                }
            }
        });
    }

    useEffect(() => {
        callAPI();
    }, [])

    return (
        <Row className="justify-content-center readPage">
            <Col className="col-xl-10 col-lg-12 col-md-9">
                <Card className="o-hidden border-0 shadow-lg my-5">
                    <Card.Body className="p-0">
                        <Row>
                            <Col lg={5} className='ps-5 pt-5'>
                                <ModalPhoto uid={uid} photo={photo} callAPI={callAPI} />
                            </Col>
                            <Col lg={7}>
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">My Page</h1>
                                    </div>
                                    <form onSubmit={onSubmit}>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>이름</InputGroup.Text>
                                            <Form.Control name='uname' value={uname} onChange={onChangeForm} />
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>전화</InputGroup.Text>
                                            <Form.Control name='phone' value={phone} onChange={onChangeForm} />
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>주소</InputGroup.Text>
                                            <Form.Control name='address1' value={address1} onChange={onChangeForm} />
                                            <ModalAddress form={form} setForm={setForm} />
                                        </InputGroup>
                                        <Form.Control name='address2' value={address2} placeholder='상세주소' onChange={onChangeForm} />
                                        <div className='text-center my-3'>
                                            <Button className='me-2' variant='dark' type='submit'>정보수정</Button>
                                            <Button variant='secondary' onClick={callAPI}>수정취소</Button>
                                        </div>
                                    </form>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ReadPage