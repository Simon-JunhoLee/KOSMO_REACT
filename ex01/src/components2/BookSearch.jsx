import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, InputGroup, Form, Button, Spinner } from 'react-bootstrap';
import ModalBook from './ModalBook';

const BookSearch = () => {
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [last, setLast] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('자바');
    const [books, setBooks] = useState([]);
    // async 함수 : await과 세트로 사용됨 => 데이터를 가져온 후 함수 실행
    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
        const config = {
            headers : {"Authorization":"KakaoAK 35c0aa5e699cabcb9592ef08fb07d91a"}
        }
        const res = await axios.get(url, config);
        console.log(res.data);
        setBooks(res.data.documents);
        setLast(res.data.meta.is_end);
        setTotal(res.data.meta.total_count);
    };

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
    if(loading) return <div className='text-center my-5'><Spinner animation='grow' variant='primary'></Spinner></div>
    return (
        <div className='my-5 bookSearch'>
            <h1 className='text-center'>도서 검색</h1>
            <Row>
                <Col xs={8} md={6} lg={4}>
                    <Form onSubmit={onSubmit}>
                        <InputGroup  className='mb-3'>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)} value={query} placeholder='검색어'/>
                            <Button variant='dark'>검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col><div className='mt-2 text-start'>검색수 : {total}권</div></Col>
            </Row>
            <Row className='mb-2'>
                {books.map(book => 
                    <Col xs={6} md={4} lg={2} className='mb-3'>
                        <Card>
                            <Card.Body>
                                <ModalBook book={book}/>
                            </Card.Body>
                            <Card.Footer>
                                <div className='text-truncate'>{book.title}</div>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            {/* && : true와 같은 의미 */}
            {total > 12 && 
            <div className='mt-3'>
                <Button variant='dark' size='sm' onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-3'>{page}</span>
                <Button variant='dark' size='sm' onClick={()=>setPage(page+1)} disabled={last===true}>다음</Button>
            </div>
            }
        </div>
    )
};

export default BookSearch