import axios from 'axios';
import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';

const PassModal = () => {
    const [form, setForm] = useState({
        upass:'',
        npass:'',
        cpass:''
    });
    const {upass, npass, cpass} = form;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const onChangeForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const onClickSave = async() => {
        // 현재비밀번호 일치 체크
        const res = await axios.get(`/users/${sessionStorage.getItem('uid')}`);
        if(res.data.upass !== upass){
            Swal.fire({
                title: "현재 비밀번호가 일치하지 않습니다!",
                text: "",
                icon: "error"
            });
            return;
        }
        // 현재 비밀번호와 새비밀번호가 같을 시
        if(upass === npass){
            Swal.fire({
                title: "기존 비밀번호와 새밀번호와 일치합니다!",
                text: "",
                icon: "error"
            });
            return;
        }
        // 새비밀번호 다시 확인
        if(npass !== cpass){
            Swal.fire({
                title: "새비밀번호와 일치하지 않습니다!",
                text: "",
                icon: "error"
            });
            return;
        }
        // 새 비밀번호 업데이트
        Swal.fire({
            title: "비밀번호를 변경하시겠습니까?",
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Update"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.post('/users/update/pass', {uid:sessionStorage.getItem('uid'), upass:npass});
                Swal.fire({
                    title: "비밀번호 변경완료!",
                    text: "",
                    icon: "success"
                }).then(() => {
                    sessionStorage.clear();
                    window.location.href='/users/login';
                });
            }else{
                return;
            }
        });
    }

    return (
        <div className='text-end'>
            <Button className='mb-2' variant="dark" onClick={handleShow}>
                비밀번호 변경
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                className='passModal'
            >
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text className='title justify-content-center'>현재 비밀번호</InputGroup.Text>
                            <Form.Control type='password' name='upass' value={upass} onChange={onChangeForm}/>
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text className='title justify-content-center'>새비밀번호</InputGroup.Text>
                            <Form.Control type='password' name='npass' value={npass} onChange={onChangeForm}/>
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text className='title justify-content-center'>비밀번호 확인</InputGroup.Text>
                            <Form.Control type='password' name='cpass' value={cpass} onChange={onChangeForm}/>
                        </InputGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={onClickSave}>Update</Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PassModal