import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BiErrorCircle } from "react-icons/bi";
import { VscError } from "react-icons/vsc";

const Box = ({box, setBox}) => {
    const onClose = () => {
        setBox({...box, show:false});
    }

    const onAction = () => {
        box.action();
        onClose();
    }

    const style = {
        color:'orange',
        fontSize:'5rem'
    }

    const style1 = {
        color:'red',
        fontSize:'5rem'
    }

    return (
        <>
            <Modal
                show={box.show}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
                centered
                className='modal'
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {box.action ? '질의' : '경고'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    {box.action ?
                    <div className='my-3'>
                        <BiErrorCircle style={style}/>
                    </div>
                    :
                    <div className='my-3'>
                        <VscError style={style1}/>
                    </div>
                    }
                    <h4>{box.message}</h4>
                </Modal.Body>
                <Modal.Footer>
                    {box.action ? 
                    <>
                    <Button variant="outline-dark" className='btn' size='sm' onClick={onAction}>예</Button>
                    <Button variant="outline-secondary" className='btn' size='sm' onClick={onClose}>
                        아니오
                    </Button>
                    </>
                    :
                    <Button variant="outline-dark" className='btn' size='sm' onClick={onClose}>확인</Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Box