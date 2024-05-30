import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'


const ModalImage = ({ bid, bigImage, callAPI }) => {
    const refImage = useRef(null);
    const [bigImg, setBigImg] = useState({
        fileName: '',
        file: null
    });
    const { fileName, file } = bigImg;
    const [show, setShow] = useState(false);
    const onChangeFile = (e) => {
        setBigImg({
            fileName: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        });
    }

    const style = {
        width: '300px',
        height: '390px',
        cursor:'pointer'
    }

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
        setBigImg({
            fileName: bigImage || '',
            file: null
        });
    }

    const onClickSave = () => {
        if (file == null) {
            Swal.fire({
                title: "이미지 수정 에러",
                text: "변경할 이미지를 선택하세요!",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: "변경한 이미지를 저장하시겠습니까?",
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 이미지업로드
                const formData = new FormData();
                formData.append('file', file);
                formData.append('bid', bid);
                const res = await axios.post('/books/upload', formData);
                if(res.data.result === 1){
                    Swal.fire({
                        title: "이미지 업로드 성공!",
                        text: "",
                        icon: "success"
                      });
                    callAPI();
                    handleClose();
                }
            }
        });
    }

    return (
        <>
            <img src={bigImage || "http://via.placeholder.com/300x390"} style={style} onClick={handleShow} />

            <Modal
                style={{ top: '10%' }}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>이미지변경</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <img src={fileName || "http://via.placeholder.com/300x390"} style={style} onClick={() => refImage.current.click()} />
                    <input type='file' style={{ display: 'none' }} onChange={onChangeFile} ref={refImage} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={onClickSave}>Save</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalImage