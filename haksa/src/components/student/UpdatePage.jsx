import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxContext } from '../../context/BoxContext';

const UpdatePage = () => {
    const {setBox} = useContext(BoxContext);
    const { scode } = useParams();
    const [form, setForm] = useState({
        sname:'',
        dept:'',
        birthday:'2005-01-01',
        advisor:''
    });
    const {sname, dept, birthday, advisor, year, pname} = form;
    const [list, setList] = useState([]);
    const [student, setStudent] = useState({
        sname:'',
        dept:'',
        birthday:'2005-01-01',
        advisor:''
    });
    const navigate = useNavigate('');

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickCancel = (e) => {
        e.preventDefault();
        if(JSON.stringify(student) === JSON.stringify(form)){
            return;
        }
        setBox({
            show : true,
            message : '정말로 취소하시겠습니까?',
            action : setForm(student)
        });
    }

    const onClickUpdate = (e) => {
        e.preventDefault();
        if(JSON.stringify(student) === JSON.stringify(form)){
            return;
        }
        setBox({
            show : true,
            message : '변경된 정보를 수정하시겠습니까?',
            action : async() => {
                await axios.post('/stu/update', form)
                navigate(`/stu/read/${scode}`);
            }
        });
    }

    const callAPI = async () => {
        const res = await axios.get(`/stu/${scode}`);
        // console.log(res.data);
        setForm(res.data);
        setStudent(res.data);

        const res1 = await axios.get(`/pro?page=1&size=100&word=${res.data.dept}`);
        // console.log(res1.data);
        setList(res1.data.list);
    }

    useEffect(() => {
        callAPI();
    }, []);

    useEffect(() => {
        if (!advisor && list.length > 0) {
            setForm({ ...form, advisor : list[0].pcode });
        }
    }, [list]);

    return (
        <div className='student'>
            <Row className="justify-content-center">
                <Col className="col-xl-10 col-lg-12 col-md-9">
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="text-gray-900 mb-4">학생정보 수정</h1>
                                        </div>
                                        <form onSubmit={onClickUpdate}>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Text className="title justify-content-center">이름</InputGroup.Text>
                                                <Form.Control name='sname' value={sname || ''} onChange={onChangeForm}/>
                                            </InputGroup>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Text className="title justify-content-center">학번</InputGroup.Text>
                                                <Form.Control name='scode' value={scode || ''} readOnly/>
                                            </InputGroup>
                                            <InputGroup className='mb-2'>
                                                <InputGroup.Text className="title justify-content-center">학과</InputGroup.Text>
                                                <Form.Control name='dept' value={dept || ''} readOnly/>
                                            </InputGroup>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Text className="title justify-content-center">학년</InputGroup.Text>
                                                <Form.Control name='year' value={year || ''} onChange={onChangeForm}/>
                                            </InputGroup>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Text className="title justify-content-center">지도교수</InputGroup.Text>
                                                <Form.Select name='advisor' value={advisor || ''} onChange={onChangeForm}>
                                                    {list.map(pro=>
                                                        <option value={pro.pcode} key={pro.pcode}>{pro.pname}({pro.dept})</option>
                                                    )}
                                                </Form.Select>
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroup.Text className="title justify-content-center">생년월일</InputGroup.Text>
                                                <Form.Control name='birthday' type='date' value={birthday || '2005-01-01'} onChange={onChangeForm}/>
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