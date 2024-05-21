import React, { useState } from 'react'
import { Table } from 'react-bootstrap';

const Students = () => {
    const [students, setStudents] = useState([
        {no:100, name:'이준호', address:'서울 은평구 수색동', phone:'010-6365-2264'},
        {no:101, name:'신준식', address:'서울 양천구 신정동', phone:'010-3436-8562'},
        {no:102, name:'이한재', address:'경기 김포 운양동', phone:'010-2451-4534'}
    ]);
    return (
        <div className='my-5'>
            <h1>학생목록</h1>
            <Table bordered hover>
                <thead>
                    <tr>
                        <td>학생번호</td>
                        <td>학생이름</td>
                        <td>학생주소</td>
                        <td>학생전화</td>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s=>
                        <tr key={s.no}>
                            <td>{s.no}</td>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>{s.phone}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Students