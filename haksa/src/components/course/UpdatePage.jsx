import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import { BoxContext } from '../../context/BoxContext';

const UpdatePage = () => {
    const { lcode } = useParams();
    const [form, setForm] = useState('');
    const [course, setCourse] = useState('');
    const [list, setList] = useState([]);
    const {lname, dept, room, persons, capacity, instructor, hours} = form;
    const navigate = useNavigate();
    const {setBox} = useContext(BoxContext);

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickCancel = (e) => {
        e.preventDefault();
        if(JSON.stringify(course) === JSON.stringify(form)){
            return;
        }
        setBox({
            show : true,
            message : '정말로 취소하시겠습니까?',
            action : setForm(course)
        });
    }

    const onClickUpdate = (e) => {
        e.preventDefault();
        if(JSON.stringify(course) === JSON.stringify(form)){
            return;
        }
        setBox({
            show : true,
            message : '변경된 정보를 수정하시겠습니까?',
            action : async() => {
                await axios.post('/cou/update', form)
                navigate(`/cou/read/${lcode}`);
            }
        });
    }

    const callAPI = async() => {
        const url = `/cou/${lcode}`;
        const res = await axios.get(url);
        // console.log(res.data);
        setForm(res.data);
        setCourse(res.data);

        const url1 = `/pro?page=1&size=100&word=${res.data.dept}`;
        const res1 = await axios.get(url1);
        setList(res1.data.list);
    }

    useEffect(() => {
        callAPI();
    }, []);

    useEffect(() => {
        if (!instructor && list.length > 0) {
            setForm({ ...form, instructor : list[0].pcode });
        }
    }, [list]);

    return (
        <div className='courses'>
            <Row className="justify-content-center">
                <Col className="col-xl-10 col-lg-12 col-md-9">
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="text-gray-900 mb-4">강좌정보 수정</h1>
                                </div>
                                <form onSubmit={onClickUpdate}>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text className="title justify-content-center">강좌코드</InputGroup.Text>
                                        <Form.Control name='lcode' value={lcode || '-'} readOnly />
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text className="title justify-content-center">강좌명</InputGroup.Text>
                                        <Form.Control name='lname' value={lname || '-'} onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text className="title justify-content-center">개설학과</InputGroup.Text>
                                        <Form.Control name='dept' value={dept || '-'} readOnly />
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text className="title justify-content-center">담당교수</InputGroup.Text>
                                        <Form.Select name='instructor' value={instructor || '-'} onChange={onChangeForm}>
                                            {list.map(pro =>
                                                <option value={pro.pcode} key={pro.pcode}>{pro.pname}({pro.dept})</option>
                                            )}
                                        </Form.Select>
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text className="title justify-content-center">강의실</InputGroup.Text>
                                        <Form.Control name='room' value={room || '-'} onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Text className="title justify-content-center">강의시수</InputGroup.Text>
                                        <Form.Control name='hours' value={hours || '-'} onChange={onChangeForm} />
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <InputGroup.Text className="title justify-content-center">최대인원</InputGroup.Text>
                                        <Form.Control name='capacity' value={capacity || '-'} onChange={onChangeForm} />
                                    </InputGroup>
                                    
                                    <div className='text-center'>
                                        <Button className="btn btn-dark title me-3" type="submit">정보 수정</Button>
                                        <Button className="btn btn-secondary title" onClick={onClickCancel}>취소</Button>
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

export default UpdatePage