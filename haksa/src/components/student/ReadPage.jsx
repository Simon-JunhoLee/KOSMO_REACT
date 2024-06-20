import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom'

const ReadPage = () => {
    const { scode } = useParams();
    const [student, setStudent] = useState('');
    const {sname, dept, birthday, advisor, pname, year} = student;

    const callAPI = async() => {
        const res = await axios.get(`/stu/${scode}`);
        // console.log(res.data);
        setStudent(res.data);
    }

    useEffect(()=>{
        callAPI();
    }, []);

    return (
        <div>
            <h1 className='text-center my-5'>학생정보</h1>
            <div className='text-end pb-3 px-5'>
                <a href={`/stu/update/${scode}`}><Button variant='dark' size='sm' className='px-3'>정보수정</Button></a>
            </div>
            <div className='px-5 text-center'>
                <Table hover bordered>
                    <tbody>
                        <tr>
                            <td>학번</td>
                            <td>{scode}</td>
                        </tr>
                        <tr>
                            <td>성명</td>
                            <td>{sname}</td>
                        </tr>
                        <tr>
                            <td>지도교수</td>
                            <td>[{advisor}] {pname}</td>
                        </tr>
                        <tr>
                            <td>학과</td>
                            <td>{dept}</td>
                        </tr>
                        <tr>
                            <td>학년</td>
                            <td>{year}학년</td>
                        </tr>
                        <tr>
                            <td>생년월일</td>
                            <td>{birthday}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ReadPage