import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalBook = ({ book }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {title, contents, thumbnail, publisher, authors, price} = book;

    return (
        <>
            {/* || : false와 같은 의미 */}
            <img onClick={handleShow} style={{cursor:'pointer'}} src={thumbnail || 'http://via.placeholder.com/120x170'} alt=""  width="100%"/>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>저자 : {authors}</div>
                    <div>출판사 : {publisher}</div>
                    <div>가격 : {price}원</div>
                    <hr />
                    {contents}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark">확인</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalBook