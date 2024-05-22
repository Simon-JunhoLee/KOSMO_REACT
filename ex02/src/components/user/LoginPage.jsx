import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { app } from '../../firebaseInit';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const LoginPage = () => {
    const navi = useNavigate();
    const auth = getAuth(app);

    const [form, setForm] = useState({
        email:'jun@test.com',
        pass:'12341234'
    });
    const {email, pass} = form;
    
    const onChangeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(email==='' || pass===''){
            swal("입력값 없음!", "이메일과 패스워드를 입력하세요!", "info");
            return;
        }
        // 로그인체크
        signInWithEmailAndPassword(auth, email, pass)
        .then(success=>{
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('uid', success.user.uid);
            navi('/');
        })
        .catch(err=>{
            alert('로그인 실패 : ' + err)
            swal("로그인 실패!", err, "error");
        })
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
                        <Form.Control name="email" placeholder="Email ID" value={email} onChange={onChangeForm}/>
                        </Form.Group>
                        <Form.Group className="mb-2">
                        <Form.Control type="password" name="pass" value={pass} placeholder="Password" onChange={onChangeForm}/>
                        </Form.Group>
                        <Button className="btn btn-dark w-100" type="submit">Login</Button>
                        <hr />
                    </Form>
                    <div className="text-center">
                        <Button href="#" className="btn btn-google btn-user btn-block">
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
    );
};

export default LoginPage;
