import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './HomePage'
import BBSRouter from './router/BBSRouter'
import UserRouter from './router/UserRouter'
import Swal from 'sweetalert2'

const MenuPage = () => {
    const uid = sessionStorage.getItem('uid');
    const uname = sessionStorage.getItem('uname');

    const onLogout = (e) => {
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
                window.location.href="/";
            }
        });
    }

    return (
        <div className='mt-3'>
            <Link to="/" className='me-3'>Home</Link>
            <Link to="/bbs/list" className='me-3'>게시판</Link>
            {uid ? 
                <> 
                    <Link to="/users/read" className='me-3'>{uname}님</Link>
                    <Link to="#" onClick={onLogout}>로그아웃</Link>
                </>
                :
                <>
                    <Link to="/users/login" className='me-3'>로그인</Link>
                </>
            }
            <hr/>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/bbs/*' element={<BBSRouter/>}/>
                <Route path='/users/*' element={<UserRouter/>}/>
            </Routes>
        </div>
    )
}

export default MenuPage