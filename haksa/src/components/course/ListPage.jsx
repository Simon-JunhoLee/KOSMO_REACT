import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import { BoxContext } from '../../context/BoxContext';
import { useNavigate } from 'react-router-dom';

const ListPage = () => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [key, setKey] = useState('lname');
    const [word, setWord] = useState('');
    const {box, setBox} = useContext(BoxContext);
    const navigate = useNavigate('');

    const onRowClick = (lcode) => {
        navigate(`/cou/read/${lcode}`); 
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    }

    const onDelete = async(lcode, lname) => {
        await axios.post(`/cou/delete`, {
            lcode
        }).then(()=>{
            setPage(1);
            callAPI();
        }).catch(()=>{
            setBox({
                show : true,
                message : `${lcode}번 ${lname} 강좌는 삭제할 수 없습니다!`
            })
            return;
        });
    }

    const onClickDelete = (lcode, lname) => {
        setBox({
            show:true,
            message:`${lcode}번 ${lname} 강좌를 삭제하시겠습니까?`,
            action: ()=>onDelete(lcode, lname)
        });
    }

    const callAPI = async () => {
        const url = `/cou?page=${page}&size=${size}&key=${key}&word=${word}`;
        const res = await axios.get(url);
        // console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        const last = Math.ceil(res.data.total/size);
        if(page > last) {
            setPage(page-1);
        }
    }

    useEffect(() => {
        callAPI();
    }, [page])

    return (
        <div>
            <h1 className='text-center my-5'>강좌목록</h1>
            <Row className='mb-3'>
                <Col className='col-5'>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Col className='col-4 me-3'>
                                <Form.Select value={key} onChange={(e) => setKey(e.target.value)}>
                                    <option value="lcode">강좌코드</option>
                                    <option value="lname">강좌명</option>
                                    <option value="pname">담당교수</option>
                                    <option value="dept">학과</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Form.Control placeholder='검색어' value={word} onChange={(e) => setWord(e.target.value)} />
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
                    <a href='/cou/insert'><Button variant='dark' size='sm' className='pt-2'>강좌등록</Button></a>
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
                        <td>강좌코드</td>
                        <td>강좌명</td>
                        <td>담당교수</td>
                        <td>강의시간</td>
                        <td>강의실</td>
                        <td>수강인원</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(cou =>
                        <tr key={cou.lcode}>
                            <td onClick={() => onRowClick(cou.lcode)} style={{ cursor: 'pointer' }}>
                                {cou.lcode}
                            </td>
                            <td onClick={() => onRowClick(cou.lcode)} style={{ cursor: 'pointer' }}>
                                {cou.lname}
                            </td>
                            {cou.instructor ?
                                <td>{cou.pname} ({cou.instructor})</td>
                            :
                                <td>-</td>
                            }
                            <td>{cou.hours > 0 ? `${cou.hours}시간` : '-'}</td>
                            {cou.room ?
                                <td>{cou.room}호</td>
                                :
                                <td>-</td>
                            }
                            <td>{cou.persons}명/{cou.capacity}명</td>
                            <td><Button variant='outline-dark' size='sm' onClick={()=>onClickDelete(cou.lcode, cou.lname)}>삭제</Button></td>
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