import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const UpdatePage = () => {
    const {bid} = useParams();
    const [form, setForm] = useState({
        bid,
        title:'',
        contents:''
    });

    const {title, contents} = form;

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const callAPI = async() => {
        const res = await axios.get(`/bbs/${bid}?isViewCnt=false`);
        setForm(res.data);
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onReset = () => {
        Swal.fire({
            title: "",
            text: `게시물 수정을 취소하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                callAPI();
                return;
            }
        });
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        Swal.fire({
            title: "",
            text: `${bid} 번 게시물을 수정 하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Update"
        }).then(async(result) => {
            if (result.isConfirmed) {
                await axios.post('/bbs/update', form);
                Swal.fire({
                    title: "수정 성공",
                    text: "",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href=`/bbs/read/${bid}?isViewCnt=false`;
                    }else{
                        window.location.href=`/bbs/read/${bid}?isViewCnt=false`;
                    }
                });
            }
        });
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>게시글 수정</h1>
            <Row className='justify-content-center'>
                <Col xs={12} md={10} lg={10}>
                    <form onReset={onReset} onSubmit={onSubmit}>
                        <Form.Control className='mb-2' name='title' value={title} onChange={onChangeForm}/>
                        <Form.Control as="textarea" rows={10} name='contents' value={contents} onChange={onChangeForm}/>
                        <div className='text-center my-3'>
                            <Button type='submit' className='px-5 me-3' variant='dark'>수정</Button>
                            <Button type='reset' className='px-5' variant='secondary'>취소</Button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    )
}

export default UpdatePage