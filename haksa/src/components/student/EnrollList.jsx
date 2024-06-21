import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { BoxContext } from '../../context/BoxContext';

const EnrollList = ({ list, scode, callCourses }) => {
    const [couList, setCouList] = useState([]);
    const [course, setCourse] = useState('');
    const {setBox} = useContext(BoxContext);

    const callAPI = async() => {
        const res = await axios.get('/cou?page=1&size=100');
        // console.log(res.data.list);
        setCouList(res.data.list);
    }

    const onInsert = () => {
        if(course === ''){
            setBox({
                show : true,
                message : '신청할 강좌를 선택하세요!',
            });
            return;
        }
        if(course.persons >= course.capacity){
            setBox({show:true, message:'수강 가능한 인원이 초과했습니다!'});
            return;
        }
        setBox({
            show : true,
            message : `'${course.lname}' 강좌를 수강신청하시겠습니까?`,
            action : async() => {
                const res = await axios.post('/enroll/insert', {lcode:course.lcode, scode})
                // console.log(res.data);
                if(res.data === 0){
                    setBox({
                            show:true, 
                            message:'수강신청이 완료되었습니다!',
                            action : () => {callCourses();}
                        });
                }else{
                    setBox({
                        show:true, 
                        message:'이미 수강한 강좌입니다!'
                    });
                    return;
                }
            }
        })
    }

    const onDelete = (lcode, lname) => {
        setBox({
            show : true,
            message : `${lname} 강좌를 수강취소하시겠습니까?`,
            action : async() => {
                        axios.post('/enroll/delete', {lcode, scode});
                        callAPI();
                        callCourses();
                    }
        })
    }

    useEffect(() => {
        callAPI();
    }, [])

    return (
        <div className='px-5 text-center'>
            <h1 className='text-center my-5'>수강신청목록</h1>
            <Row className='mb-3'>
                <Col lg={10} md={8} xs={6}>
                    <Form.Select name='course' onChange={(e)=>setCourse(e.target.value ? JSON.parse(e.target.value) : '')}>
                        <option value=''>강좌를 선택하세요.</option>
                        {couList.map(cou=>
                            <option value={JSON.stringify(cou)} key={cou.lcode}>
                                [{cou.lcode}] {cou.lname} {cou.pname ? `(${cou.pname} 교수)`: ''}
                            </option>
                        )}
                    </Form.Select>
                </Col>
                <Col className='text-end'>
                    <Button variant='outline-dark px-5' onClick={onInsert}>수강신청</Button>
                </Col>
            </Row>                
            <Table>
                <thead className='table-dark'>
                    <tr>
                        <td>강좌코드</td>
                        <td>강좌명</td>
                        <td>담당교수</td>
                        <td>강의실</td>
                        <td>강의시수</td>
                        <td>점수</td>
                        <td>수강인원</td>
                        <td>수강신청일</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(cou=>
                        <tr key={cou.lcode}>
                            <td>{cou.lcode}</td>
                            <td>{cou.lname}</td>
                            <td>{cou.pname ? `${cou.pname} (${cou.instructor})` : '-'}</td>
                            <td>{cou.room ? cou.room + '호' : '-'}</td>
                            <td>{cou.hours ? `${cou.hours} 시간` : '-'}</td>
                            <td>{cou.grade}점</td>
                            <td>{cou.persons}/{cou.capacity}</td>
                            <td>{cou.edate}</td>
                            <td><Button variant='dark' size='sm' onClick={()=>onDelete(cou.lcode, cou.lname)}>수강취소</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default EnrollList