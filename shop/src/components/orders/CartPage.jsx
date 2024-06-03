import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Table, Button, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { CountContext } from '../CountContext';
const CartPage = () => {
    const {setCount} = useContext(CountContext);
    const [total, setTotal] = useState(0);
    const [books, setBooks] = useState([]);
    const uid = sessionStorage.getItem('uid');

    const callAPI = async () => {
        const res = await axios.get(`/cart/list?uid=${uid}`);
        const data = res.data.map(book=>book && {...book, sum:book.qnt*book.price});
        setBooks(data);
        setCount(data.length);

        let totalSum = 0;
        data.forEach(book=>{
            totalSum += book.sum;
        });
        setTotal(totalSum);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onChangeQnt = (bid, e) => {
        const result = e.target.value.replace(/[^0-9]/g, '');
        const data = books.map(book=>book.bid == bid ? {...book, qnt:result}:book);
        setBooks(data);
    }

    const onUpdateQnt = async(bid, qnt) => {
        Swal.fire({
            title: "",
            text: `${bid}번의 수량을 ${qnt}개로 변경하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "확인"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 수량 수정
                const res = await axios.post('/cart/update', {uid, bid, qnt});
                if(res.data.result === 1){
                    callAPI();
                }
            }
        });
    }

    const onClickDelete = async(bid) => {
        Swal.fire({
            title: "",
            text: `${bid}번 도서를 삭제하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "확인"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 장바구니 삭제
                const res = await axios.post('/cart/delete', {uid, bid});
                if(res.data.result === 1){
                    callAPI();
                }
            }
        });
    }

    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={12} lg={12}>
                <h1 className='text-center mb-5'>장바구니</h1>
                <Table hover className='mb-5'>
                    <colgroup>
                        <col width="10%" />
                        <col width="45%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <thead className='table-dark'>
                        <tr className='text-center'>
                            <td>ID.</td>
                            <td>도서명</td>
                            <td>가격</td>
                            <td>수량</td>
                            <td>총계</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book =>
                            <tr key={book.bid} className='text-center'>
                                <td>{book.bid}</td>
                                <td className='text-start'>
                                    <img src={book.image} width="30px" />
                                    <span className='mx-2'>{book.title}</span>
                                </td>
                                <td>{book.fmtPrice}원</td>
                                <td>
                                    <input value={book.qnt} size={3} className='text-center me-1' onChange={(e)=>onChangeQnt(book.bid, e)}/>
                                    <Button variant='secondary' size='sm' onClick={()=>onUpdateQnt(book.bid, book.qnt)}>수정</Button>
                                </td>
                                <td>{book.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</td>
                                <td><Button variant='dark' size='sm' onClick={()=>onClickDelete(book.bid)}>삭제</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <Alert className='text-end' variant='dark'>총합계: {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Alert>
            </Col>
        </Row>
    )
}

export default CartPage
