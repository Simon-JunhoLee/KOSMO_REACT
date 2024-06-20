import React, { useContext, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { BoxContext } from '../../context/BoxContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InsertPage = () => {
    const [form, setForm] = useState({
        lname: '',
        dept: '전산'
    });
    const { lname, dept } = form;
    const {setBox} = useContext(BoxContext);
    const navigate = useNavigate('');

    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(lname=='') {
            setBox({
                show:true, 
                message:'강좌이름을 입력하세요!'
            });
            return;
        }
        await axios.post('/cou/insert', form);
        setBox({
            show : true,
            message : (
                <span>
                    강좌가 등록되었습니다.<br />
                    목록페이지로 이동하시겠습니까?
                </span>
            ),
            action : ()=>{
                navigate('/cou');
            }
        });
    }

    return (
        <div className='courses'>
            <Row className="justify-content-center">
                <Col className="col-xl-10 col-lg-12 col-md-9">
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="text-gray-900 mb-4">강좌 등록</h1>
                                </div>
                                <form onSubmit={onSubmit}>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text className="title justify-content-center">학과</InputGroup.Text>
                                        <Form.Select name='dept' value={dept} onChange={onChangeForm}>
                                            <option value="전산">컴퓨터공학과</option>
                                            <option value="전자">전기공학과</option>
                                            <option value="건축">건축학과</option>
                                        </Form.Select>
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Text className="title justify-content-center">이름</InputGroup.Text>
                                        <Form.Control name="lname" value={lname} onChange={onChangeForm} />
                                    </InputGroup>
                                    <div className='text-center'>
                                        <Button variant='dark' className='me-3 title' type="submit">등록</Button>
                                        <Button variant='secondary' className='me-3 title'>취소</Button>
                                    </div>
                                </form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default InsertPage