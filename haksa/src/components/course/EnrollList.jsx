import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap';
import { BoxContext } from '../../context/BoxContext';

const EnrollList = ({ lcode }) => {
    const [list, setList] = useState([]);
    const {setBox} = useContext(BoxContext);
    const [chk, setChk] = useState(0);

    

    const onChangeAll = (e) => {
        const data = list.map(stu => stu && { ...stu, checked: e.target.checked })
        setList(data);
    }

    const onChangeSingle = (e, scode) => {
        setList(list.map(stu => stu.scode === scode ? { ...stu, checked: e.target.checked } : stu));
    }

    useEffect(() => {
        let cnt = 0;
        list.map(stu => stu.checked && cnt++);
        setChk(cnt);
    }, [list]);

    const onCheckedUpdate = () => {
        if(chk === 0) {
            setBox({
                show: true,
                message: '수정할 학생을 선택하세요!'
            });
            return;
        }
        const updated = list.filter(stu => stu.checked && stu.grade !== stu.num);

        if (updated.length === 0) {
            setBox({
                show: true,
                message: '수정할 성적이 없습니다!'
            });
            const data = list.map(stu=>stu && {...stu, checked:false});
            setList(data);
            return;
        }

        setBox({
            show: true,
            message: `${chk}개의 성적을 저장하시겠습니까?`,
            action: async() => {
                list.forEach(async stu => {
                    let cnt = 0;
                    if(stu.checked && stu.grade !== stu.num) {
                        await axios.post('/enroll/update', {lcode, scode:stu.scode, grade:stu.grade});
                        cnt++;
                    }
                    if(cnt === chk){
                        callAPI();
                    }
                });
            }
        });
    }



    const onChangeGrade = (e, scode) => {
        let grade = e.target.value.replace(/[^0-9]/g,'');
        if(grade > 100){
            grade = 100;
        }
        const data = list.map(stu => stu.scode === scode ? {...stu, grade} : stu);
        setList(data);
    }

    const onUpdateGrade = (stu) => {
        if(stu.num === stu.grade) {
            return;
        }
        setBox({
            show:true,
            message:`${stu.sname}의 점수를 수정하시겠습니까?`,
            action: async()=>{
                await axios.post('/enroll/update', {lcode, scode:stu.scode, grade:stu.grade});
                callAPI();
            }
        })
    }

    const callAPI = async () => {
        const res = await axios.get(`/enroll/lcode/${lcode}`);
        const data = res.data.map(stu => stu && {...stu, num: stu.grade, checked: false});
        setList(data);
    }

    useEffect(() => {
        callAPI();
    }, [])


    return (
        <div className='px-5 text-center'>
            <h1 className='text-center my-5'>수강신청현황</h1>
            <div className='text-start mb-2'>
                <Button variant='dark' onClick={onCheckedUpdate}>선택수정</Button>
            </div>
            <Table>
                <thead className='table-dark'>
                    <tr>
                        <td>
                            <input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={list.length === chk}/>
                        </td>
                        <td>학번</td>
                        <td>학생명</td>
                        <td>학과</td>
                        <td>학년</td>
                        <td>지도교수</td>
                        <td>수강신청일</td>
                        <td>점수</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(stu =>
                        <tr key={stu.scode}>
                            <td className='text-center'>
                                <input type="checkbox" className='form-check-input' checked={stu.checked} onChange={(e)=>{onChangeSingle(e, stu.scode)}}/>
                            </td>
                            <td>{stu.scode}</td>
                            <td>{stu.sname}</td>
                            <td>{stu.dept}</td>
                            <td>{stu.year}</td>
                            <td>{stu.pname}</td>
                            <td>{stu.fmtDate}</td>
                            <td>
                                <input className='me-2' type="text" size={3} value={stu.grade} onChange={(e)=>onChangeGrade(e, stu.scode)}/>
                                <Button variant='dark' size='sm' onClick={()=>onUpdateGrade(stu)}>수정</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default EnrollList