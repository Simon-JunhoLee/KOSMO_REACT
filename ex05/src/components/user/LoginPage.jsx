import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';

const LoginPage = () => {

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
        const res = await axios.get(`/users/${uid}`);
        console.log(res.data);
        if(!res.data){
            Swal.fire({
                title: "로그인 에러",
                text: "아이디가 존재하지 않습니다!",
                icon: "error"
            });
            return;
        }else if(upass !== res.data.upass){
            Swal.fire({
                title: "로그인 에러",
                text: "비밀번호가 일치하지 않습니다!",
                icon: "error"
            });
            return;
        }else{
            Swal.fire({
                title: "로그인 성공",
                text: "",
                icon: "success"
            }).then(() => {
                sessionStorage.setItem('uid', res.data.uid);
                sessionStorage.setItem('uname', res.data.uname);
                sessionStorage.setItem('photo', res.data.photo);
                if(sessionStorage.getItem('target')){
                    window.location.href=sessionStorage.getItem('target');
                }else{
                    window.location.href="/";
                }
            });
        }
    }

    return (
        <Row className="d-flex align-items-center justify-content-center min-vh-100">
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
                                    <form onSubmit={onSubmit}>
                                        <Form.Group className="mb-2">
                                            <Form.Control name="uid" value={uid} onChange={onChangeForm} placeholder="ID" />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Control type="password" name="upass" value={upass} onChange={onChangeForm} placeholder="Password" />
                                        </Form.Group>
                                        <Button className="btn btn-dark w-100" type="submit">Login</Button>
                                        <hr />
                                    </form>
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