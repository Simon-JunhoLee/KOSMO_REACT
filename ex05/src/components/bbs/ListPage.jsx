import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import '../Paging.css';
import { Link, useNavigate } from 'react-router-dom';

const ListPage = () => {
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [key, setKey] = useState('title');
    const [word, setWord] = useState('');
    const navigate = useNavigate();

    const onRowClick = (bid) => {
        navigate(`/bbs/read/${bid}?isViewCnt=true`); 
    };

    const callAPI = async () => {
        const res = await axios.get(`/bbs/list.json?key=${key}&word=${word}&page=${page}&size=${size}`);
        // console.log(res.data);
        setList(res.data.documents);
        setTotal(res.data.total);
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    return (
        <div className='my-5'>
            <h1 className='text-center'>게시판</h1>
            <Row className='mb-3'>
                <Col className='col-5'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Col className='col-4 me-3'>
                                <Form.Select value={key} onChange={(e) => setKey(e.target.value)}>
                                    <option value="title">제목</option>
                                    <option value="contents">내용</option>
                                    <option value="uid">작성자 아이디</option>
                                    <option value="uname">작성자 이름</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Form.Control placeholder='검색어' value={word} onChange={(e) => setWord(e.target.value)} />
                                    <Button variant='dark' type='submit'>검색</Button>
                                </InputGroup>
                            </Col>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-start mt-2'>
                    검색수 : {total}건
                </Col>
                {sessionStorage.getItem('uid') &&
                    <Col className='text-end'>
                        <Link to="/bbs/insert"><Button variant='dark' className='px-3'>글쓰기</Button></Link>
                    </Col>
                }
            </Row>
            <Table hover>
                <thead className='table-dark text-center'>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                        <td>Writer</td>
                        <td>Date</td>
                        <td>조회수</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(bbs =>
                        <tr key={bbs.bid} className='text-center'>
                            <td>{bbs.bid}</td>
                            <td className='text-truncate' onClick={() => onRowClick(bbs.bid)} style={{ cursor: 'pointer' }}>{bbs.title} ({bbs.replyCnt})</td>
                            <td>{bbs.uname}({bbs.uid})</td>
                            <td>{bbs.fmtDate}</td>
                            <td>{bbs.viewCnt}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
            <Pagination
                activePage={page}
                itemsCountPerPage={size}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e) => setPage(e)} />
            }
        </div>
    )
}

export default ListPage