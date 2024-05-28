import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'

const ModalPhoto = ({uid, photo, callAPI}) => {
    const [file, setFile] = useState(photo);
    const [fileName, setFileName] = useState(null);
    const [show, setShow] = useState(false);
    const refPhoto = useRef(null);

    const handleClose = () => {
        setShow(false);
        setFileName(photo);
    }
    const handleShow = () => setShow(true);

    const style = {
        width : '150px',
        borderRadius: '50%',
        cursor:'pointer'
    }

    const style2 = {
        width : '300px',
    }

    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const onClickSave = async() => {
        if(!file){
            Swal.fire({
                title: "사진수정 에러",
                text: "변경할 이미지를 선택하세요!",
                icon: "warning"
              });
              return;
        }else{
            Swal.fire({
                title: "변경한 이미지를 저장하시겠습니까?",
                text: "",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Save"
              }).then(async(result) => {
                if (result.isConfirmed) {
                    // 이미지업로드
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('uid', uid);
                    const res = await axios.post('/users/photo', formData);
                    if(res.data.result == 1){
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
    }

    useEffect(() => {
        setFileName(photo);
    }, [photo])

    return (
        <>
            <img src={photo || "http://via.placeholder.com/300x300"} onClick={handleShow} style={style2}/>

            <Modal
                style={{ top: '30%' }}
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>사진변경</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <img src={fileName || "http://via.placeholder.com/150x150"} style={style} onClick={()=>refPhoto.current.click()}/>
                    <input type='file' style={{display:'none'}} onChange={onChangeFile} ref={refPhoto}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={onClickSave}>Save</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalPhoto