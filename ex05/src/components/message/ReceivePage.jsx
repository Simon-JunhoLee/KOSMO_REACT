import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReceivePage = () => {
    const uid = sessionStorage.getItem('uid');
    const [list, setList] = useState([]);
    const [chk, setChk] = useState(0);
    const navigate = useNavigate();

    const onRowClick = (mid) => {
        navigate(`/message/receive/${mid}`); 
    };

    const onChangeAll = (e) => {
        const data = list.map(msg=>msg && {...msg, checked:e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, mid) => {
        setList(list.map(msg => msg.mid === mid ? {...msg, checked:e.target.checked} : msg));
    }

    const onDelete = () => {
        if(chk === 0){
            Swal.fire({
                title: "삭제할 메시지를 선택하세요!",
                text: "",
                icon: "error"
            }).then(() => {
                return;
            });
        }
        let cnt = 0;
        list.forEach(async(msg) => {
            if(msg.checked){
                await axios.post(`/message/receive/delete/${msg.mid}`);
                cnt++;
            }
            if(chk === cnt) {
                callAPI();
            }
        });
    }

    useEffect(()=>{
        let cnt=0;
        list.map(msg => msg.checked && cnt++);
        setChk(cnt);
    }, [list])

    const callAPI = async() => {
        const res = await axios.get(`/message/receive.json/${uid}`);
        const data = res.data.map(msg=>msg && {...msg, checked:false});
        // console.log(res.data);
        setList(data);
    }

    useEffect(() => {
        callAPI();
    }, [])

    return (
        <div >
            <h1 className='text-center my-5'>받은 메시지</h1>
            <div className='mb-3'>
                <Button variant='dark' onClick={onDelete}>선택 삭제</Button>
            </div>
            <Table>
                <colgroup>
                    <col width="5%" />
                    <col width="20%" />
                    <col width="35%" />
                    <col width="20%" />
                    <col width="20%" />
                </colgroup>
                <thead>
                    <tr>
                        <td>
                            <input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={list.length > 0 && chk === list.length}/>
                        </td>
                        <td>보낸이</td>
                        <td>내용</td>
                        <td>발신일</td>
                        <td>수신일</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(msg=>
                        <tr key={msg.mid} >
                            <td>
                                <input type="checkbox" className='form-check-input' checked={msg.checked} onChange={(e) => onChangeSingle(e, msg.mid)}/>
                             </td>
                            <td>{msg.uname}({msg.sender})</td>
                            <td>
                                <div className='ellipsis' style={{ fontWeight: msg.readDate ? 'normal' : 'bold', cursor: 'pointer', whiteSpace:'pre-wrap'}} onClick={() => onRowClick(msg.mid)}>
                                    [{msg.mid}] {msg.message}
                                </div>
                            </td>
                            <td>{msg.sendDate}</td>
                            <td>{msg.readDate || '안읽음'}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default ReceivePage