import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom'

const ReadPage = () => {
    const { lcode } = useParams();
    const [course, setCourse] = useState('');
    const { lname, room, instructor, pname, hours, persons, capacity, dept } = course;

    const callAPI = async () => {
        const res = await axios.get(`/cou/${lcode}`);
        console.log(res.data);
        setCourse(res.data);
    }

    useEffect(() => {
        callAPI();
    }, []);

    return (
        <div>
            <h1 className='text-center my-5'>강좌정보</h1>
            <div className='text-end pb-3 px-5'>
                <a href={`/cou/update/${lcode}`}><Button variant='dark' size='sm' className='px-3'>정보수정</Button></a>
            </div>
            <div className='px-5 text-center'>
                <Table bordered className='courses'>
                    <tbody>
                        <tr className='text-center'>
                            <td className='text-center table-dark title'>강좌번호</td>
                            <td>{lcode}</td>
                            <td className='text-center table-dark title'>강좌이름</td>
                            <td>{lname}</td>
                            <td className='text-center table-dark title'>강의실</td>
                            <td className='title'>{room ? `${room}호` : '-'}</td>
                            <td className='text-center table-dark title'>강의시수</td>
                            <td>{hours ? `${hours}` : '-'}</td>
                        </tr>
                        <tr className='text-center'>
                            <td className='text-center table-dark title'>담당교수</td>
                            <td>{pname ? `${pname}(${instructor})` : '-'}</td>
                            <td className='text-center table-dark title'>개설학과</td>
                            <td>{dept}</td>
                            <td className='text-center table-dark title'>수강인원</td>
                            <td colSpan={3}>{persons}명/{capacity}명</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ReadPage