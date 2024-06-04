import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalOrder = ({pid, order}) => {
    const [books, setBooks] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const callAPI = async() => {
        const res = await axios.get(`/orders/books?pid=${pid}`);
        // console.log(res.data);
        setBooks(res.data);
    }

    useEffect(() => {
        callAPI();
    }, [])

    return (
        <>
            <Button variant="dark" size='sm' onClick={handleShow}>
                주문상품
            </Button>

            <Modal
                show={show} size='lg'
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>주문 상품</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-2'>주문번호 : {pid}</div>
                    <div className='mb-3'>배송지주소 : {order.address1} {order.address2}</div>
                    <Table hover>
                        <colgroup>
                            <col width="15%" />
                            <col width="45%" />
                            <col width="15%" />
                            <col width="10%" />
                            <col width="15%" />
                        </colgroup>
                        <thead className='table-dark text-center'>
                            <tr>
                                <td>ID.</td>
                                <td>도서명</td>
                                <td>가격</td>
                                <td>수량</td>
                                <td>금액</td>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book =>
                                <tr key={book.bid} className='text-center'>
                                    <td>{book.bid}</td>
                                    <td className='text-start'>
                                        <img src={book.image || 'http://via.placeholder.com/120x170'} width="30px"  className='me-3'/>
                                        {book.title || '-'}
                                    </td>
                                    <td>{book.fmtPrice || '-'}원</td>
                                    <td>{book.qnt}개</td>
                                    <td>{book.fmtSum || '-'}원</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark">확인</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalOrder