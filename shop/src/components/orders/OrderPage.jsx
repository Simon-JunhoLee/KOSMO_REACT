import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import ModalPhoto from '../users/ModalPhoto';
import axios from 'axios';
import ModalAddress from '../users/ModalAddress';
import {v4} from 'uuid';
import Swal from 'sweetalert2';

const OrderPage = ({ books, setBooks }) => {
    const uuid = v4();
    const pid = uuid.substring(0, 13);
    const [total, setTotal] = useState(0);
    const [form, setForm] = useState({
        uid:'',
        uname:'',
        phone:'',
        address1:'',
        address2:'',
        photo:''
    });
    const {uid, uname, phone, address1, address2, photo} = form;
    const callAPI = async() => {
        const res = await axios.get(`/users/read/${sessionStorage.getItem('uid')}`);
        setForm(res.data);
    }

    useEffect(()=>{
        callAPI();
    }, [])

    // filter를 통해 checked 된 book만 출력
    useEffect(()=>{
        const data = books.filter(book=>book.checked);
        let totalSum = 0;
        data.forEach(book=>{
            if(book.checked){
                totalSum += book.price*book.qnt;
            }
        });
        setTotal(totalSum);
        setBooks(data);
    }, []);

    const onChangeForm = (e) => {
        setForm({...Form, [e.target.name]: e.target.value});
    }

    const onClickOrder = async() => {
        Swal.fire({
            title: "",
            text: `${books.length}개의 도서를 주문하시겠습니까?`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "확인"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 주문자 정보 입력
                const res = await axios.post('/orders/purchase', {
                    ...form, sum:total, pid, uid
                });
                if(res.data.result === 1){
                    books.forEach(async book=>{
                        const res = await axios.post('/orders/insert', {
                            pid, bid:book.bid, price:book.price, qnt:book.qnt
                        });
                        if(res.data.result === 1){
                            await axios.post('/cart/delete', {uid, bid:book.bid});
                            Swal.fire({
                                title: "주문이 완료되었습니다.",
                                text: "",
                                icon: "success"
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    window.location.href="/";
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    return (
        <div>
            <h1 className='text-center mb-5'>주문하기</h1>
            <Table hover className='mb-5'>
                <colgroup>
                    <col width="10%" />
                    <col width="40%" />
                    <col width="10%" />
                    <col width="15%" />
                    <col width="10%" />
                </colgroup>
                <thead className='table-dark'>
                    <tr className='text-center'>
                        <td>ID.</td>
                        <td>도서명</td>
                        <td>가격</td>
                        <td>수량</td>
                        <td>총계</td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.bid} className='text-center'>
                            <td>{book.bid}</td>
                            <td className='text-start text-truncate'>
                                <img src={book.image} width="30px" />
                                <span className='mx-2'>{book.title}</span>
                            </td>
                            <td>{book.fmtPrice}원</td>
                            <td>{book.qnt}권</td>
                            <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Alert className='text-end' variant='dark'>총합계: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Alert>
            <Card className="o-hidden border-0 shadow-lg my-5">
                    <Card.Body className="p-0">
                        <Row className='readPage'>
                            <Col lg={4} className='ps-5 py-5'>
                                <img src={photo || "http://via.placeholder.com/300x300"} style={{width:'300px'}}/>
                            </Col>
                            <Col lg={8}>
                                <div className="p-5">
                                        <div className="text-center mb-4">
                                            <h1 className="h4 text-gray-900">주문자 정보</h1>
                                        </div>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>이름</InputGroup.Text>
                                            <Form.Control name='uname' value={uname} onChange={onChangeForm}/>
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>전화</InputGroup.Text>
                                            <Form.Control name='phone' value={phone} onChange={onChangeForm}/>
                                        </InputGroup>
                                        <InputGroup className='mb-2'>
                                            <InputGroup.Text className='title justify-content-center'>주소</InputGroup.Text>
                                            <Form.Control name='address1' value={address1} onChange={onChangeForm}/>
                                            <ModalAddress form={form} setForm={setForm} />
                                        </InputGroup>
                                        <Form.Control name='address2' value={address2} placeholder='상세주소' onChange={onChangeForm}/>
                                </div>
                            </Col>
                            <div className='text-center'>
                                <Button variant='dark' className='px-5 mb-5' onClick={onClickOrder}>주문하기</Button>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
        </div>
    )
}

export default OrderPage