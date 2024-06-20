import React, { useContext, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { BoxContext } from '../../context/BoxContext';
import '../../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InsertPage = () => {
    const { setBox } = useContext(BoxContext);
    const [form, setForm] = useState({
        sname: '',
        dept: '전산'
    });
    const navi = useNavigate();

    const {dept, sname} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if (sname == '') {
            setBox({ 
                show: true, 
                message: '학생이름을 입력하세요!',
            });
            return;
        }
        await axios.post('/stu/insert', form);
        setBox({
            show: true,
            message:`${sname} 학생 등록이 완료되었습니다! \n 학생목록으로 이동하시겠습니까?`,
            action: () => navi('/stu')
        });
    }

    return (
        <Row className='justify-content-center my-5 student'>
            <Col xs={8} md={6} lg={5}>
                <Card>
                    <Card.Header>
                        <h3 className="text-center mt-2">학생등록</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text className="title justify-content-center">학과</InputGroup.Text>
                                <Form.Select name='dept'value={dept} onChange={onChangeForm}>
                                    <option value="전산">컴퓨터공학과</option>
                                    <option value="전자">전기공학과</option>
                                    <option value="건축">건축학과</option>
                                </Form.Select>
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text className="title justify-content-center">이름</InputGroup.Text>
                                <Form.Control name="sname" value={sname} onChange={onChangeForm} />
                            </InputGroup>
                            <Button variant='dark' className='w-100' type="submit">등록</Button>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default InsertPage