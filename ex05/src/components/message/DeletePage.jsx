import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const DeletePage = () => {
    const uid = sessionStorage.getItem('uid');
    const [list, setList] = useState([]);
    const [chk, setChk] = useState(0);

    const onChangeAll = (e) => {
        const data = list.map(msg=>msg && {...msg, checked:e.target.checked});
        setList(data);
    }

    const onChangeSingle = (e, mid) => {
        setList(list.map(msg => msg.mid === mid ? {...msg, checked:e.target.checked} : msg));
    }

    useEffect(()=>{
        let cnt=0;
        list.map(msg => msg.checked && cnt++);
        setChk(cnt);
    }, [list]);

    const callAPI = async() => {
        const res = await axios.get(`/message/delete/list/${uid}`);
        const data = res.data.map(msg=>msg && {
                                                ...msg, 
                                                checked:false, 
                                                type:uid===msg.sender ? 'send':'receive', 
                                                senderName: msg.senderName, 
                                                receiverName: msg.receiverName});
        console.log(data);
        setList(data);
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onReset = async() => {
        if(chk === 0) {
            Swal.fire({
                title: "복원할 메시지를 선택하세요!",
                text: "",
                icon: "error"
            }).then(() => {
                return;
            });
        }
        let cnt = 0;
        list.map(async msg => {
            if(msg.checked){
                await axios.post(`/message/reset/delete/${msg.mid}?type=${msg.type}`);
                cnt++;
            }
            if(cnt === chk){
                callAPI();
            }
        });
    }

    return (
        <div>
            <h1 className='text-center my-5'>휴지통</h1>
            <div className='mb-2'>
                <Button variant='outline-dark' className='me-2'>완전삭제</Button>
                <Button variant='outline-dark' className='px-4' onClick={onReset}>복원</Button>
            </div>
            <Table>
                <colgroup>
                    <col width="5%" />
                    <col width="20%" />
                    <col width="55%" />
                    <col width="20%" />
                </colgroup>
                <thead className='table-dark'>
                    <tr>
                        <td>
                            <input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={list.length > 0 && chk === list.length}/>
                        </td>
                        <td>구분</td>
                        <td>내용</td>
                        <td>날짜</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(msg => 
                        <tr key={msg.mid}>
                            <td>
                                <input type="checkbox" className='form-check-input' checked={msg.checked} onChange={(e) => onChangeSingle(e, msg.mid)}/>
                             </td>
                            <td>
                                {msg.sendDelete === 1 ? `To : ${msg.receiverName}(${msg.receiver})` : `From : ${msg.senderName}(${msg.sender})`}
                            </td>
                            <td><div className='ellipsis'>{msg.message}</div></td>
                            <td>{msg.sendDate}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default DeletePage