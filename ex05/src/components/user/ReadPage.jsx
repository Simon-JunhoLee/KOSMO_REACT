import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import AddressModal from '../common/AddressModal';
import Swal from 'sweetalert2';
import PassModal from './PassModal';

const ReadPage = () => {
    const uid = sessionStorage.getItem('uid');
    const [user, setUser] = useState('');
    const {uname, address1, address2, phone, photo} = user;
    const refFile = useRef(null);

    const onChangeForm = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    
    const callAPI = async() => {
        const res = await axios.get(`/users/${uid}`);
        // console.log(res.data);
        setUser(res.data);
        setImage({...image, fileName:res.data.photo && `/display?file=${res.data.photo}`});
    }

    const onClickUpdate = (e) => {
        e.preventDefault();
        if(uname === "") {
            Swal.fire({
                title: "정보수정 에러",
                text: "이름을 입력하세요!",
                icon: "warning"
            });
            return;
        }
        Swal.fire({
            title: "변경된 정보를 저장하시겠습니까?",
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = '/users/update';
                await axios.post(url, user);
                Swal.fire({
                    title: "정보수정 완료",
                    text: "",
                    icon: "success"
                });
                callAPI();
            }
        });
    }

    const [image, setImage] = useState({
        fileName:'',
        file:null
    });

    // image 선택해서 바뀔 시, 미리보기
    const onChangeFile = (e) => {
        setImage({
            fileName:URL.createObjectURL(e.target.files[0]),
            file:e.target.files[0]
        });
    }

    const {file, fileName} = image;

    const onUploadImage = () => {
        if(file) {
            Swal.fire({
                title: "변경된 이미지를 저장하시겠습니까?",
                text: "",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "black",
                cancelButtonColor: "gray",
                confirmButtonText: "Confirm"
            }).then(async(result) => {
                if (result.isConfirmed) {
                    // 이미지 업로드
                    const formData = new FormData();
                    formData.append("file", file);
                    const config = {
                        Headers:{'content-type':'multipart/form-data'}
                    };
                    await axios.post(`/users/photo/${uid}`, formData, config);
                    setImage({
                        fileName:'',
                        file:null
                    });
                    callAPI();
                }else{
                    return;
                }
            });
        }
    }

    useEffect(()=>{
        callAPI();
    }, []);
    
    return (
        <Row className="justify-content-center readPage">
            <Col className="col-xl-10 col-lg-12 col-md-9">
                <Card className="o-hidden border-0 shadow-lg my-5">
                    <Card.Body className="p-0">
                        <Row>
                            <Col lg={5}>
                                <Row>
                                    <Col className='d-flex align-items-center justify-content-center pt-5'>
                                        <img src={fileName || 'http://via.placeholder.com/300x300'} onClick={()=>refFile.current.click()}/>
                                        <input ref={refFile} type="file"  onChange={onChangeFile} style={{display:'none'}}/>
                                    </Col>
                                </Row>
                                <Row className='px-5 py-5'>
                                    <Button variant='dark' onClick={onUploadImage}>이미지 저장</Button>
                                </Row>
                            </Col>
                            <Col lg={7}>
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">My Page</h1>
                                    </div>
                                    <div>
                                        <PassModal/>
                                    </div>
                                    <form >
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>이름</InputGroup.Text>
                                            <Form.Control name='uname' value={uname || '-'} onChange={onChangeForm}/>
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>전화</InputGroup.Text>
                                            <Form.Control name='phone' value={phone || '-'} onChange={onChangeForm}/>
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>주소</InputGroup.Text>
                                            <Form.Control name='address1' value={address1 || '-'} onChange={onChangeForm}/>
                                            <AddressModal form={user} setForm={setUser} />
                                        </InputGroup>
                                        <Form.Control name='address2' value={address2 || '-'} onChange={onChangeForm}/>
                                        <div className='text-center my-3'>
                                            <Button className='me-2' variant='dark' onClick={onClickUpdate}>정보수정</Button>
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