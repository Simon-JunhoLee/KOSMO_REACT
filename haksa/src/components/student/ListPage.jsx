import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import '../../common/Paging.css';
import Pagination from 'react-js-pagination';
import Box from '../../common/Box';
import Swal from 'sweetalert2';
import { BoxContext } from '../../context/BoxContext';
import { useNavigate } from 'react-router-dom';

const ListPage = () => {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [key, setKey] = useState('dept');
    const [word, setWord] = useState('');
    const {box, setBox} = useContext(BoxContext);
    const navigate = useNavigate();

    const onClickDelete = (scode, sname) => {
        setBox({
            show:true,
            message:`${scode}번 ${sname} 학생을 삭제하시겠습니까?`,
            action: ()=>onDelete(scode, sname)
        });
    }

    const onDelete = async(scode, sname) => {
        await axios.post(`/stu/delete`, {
            scode
        }).then(()=>{
            setPage(1);
            callAPI();
        }).catch(()=>{
            setBox({
                show : true,
                message : `${scode}번 ${sname} 학생은 삭제할 수 없습니다!`
            })
            return;
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onRowClick = (scode) => {
        navigate(`/stu/read/${scode}`); 
    };


    const callAPI = async() => {
        const url = `/stu?page=${page}&size=${size}&key=${key}&word=${word}`;
        const res = await axios.get(url);
        // console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        const last = Math.ceil(res.data.total/size);
        if(page>last){
            setPage(page-1);
        }
    }

    useEffect(() => {
        callAPI();
    }, [page])

    return (
        <div>
            <h1 className='text-center my-5'>학생목록</h1>
            <Row className='mb-3'>
                <Col className='col-5'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Col className='col-4 me-3'>
                                <Form.Select value={key} onChange={(e)=>setKey(e.target.value)}>
                                    <option value="scode">학번</option>
                                    <option value="sname">이름</option>
                                    <option value="pname">지도교수</option>
                                    <option value="dept">학과</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Form.Control placeholder='검색어' value={word} onChange={(e)=>setWord(e.target.value)}/>
                                    <Button variant='dark' type='submit'>검색</Button>
                                </InputGroup>
                            </Col>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-start mt-2'>
                    검색수 : {total}건
                </Col>
                <Col className='text-end pt-2'>
                    <a href='/stu/insert'><Button variant='dark' size='sm' className='pt-2'>학생등록</Button></a>
                </Col>
            </Row>
            <Table className='text-center'>
            <colgroup>
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="15%" />
                <col width="15%" />
                <col width="20%" />
                <col width="10%" />
            </colgroup>
                <thead className='table-dark'>
                    <tr>
                        <td>학번</td>
                        <td>이름</td>
                        <td>학년</td>
                        <td>학과</td>
                        <td>지도교수</td>
                        <td>생년월일</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(stu=>
                        <tr key={stu.scode}>
                            <td onClick={()=>onRowClick(stu.scode)} style={{cursor : 'pointer'}}>
                                {stu.scode}
                            </td>
                            <td onClick={()=>onRowClick(stu.scode)} style={{cursor : 'pointer'}}>
                                {stu.sname}
                            </td>
                            <td>{stu.year}학년</td>
                            <td>{stu.dept}</td>
                            {stu.pcode ?
                            <td>{stu.pname}({stu.advisor})</td>
                            :
                            <td>-</td>
                            }
                            {stu.birthday ?
                            <td>{stu.birthday}</td>
                            :
                            <td>-</td>
                            }
                            <td><Button variant='outline-dark' size='sm' onClick={()=>onClickDelete(stu.scode, stu.sname)}>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
            <Pagination
                activePage={page}
                itemsCountPerPage={size}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e) => setPage(e)} />
            }
        </div>
    )
}

export default ListPage