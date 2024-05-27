import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import { app } from '../../firebaseInit';

const UpdatePage = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const {id} = useParams();
    const [form, setForm] = useState('');
    const {title, body} = form
    const callAPI = async() => {
        setLoading(true);
        const res = await getDoc(doc(db, `posts/${id}`));
        console.log(res.data());
        setForm(res.data());
        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(!window.confirm(`${id}번 게시글을 수정하시겠습니까?`)) return;
        // 게시글 수정
        setLoading(true);
        await setDoc(doc(db, `posts/${id}`), form);
        setLoading(false);
        navi(`/post/read/${id}`);
    }

    if(loading) return <h1 className='text-center my-5'>로딩중......</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col>
                <h1 className='text-center mb-5'>게시글 수정</h1>
                <form onSubmit={onSubmit}>
                    <Form.Control className='mb-2' name='title' onChange={onChangeForm} value={title}/>
                    <Form.Control as="textarea" rows={10} className='mb-3' name='body' onChange={onChangeForm} value={body}/>
                    <div className='text-center'>
                        <Button className='px-5' type='submit'>수정</Button>
                        <Button className='px-5' variant='secondary ms-2' onClick={()=>callAPI()}>취소</Button>
                    </div>
                </form>
            </Col>
        </Row>
    )
}

export default UpdatePage