import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Row, Col, Table, Button, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { CountContext } from '../CountContext';
import OrderPage from './OrderPage';
const CartPage = () => {
    const [isOrder, setIsOrder] = useState(false);
    const [chk, setChk] = useState(0);
    const {setCount} = useContext(CountContext);
    const [total, setTotal] = useState(0);
    const [books, setBooks] = useState([]);
    const uid = sessionStorage.getItem('uid');

    const callAPI = async () => {
        const res = await axios.get(`/cart/list?uid=${uid}`);
        const data = res.data.map(book=>book && {...book, sum:book.qnt*book.price, checked: false});
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

    useEffect(()=>{
        let count = 0;
        books.map(book => book.checked && count++);
        setChk(count);
    }, [books]);

    const onChangeAll = (e) => {
        const data = books.map(book => book && {...book, checked:e.target.checked});
        setBooks(data);
    }

    const onChangeSingle = (e, bid) => {
        setBooks(books.map(book => book.bid === bid ? { ...book, checked: e.target.checked } : book));
    }

    const onCheckedDelete = () => {
        if(chk === 0){
            Swal.fire({
                title: "장바구니 삭제 오류",
                text: "삭제할 도서를 선택하십시오.",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: `"${chk}"개의 도서를 삭제하시겠습니까?`,
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 선택한 도서들을 저장
                let cnt = 0;
                let deleted = 0;
                books.forEach(async book=>{
                    if(book.checked){
                        const res = await axios.post('/cart/delete', {bid:book.bid, uid});
                        cnt++;
                        if (res.data.result === 1) {
                            deleted++;
                            if(cnt === chk){
                                Swal.fire({
                                    title: "도서 삭제 완료",
                                    text: `${deleted} 개의 도서가 삭제되었습니다.`,
                                    icon: "success"
                                });
                                callAPI();
                            }
                        } else {
                            if(cnt === chk){
                                Swal.fire({
                                    title: "도서삭제 오류",
                                    text: "선택된 도서는 이미 삭제된 도서입니다.",
                                    icon: "error"
                                });
                                setBooks(books.map(book => book && { ...book, checked: false }));
                            }
                        }
                    }
                })
            }
        });
    }

    const onOrder = () => {
        if(chk ===0){
            Swal.fire({
                title: "도서 주문 오류",
                text: "주문할 도서를 선택하세요!",
                icon: "error"
            });
        }else{
            // 주문페이지로 이동
            setIsOrder(true);
        }
    }

    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={12} lg={12}>
                {!isOrder ? 
                <>
                <h1 className='text-center mb-5'>장바구니</h1>
                <div className='mb-2'>
                    <Button variant='dark' onClick={onCheckedDelete}>선택 도서 삭제</Button>
                </div>
                <Table hover className='mb-5'>
                    <colgroup>
                        <col width="5%" />
                        <col width="10%" />
                        <col width="40%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <thead className='table-dark'>
                        <tr className='text-center'>
                            <td><input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={chk === books.length}/></td>
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
                                <td className='text-center'><input type="checkbox" checked={book.checked} className='form-check-input' onChange={(e) => onChangeSingle(e, book.bid)}/></td>
                                <td>{book.bid}</td>
                                <td className='text-start text-truncate'>
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
                <div className='text-center mt-5'>
                    <Button variant='dark' className='me-3' style={{width:'150px'}} onClick={onOrder}>주문하기</Button>
                    <a href="/"><Button variant='secondary' style={{width:'150px'}}>쇼핑 계속하기</Button></a>
                </div>
                </>
                :
                <OrderPage books={books} setBooks={setBooks}/>
                }
            </Col>
        </Row>
    )
}

export default CartPage
