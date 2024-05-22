import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, InputGroup, Form, Button } from 'react-bootstrap';

const BookSearch = () => {
    const [count, setCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('깃허브');
    const [books, setBooks] = useState([]);
    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers:{"Authorization":"KakaoAK 35c0aa5e699cabcb9592ef08fb07d91a"}
        };
        // const data = {query:'리액트', size:12, page:1};
        const res = await axios(url, config);
        console.log(res);
        setBooks(res.data.documents);
        setIsEnd(res.data.meta.is_end);
        setCount(res.data.meta.total_count);
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if(query === ""){
            alert("검색어를 입력하세요!");
        }else{
            setPage(1);
            callAPI();
        }
    }

    return (
        <div>
            <h1 className='text-center my-5'>도서검색</h1>
            <Row>
                <Col xs={6} md={6} lg={5} className='mb-3'>
                    <Form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='검색어'></Form.Control>
                            <Button variant='dark'>검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col>
                    <div className='mt-2'>검색수 : {count}권</div>
                </Col>
            </Row>
            <Row>
                {books.map((book, index) => 
                    <Col xs={6} md={4} lg={2} className='mb-3' key={index}>
                        <Card>
                            <Card.Body>
                                <img src={book.thumbnail || 'http://via.placeholder.com/120x170'} width="100%" alt="" />
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate'>{book.title}</div>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            {count > 12 && 
                <div className='text-center my-3'>
                    <Button variant='dark' onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                    <span className='mx-3'>{page}</span>
                    <Button variant='dark' onClick={()=>setPage(page+1)} disabled={isEnd===true}>다음</Button>
                </div>
            }
        </div>
    )
}

export default BookSearch