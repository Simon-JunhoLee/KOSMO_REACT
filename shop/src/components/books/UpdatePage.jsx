import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, CardFooter, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import ModalImage from './ModalImage';

const UpdatePage = () => {
    const { bid } = useParams();
    const [form, setForm] = useState({
        bid: bid,
        title: '',
        contents: '',
        author: '',
        image: '',
        fmtDate: '',
        price: '',
        bigImage: ''
    });

    const { title, contents, author, image, fmtDate, price, bigImage } = form;

    const callAPI = async () => {
        const res = await axios.get(`/books/read/${bid}`);
        // console.log(res.data);
        setForm(res.data);
    }

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onUpdate = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "수정한 정보를 저장하시겠습니까?",
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = '/books/update';
                const res = await axios.post(url, form);
                if (res.data.result == 1) {
                    callAPI();
                    Swal.fire({
                        title: "정보수정 완료",
                        text: "",
                        icon: "success"
                    });
                }
            }
        });
    }

    // 숫자만 입력 가능
    const onChangePrice = (e) => {
        const result = e.target.value.replace(/[^0-9]/g, '');
        setForm({...form, price:result});
    }

    useEffect(() => {
        callAPI();
    }, [])


    return (
        <Row className="justify-content-center updatePage">
            <Col className="col-xl-10 col-lg-12 col-md-9">
                <Card className="o-hidden border-0 shadow-lg my-5">
                    <Card.Body className="p-0">
                        <form onSubmit={onUpdate}>
                            <Row>
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mt-5">도서 정보 수정</h1>
                                </div>
                                <Col lg={5} className='ps-5 pb-5 pt-5'>
                                    <ModalImage bid={bid} bigImage={bigImage} callAPI={callAPI}/>
                                </Col>
                                <Col lg={7}>
                                    <div className="px-5 pt-5">
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>도서 제목</InputGroup.Text>
                                            <Form.Control name='title' value={title} onChange={onChangeForm} />
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>도서 가격</InputGroup.Text>
                                            <Form.Control name='price' value={price} onChange={onChangePrice} />
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>도서 저자</InputGroup.Text>
                                            <Form.Control name='author' value={author || "-"} onChange={onChangeForm} />
                                        </InputGroup>
                                        <div>
                                            <Form.Control name='contents' value={contents || "-"} as="textarea" rows={10} onChange={onChangeForm} />
                                        </div>
                                    </div>
                                </Col>
                                <div className='text-center mb-4'>
                                    <Button className='me-2' variant='dark' type='submit'>정보수정</Button>
                                    <Button variant='secondary' onClick={callAPI}>수정취소</Button>
                                </div>
                            </Row>
                        </form>
                    </Card.Body>
                    <CardFooter>
                        {fmtDate &&
                            <div className='text-end pe-5'>수정일 : {fmtDate}</div>
                        }
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    )
}

export default UpdatePage