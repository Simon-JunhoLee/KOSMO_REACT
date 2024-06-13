import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import ReplyPage from './ReplyPage';

const ReadPage = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const isViewCnt = search.get('isViewCnt');
    // console.log(isViewCnt);
    
    const [form, setForm] = useState('');
    const {bid} = useParams();

    const callAPI = async() => {
        const res = await axios.get(`/bbs/${bid}?isViewCnt=${isViewCnt}`);
        // console.log(res.data);
        setForm(res.data);
    }

    const onDelete = async() => {
        Swal.fire({
            title: "",
            text: `${bid} 번 게시물을 삭제 하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then(async(result) => {
            if (result.isConfirmed) {
                await axios.post(`/bbs/delete/${bid}`);
                Swal.fire({
                    title: "삭제 성공",
                    text: "",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href="/bbs/list";
                    }else{
                        window.location.href="/bbs/list";
                    }
                });
            }
        });
    }

    useEffect(()=>{
        callAPI();
    }, [])

    return (
        <div className='my-5'>
            <h1 className='text-center'>게시글 정보</h1>
            <Row className='justify-content-center mb-5'>
                <Col xs={12} md={10} lg={8}>
                    <Card>
                        <Card.Header>
                            <Row>
                                <Col>[{bid}] {form.title}</Col>
                                <Col className='text-end'>조회수 : {form.viewCnt}</Col>
                            </Row>
                        </Card.Header>
                        <Card.Body style={{whiteSpace:'pre-wrap'}}>
                            {form.contents}
                        </Card.Body>
                        <Card.Footer className='text-end'>
                            Created by {form.uname}({form.uid}) on {form.regDate}
                        </Card.Footer>
                    </Card>
                    {sessionStorage.getItem('uid') === form.uid &&
                        <div className='text-center my-3'>
                            <Link to={`/bbs/update/${bid}`}><Button className='px-5 me-3' variant='dark'>수정</Button></Link>
                            <Button className='px-5' variant='secondary' onClick={onDelete}>삭제</Button>
                        </div>
                    }
                </Col>
            </Row>
            <ReplyPage bid={bid}/>
        </div>
    )
}

export default ReadPage