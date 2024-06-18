import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SendPage = () => {
    const [list, setList] = useState([]);
    const [chk, setChk] = useState(0);
    const navigate = useNavigate();

    const onRowClick = (mid) => {
        navigate(`/message/send/${mid}`); 
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
                await axios.post(`/message/send/delete/${msg.mid}`);
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
        const url = `/message/send.json/${sessionStorage.getItem('uid')}`;
        const res = await axios.get(url);
        const data = res.data.map(msg=>msg && {...msg, checked:false});
        // console.log(res.data);
        setList(data);
    }

    useEffect(()=>{
        callAPI();
    }, [])

    return (
        <div>
            <h1 className='text-center my-5'>보낸 메시지</h1>
            <div className='mb-3'>
                <Button variant='dark' onClick={onDelete}>선택 삭제</Button>
            </div>
            <Table>
                <thead>
                    <tr>
                        <td>
                            <input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={list.length > 0 && chk === list.length}/>
                        </td>
                        <td>받은이</td>
                        <td>내용</td>
                        <td>발신일</td>
                        <td>수신확인일</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(msg=>
                        <tr key={msg.mid}>
                             <td>
                                <input type="checkbox" className='form-check-input' checked={msg.checked} onChange={(e) => onChangeSingle(e, msg.mid)}/>
                             </td>
                            <td>{msg.uname}({msg.receiver})</td>
                            <td>
                                <div className='ellipsis' onClick={() => onRowClick(msg.mid)} style={{ cursor: 'pointer', whiteSpace:'pre-wrap'}}>
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

export default SendPage