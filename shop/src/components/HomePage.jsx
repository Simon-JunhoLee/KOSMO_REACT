import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { GoHeart, GoHeartFill } from "react-icons/go";
import Swal from 'sweetalert2';

const HomePage = () => {
    const uid = sessionStorage.getItem('uid');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(12);
    const [key, setKey] = useState('title');
    const [word, setWord] = useState('');
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    
    const onBookClick = (bid) => {
        navigate(`/books/update/${bid}`); 
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onClickLike = async(bid) => {
        if(uid){
            // 좋아요 저장
            const res = await axios.post('/books/likes/insert', {uid, bid});
            callAPI();
        }else{
            navigate('/users/login');
        }
    }

    const callAPI = async() => {
        const res = await axios.get(`/books/list?page=${page}&size=${size}&key=${key}&word=${word}&uid=${uid}`);
        // console.log(res.data);
        const documents = res.data.documents;
        setBooks(documents);
        setTotal(res.data.total)
    }

    useEffect(()=>{
        callAPI();
    }, [page])

    return (
        <div>
            <h1 className='text-center mb-4'>KOSMO 도서</h1>
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
                {total > 0 &&
                <Col className='text-start mt-2'>
                    검색수 : {total}건
                </Col>
                }
            </Row>
            {total > 0 ? 
            <Row>
                {books.map(book=>
                    <Col key={book.bid} xs={6} md={4} lg={2} className='mb-3'>
                        <Card>
                            <Card.Body onClick={()=>onBookClick(book.bid)} style={{cursor:'pointer'}}>
                                <img src={book.image} width="100%"/>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate'>{book.title}</div>
                                <Row>
                                <Col className='col-8' style={{fontSize:'13px'}}>{book.fmtPrice}원</Col>
                                <Col className='text-end col-4'>
                                    {book.ucnt === 0 ?
                                        <GoHeart className='heart' onClick={()=>onClickLike(book.bid)} />
                                    :
                                        <div className='heart'>
                                            <GoHeartFill/>
                                            <span> {book.lcnt}</span>
                                        </div>
                                    }
                                </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            :
            <div>
                <Alert className='text-center mt-5' variant='secondary'>
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

export default HomePage