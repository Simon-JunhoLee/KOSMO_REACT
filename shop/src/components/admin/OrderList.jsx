import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Pagination from 'react-js-pagination';
import ModalOrder from '../orders/ModalOrder';

const OrderList = () => {
    const [count, setCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(0);
    const [key, setKey] = useState('uid');
    const [word, setWord] = useState('');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);

    const callAPI = async() => {
        const res = await axios.get(`/orders/admin/list?key=${key}&word=${word}&page=${page}&size=${size}`);
        // console.log(res.data);
        setOrders(res.data.documents);
        setCount(res.data.count);
    }

    useEffect(() => {
        callAPI();
    }, [page, key, word]);

    const onChangeStatus = (e, pid) => {
        const data = orders.map(order => order.pid === pid ? {...order, status : e.target.value} : order);
        setOrders(data);
    }

    const onUpdateStatus = async(pid, status) => {
        Swal.fire({
            title: "",
            text: `${pid}번 주문의 상태를 ${status}로 변경하시겠습니까?`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.post('/orders/status', {pid, status});
                if(res.data.result === 1){
                    callAPI();
                    Swal.fire({
                        title: "주문상태 수정완료",
                        text: "",
                        icon: "success"
                    });
                }
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onChangeKey = (e) => {
        setKey(e.target.value);
        if(e.target.value ==='status'){
            setWord(0);
        }else{
            setWord('');
        }
    }

    const onChangeWord = (e) => {
        setWord(e.target.value);
        setPage(1);
    }

    return (
        <div>
            <h1 className='text-center mb-5'>주문관리</h1>
            <Row className='mb-3'>
                <Col className='col-5'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Col className='col-4 me-3'>
                                <Form.Select value={key} onChange={onChangeKey}>
                                    <option value="uid">아이디</option>
                                    <option value="uname">주문자명</option>
                                    <option value="phone">전화</option>
                                    <option value="address1">배송지</option>
                                    <option value="status">주문상태</option>
                                </Form.Select>
                            </Col>
                            {key === 'status' ?
                            <Col>
                                <InputGroup>
                                    <Form.Select value={word} onChange={onChangeWord}>
                                        <option value="0">결제대기</option>
                                        <option value="1">결제확인</option>
                                        <option value="2">배송준비</option>
                                        <option value="3">배송완료</option>
                                        <option value="4">주문완료</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                            :
                            <Col>
                                <InputGroup>
                                    <Form.Control placeholder='검색어' value={word} onChange={(e)=>setWord(e.target.value)}/>
                                    <Button variant='dark' type='submit'>검색</Button>
                                </InputGroup>
                            </Col>
                            }
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-start mt-2'>
                    검색수 : {count}건
                </Col>
            </Row>
            <Table hover>
                <thead className='table-dark'>
                    <tr className='text-center'>
                        <td>주문번호</td>
                        <td>주문날짜</td>
                        <td>주문자</td>
                        <td>주문금액</td>
                        <td>전화</td>
                        <td>주소</td>
                        <td>주문상품</td>
                        <td>주문상태</td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {orders.map(order =>
                        <tr key={order.pid}>
                            <td>{order.pid}</td>
                            <td>{order.fmtDate}</td>
                            <td>{order.uname}({order.uid})</td>
                            <td>{order.fmtSum}원</td>
                            <td>{order.phone}</td>
                            <td className='text-truncate'>{order.address1} {order.address2}</td>
                            <td><ModalOrder pid={order.pid} order={order}/></td>
                            <td>
                                <InputGroup>
                                    <Form.Select name='status' value={order.status} onChange={(e)=>onChangeStatus(e, order.pid)}>
                                        <option value="0">결제대기</option>
                                        <option value="1">결제확인</option>
                                        <option value="2">배송준비</option>
                                        <option value="3">배송완료</option>
                                        <option value="4">주문완료</option>
                                    </Form.Select>
                                    <Button variant='dark' onClick={()=>onUpdateStatus(order.pid, order.status)}>변경</Button>
                                </InputGroup>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {count > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={count}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e)=>setPage(e)}/>
            }
        </div>
    )
}

export default OrderList