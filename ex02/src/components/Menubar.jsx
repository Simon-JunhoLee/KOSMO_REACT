import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import RouterPage from './RouterPage';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const Menubar = () => {
const navi = useNavigate();
const onLogout = (e) => {
    e.preventDefault();
    swal({
        title: "로그아웃하시겠습니까?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: false,
      })
      .then((willLogout) => {
        if (willLogout) {
          sessionStorage.clear();
          navi('/');
        } else {
          return;
        }
      });
}


  return (
    <>
        <Navbar expand="lg" className="bg-body-tertiary mb-5" bg="dark" data-bs-theme="dark">
        <Container fluid>
            <Navbar.Brand href="/"> <img src="/logo192.png" alt=""  width="30px;"/> &nbsp;KOSMO</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/book/search">도서검색</Nav.Link>
                <Nav.Link href="/local/search">지역검색</Nav.Link>
            </Nav>
            {sessionStorage.getItem('email') ? 
            <>
            <Nav>
                <Nav.Link href="#">{sessionStorage.getItem('email')}</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="#" onClick={onLogout}>로그아웃</Nav.Link>
            </Nav>
            </>
            :
            <Nav>
                <Nav.Link href="/user/login">로그인</Nav.Link>
            </Nav>
            }
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <RouterPage/>
    </>
  )
}

export default Menubar