import axios from 'axios';
import React, { useState } from 'react'
import { InputGroup, Form, Button, Card, Col, Row } from 'react-bootstrap' 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const LoginPage = () => {
    const navi = useNavigate();

    const [form, setForm] = useState({
        uid:'',
        upass:''
    });

    const { uid, upass } = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(uid === "" || upass === ""){
            Swal.fire({
                title: "로그인 에러",
                text: "아이디 또는 비밀번호를 입력하세요!",
                icon: "warning"
              });
            return;
        }
        // 로그인체크
        const res = await axios.post("/users/login", form);
        // console.log(res.data.result);
        const result = parseInt(res.data.result);
        if(result === 0){
            Swal.fire({
                title: "로그인 에러",
                text: "아이디가 존재하지 않습니다!",
                icon: "error"
              });
        }else if(result === 2){
            Swal.fire({
                title: "로그인 에러",
                text: "비밀번호가 일치하지 않습니다!",
                icon: "error"
              });
        }else if(result === 1){
            sessionStorage.setItem('uid', uid);
            navi('/');
        }
    }

    return (
        <Row className="justify-content-center">
            <Col className="col-xl-10 col-lg-12 col-md-9">
                <Card className="o-hidden border-0 shadow-lg my-5">
                <Card.Body className="p-0">
                    <Row>
                    <Col lg={6}>
                        <img src="/images/login.jpg" width="100%" alt="Login" />
                    </Col>
                    <Col lg={6}>
                        <div className="p-5">
                        <div className="text-center">
                            <h1 className="h4 text-gray-900 mb-4">Login</h1>
                        </div>
                        <Form onSubmit={onSubmit}>
                            <Form.Group className="mb-2">
                            <Form.Control name="uid" value={uid} onChange={onChangeForm} placeholder="ID" />
                            </Form.Group>
                            <Form.Group className="mb-2">
                            <Form.Control type="password" name="upass" value={upass} onChange={onChangeForm} placeholder="Password"/>
                            </Form.Group>
                            <Button className="btn btn-dark w-100" type="submit">Login</Button>
                            <hr />
                        </Form>
                        <div className="text-center">
                            <Button href="#" className="btn btn-google btn-user btn-block me-3">
                            <i className="fab fa-google fa-fw"></i> Login with Google
                            </Button>
                            <Button href="#" className="btn btn-facebook btn-user btn-block">
                            <i className="fab fa-facebook-f fa-fw"></i> Login with Facebook
                            </Button>
                        </div>
                        <hr />
                        <div className="text-center">
                            <a className="small" href="#">Forgot Password?</a>
                        </div>
                        <div className="text-center">
                            <a className="small" href="#">Create an Account!</a>
                        </div>
                        </div>
                    </Col>
                    </Row>
                </Card.Body>
                </Card>
            </Col>
            </Row>
    )
}

export default LoginPage