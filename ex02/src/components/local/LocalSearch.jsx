import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, InputGroup, Form, Col, Row } from 'react-bootstrap';
import ModalMap from './ModalMap';

const LocalSearch = () => {
    const [count, setCount] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [locals, setLocals] = useState([]);
    const [query, setQuery] = useState('가산디지털');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const callAPI = async() => {
        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&page=${page}&size=${size}`;
        const config = {
            headers:{"Authorization":"KakaoAK 35c0aa5e699cabcb9592ef08fb07d91a"}
        };
        const res = await axios.get(url, config);
        console.log(res.data);
        setLocals(res.data.documents);
        setIsEnd(res.data.meta.is_end);
        setCount(res.data.meta.total_count);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if(query === ''){
            alert('검색어를 입력하세요!')
        }else{
            setPage(1);
            callAPI();
        }
    }

    const onChange = (e) => {
        e.preventDefault();
        setPage(1);
        setSize(Number(e.target.value));
    }

    useEffect(()=>{
        callAPI();
    }, [page, size]);

    return (
        <div className='text-center'>
            <h1>지역검색</h1>
            <Row>
                <Col xs={6} md={6} lg={5} className='mb-3'>
                    <Form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button variant='dark'>검색</Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col className='text-start mt-2'>
                    <div>검색수 : {count}건</div>
                </Col>
                <Col xs={2} md={2} lg={2}>
                    <Form.Select defaultValue={10} onChange={onChange}>
                        <option value='5'>5행</option>
                        <option value='10'>10행</option>
                        <option value='15'>15행</option>
                    </Form.Select>
                </Col>
            </Row>
            <Table hover>
                <thead className='table-dark'>
                    <tr>
                        <td>id</td>
                        <td>지역명</td>
                        <td>전화번호</td>
                        <td>주소</td>
                        <td>지도보기</td>
                    </tr>
                </thead>
                <tbody>
                    {locals.map(local =>
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td><div className='text-truncate'>{local.place_name}</div></td>
                            <td><div className='text-truncate'>{local.phone || '-'}</div></td>
                            <td><div className='text-truncate'>{local.address_name}</div></td>
                            <td><ModalMap local={local}/></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center my-3'>
                <Button variant='dark' size='sm' onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                <span className='mx-3'>{page}</span>
                <Button variant='dark' size='sm' onClick={()=>setPage(page+1)} disabled={isEnd===true}>다음</Button>
            </div>
        </div>
    )
}

export default LocalSearch