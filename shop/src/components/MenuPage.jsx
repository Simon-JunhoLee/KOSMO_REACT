import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import RouterPage from './RouterPage';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useEffect, useState } from 'react';

const MenuPage = () => {
    const navi = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const [user, setUser] = useState([]);

    // session에 있는 uid를 통해 back-end의 read 기능 사용
    const callAPI = async() => {
        const url = `/users/read/${uid}`;
        const res = await axios.get(url);
        setUser(res.data);
    }

    useEffect(()=>{
        if(uid) callAPI();
    }, [uid]);

    const onClickLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "로그아웃 하시겠습니까?",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Logout"
          }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                navi("/");
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
                <Nav.Link href="/books/search">도서검색</Nav.Link>
                <Nav.Link href="/books/list">도서목록</Nav.Link>
            </Nav>
            {uid ?
            <>
            <Nav>
                <Nav.Link href="/users/mypage" className='active'>{user.uname}님</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="#" onClick={onClickLogout}>로그아웃</Nav.Link>
            </Nav>
            </>
            :
            <Nav>
                <Nav.Link href="/users/login">로그인</Nav.Link>
            </Nav>
            }
            </Navbar.Collapse>
        </Container>
        </Navbar>
        <RouterPage/>
        </>
    );
}

export default MenuPage