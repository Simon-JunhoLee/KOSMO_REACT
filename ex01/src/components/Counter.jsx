import React, { useState } from 'react'
import { Button, Card, CardHeader } from 'react-bootstrap'

const Counter = () => {
    const [count, setCount] = useState(100);
    const style = {
        fontSize:'25px',
        color:'seagreen'
    }
    const onClickInc = () => {
        setCount(count+1);
    }
    const onClickDec = () => {
        setCount(count-1);
    }
    return (
        <Card className='m-3'>
            <Card.Header>
                <h1>카운터</h1>
            </Card.Header>
            <Card.Body>
                <Button variant='outline-secondary' onClick={()=>setCount(count-2)} className='mx-2'>-2</Button>
                <Button variant='outline-secondary' onClick={onClickDec}>-1</Button>
                <span className='mx-3' style={style}>{count}</span>
                <Button variant='outline-dark' onClick={onClickInc} className='mx-2'>+1</Button>
                <Button variant='outline-dark' onClick={()=>setCount(count+2)}>+2</Button>
            </Card.Body>
        </Card>
    )
}

export default Counter