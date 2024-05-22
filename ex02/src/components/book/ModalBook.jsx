import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const ModalBook = ({book}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {title, thumbnail, price, authors, publisher, contents, isbn} = book;

  return (
    <>
        <img src={thumbnail || 'http://via.placeholder.com/120x170'} width="100%" onClick={handleShow} alt="" />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table bordered hover className='text-center'>
                <thead>
                    <tr>
                        <th>가격</th>
                        <th>저자</th>
                        <th>출판사</th>
                        <th>isbn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{price || '-'}원</td>
                        <td>{authors || '-'}</td>
                        <td>{publisher || '-'}</td>
                        <td>{isbn || '-'}</td>
                    </tr>
                </tbody>
            </Table>
            <hr/>
            <div>{contents || '내용없음'}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark">확인</Button>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalBook