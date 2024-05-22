import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import RouterPage from './RouterPage';

const Menubar = () => {
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
            <Nav>
                <Nav.Link href="#">로그인</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <RouterPage/>
    </>
  )
}

export default Menubar