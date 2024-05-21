import React, { useState } from 'react'
import {Row, Col, Button} from 'react-bootstrap'

const Message = () => {
    // RAFCE = React Arrow Function Component Export
    const [message, setMessage] = useState('');
    const [color, setColor] = useState('black');
    return (
        // <>빈태그 => 묶어서 return하기 위해서(무조건 하나로 묶어서 return)
        <>
            <Row className='my-5'>
                <Col>
                    <h1 style={{color:color}}>{message}</h1>
                    <Button variant='outline-secondary' onClick={()=>setMessage('어서오세요, 환영합니다!')} className='mx-3'>입장</Button>
                    <Button variant='outline-dark' onClick={()=>setMessage('감사합니다, 안녕히가세요.')}>퇴장</Button>
                    <br />
                    <Button className='m-3' variant='danger' onClick={()=>setColor('red')}>빨강</Button>
                    <Button className='m-3' variant='info' onClick={()=>setColor('blue')}>파랑</Button>
                    <Button className='m-3' variant='success' onClick={()=>setColor('green')}>초록</Button>
                    <Button className='m-3' variant='dark' onClick={()=>setColor('black')}>검정</Button>
                </Col>
            </Row>
        </>
    );
}

export default Message