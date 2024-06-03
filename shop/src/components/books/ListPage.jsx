import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button, Row, Col, InputGroup, Form, Alert } from 'react-bootstrap';
import '../Paging.css';
import Pagination from 'react-js-pagination';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ListPage = () => {
    const [key, setKey] = useState('title');
    const [word, setWord] = useState('');
    const [loading, setLoading] = useState(false);
    const [chk, setChk] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        let count = 0;
        books.map(book => book.checked && count++);
        setChk(count);
    }, [books]);
    
    const callAPI = async() => {
        setLoading(true);
        const url = `/books/list?page=${page}&size=${size}&key=${key}&word=${word}`;
        const res = await axios.get(url);
        const documents = res.data.documents;
        if(documents){
            setBooks(documents.map(book => book && { ...book, checked: false}));
        }else{
            setBooks([]);
            Swal.fire({
                title: "검색 결과 없음",
                text: "검색된 결과가 없습니다.",
                icon: "error",
                confirmButtonColor: "black",
                confirmButtonText: "확인"
            });
        }
        setTotal(res.data.total);
        if(page > Math.ceil(res.data.total/size)) setPage(page-1);
        // console.log(total);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, [page])

    const onDelete = async(book) => {
        Swal.fire({
            title: "",
            text: `"${book.title}" 도서를 삭제하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 삭제작업
                const res = await axios.post('/books/delete', {bid:book.bid});
                if(res.data.result === 1){
                    Swal.fire({
                        title: "도서삭제 완료",
                        text: `"${book.title}" 도서가 삭제되었습니다.`,
                        icon: "success"
                    });
                    callAPI();
                }else{
                    Swal.fire({
                        title: "도서삭제 실패",
                        text: `"${book.title}" 도서는 삭제할 수 없습니다.`,
                        icon: "error"
                    });
                }
                
            }
        });
    }

    const onChangeAll = (e) => {
        setBooks(books.map(book => book && { ...book, checked: e.target.checked }));
    }

    const onChangeSingle = (e, bid) => {
        setBooks(books.map(book => book.bid === bid ? { ...book, checked: e.target.checked } : book));
    }

    const onDeleteChecked = () => {
        if(chk === 0) {
            Swal.fire({
                title: "도서삭제 오류",
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
                // 선택한 도서들을 삭제
                let cnt = 0;
                let deleted = 0;
                books.forEach(async book=>{
                    if(book.checked){
                        const res = await axios.post('/books/delete', {bid:book.bid});
                        cnt++;
                        if (res.data.result === 1) {
                            deleted++;
                            if(cnt === chk){
                                Swal.fire({
                                    title: "도서삭제 완료",
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

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onRowClick = (bid) => {
        navigate(`/books/update/${bid}`); 
    };

    if(loading) return <h1 className='text-center my-5'>로딩중...</h1>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서목록</h1>
            <Row className='mb-3'>
                <Col className='col-5'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Col className='col-4 me-3'>
                                <Form.Select value={key} onChange={(e)=>setKey(e.target.value)}>
                                    <option value="title">제목</option>
                                    <option value="author">저자</option>
                                    <option value="publisher">출판사</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Form.Control placeholder='검색어' value={word} onChange={(e)=>setWord(e.target.value)}/>
                                    <Button variant='dark' type='submit'>검색</Button>
                                </InputGroup>
                            </Col>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-start mt-2'>
                    검색수 : {total}건
                </Col>
                {total > 0 &&
                <Col className='text-end'>
                        <Button variant='dark' onClick={onDeleteChecked}>선택삭제</Button>
                </Col>
                }
            </Row>
            {total > 0 ?
            <Table hover>
                <thead className='table-dark text-center'>
                    <tr>
                        <td><input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={chk === books.length}/></td>
                        <td>ID</td>
                        <td className='text-end'>이미지</td>
                        <td>제목</td>
                        <td>가격</td>
                        <td>저자</td>
                        <td>등록일</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book=>
                        <tr className='text-center' key={book.bid}>
                            <td className='text-center'><input type="checkbox" checked={book.checked} className='form-check-input' onChange={(e) => onChangeSingle(e, book.bid)} /></td>
                            <td>{book.bid}</td>
                            <td className='text-end'><img src={book.image || 'http://via.placeholder.com/120x170'} width="40px" /></td>
                            <td className='text-truncate' onClick={() => onRowClick(book.bid)} style={{ cursor: 'pointer' }}>{book.title}</td>
                            <td>{book.fmtPrice}</td>
                            <td>{book.author || "-"}</td>
                            <td>{book.fmtDate}</td>
                            <td><Button variant='dark' size='sm' onClick={() => onDelete(book)}>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            :
            <div>
                <Alert className='text-center' variant='secondary'>
                <h5>검색결과가 없습니다.</h5>
                </Alert>
            </div>
            }
            {total > size &&
            
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e)=>setPage(e)}/>
            }
        </div>
    )
}

export default ListPage