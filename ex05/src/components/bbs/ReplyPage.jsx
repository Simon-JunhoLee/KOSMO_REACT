import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import '../Paging.css';
import Pagination from 'react-js-pagination';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import Stars from '../common/Stars';

const ReplyPage = ({ bid }) => {
    const uid = sessionStorage.getItem('uid');
    const { pathname } = useLocation();
    const [contents, setContents] = useState('');
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [rating, setRating] = useState(0);

    const callAPI = async () => {
        const url = `/reply/list.json/${bid}?page=${page}&size=${size}`;
        const res = await axios.get(url);
        // console.log(res.data);
        const data=res.data.documents.map(doc=>doc && {...doc, isEllip:true, isEdit:false, text:doc.contents, num:doc.rating});
        setList(data);
        setTotal(res.data.total);
        setRating(0); // 별점을 0으로 초기화
    }

    useEffect(()=>{
        callAPI();
    }, [page]);

    // 비로그인 댓글 등록 버튼 클릭 시
    const onClickRegister = () => {
        sessionStorage.setItem('target', pathname + '?isViewCnt=false');
        window.location.href = '/users/login';
    }

    // 로그인 후, 댓글 등록 버튼 클릭 시
    const onClickInsert = async() => {
        if(contents === ''){
            Swal.fire({
                title: "댓글 내용을 입력하세요!",
                text: "",
                icon: "error"
            });
            return;
        }
        await axios.post('/reply/insert', {bid, contents, uid:sessionStorage.getItem('uid'), rating});
        setContents('');
        callAPI();
    }

    // 생략 댓글 상세보기
    const onClickContents = (rid) => {
        const data=list.map(reply=>reply.rid===rid ? {...reply, isEllip:!reply.isEllip}: {...reply, isEllip:true});
        setList(data);
    }

    // 댓글 삭제 버튼 클릭 시
    const onClickDelete = async(rid) => {
        Swal.fire({
            title: "",
            text: `${rid} 번 댓글을 삭제 하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then(async(result) => {
            if (result.isConfirmed) {
                await axios.post(`/reply/delete/${rid}`);
                Swal.fire({
                    title: "삭제 성공",
                    text: "",
                    icon: "success"
                }).then(() => {
                    callAPI();
                });
            }
        });
    }
    
    // 댓글 수정 버튼 클릭 시
    const onClickUpdate = (rid) => {
        const data = list.map(reply => reply.rid === rid ? {...reply, isEdit:!reply.isEdit} : {...reply, isEdit:false});
        setList(data);
    }

    // 댓글 수정칸 변경 시
    const onChangeContent = (e, rid) => {
        const data = list.map(reply=>reply.rid === rid ? {...reply, contents:e.target.value} : reply);
        setList(data);
    }

    // 댓글 수정 완료 버튼 클릭 시
    const onClickSave = (reply) => {
        if(reply.contents !== reply.text || reply.rating !== reply.num){
            Swal.fire({
                title: "",
                text: `${reply.rid}번 댓글을 수정 하시겠습니까?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Update"
            }).then(async(result) => {
                if (result.isConfirmed) {
                    await axios.post('/reply/update', {rid:reply.rid, contents:reply.contents, rating:reply.rating});
                    Swal.fire({
                        title: "수정 성공",
                        text: "",
                        icon: "success"
                    }).then(() => {
                        callAPI();
                    });
                }
            });
        }else{
            callAPI();
        }
    }

    // 수정 취소 버튼 클릭 시
    const onClickCancel = (reply) => {
        if(reply.contents !== reply.text || reply.rating !== reply.num){
            Swal.fire({
                title: "",
                text: `${reply.rid}번 댓글 수정을 취소하시겠습니까?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm"
            }).then(async(result) => {
                if (result.isConfirmed) {
                    callAPI();
                }else{
                    return;
                }
            });
        }else{
            callAPI();
        }
    }

    // 별점 가져오기
    const getRating = (rating) => {
        console.log(rating);
        setRating(rating);
    }

    const getReplyRating = (rating, rid) => {
        // console.log(rating, '.............', rid);
        const data = list.map(reply => reply.rid === rid ? {...reply, rating:rating}:reply);
        setList(data);
    }

    return (
        <div>
            <Row className='justify-content-center'>
                <Col xs={12} md={10} lg={8}>
                    {total > 0 ?
                    <Row>
                        <Col className='pt-2' xs="auto">
                            <h5>댓글 ({total})</h5>
                        </Col> 
                        <Col className='pt-1'>
                            <Row>
                                <Col xs="auto">
                                    <Stars size={25} number={rating} disabled={false} getRating={getRating}/>
                                </Col>
                                <Col className='pt-1'>
                                    <h5>({rating})</h5>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    :
                    <h5>댓글</h5>
                    }
                    {sessionStorage.getItem('uid') ?
                    <div className='mb-3'>
                        <form>
                            <Form.Control as="textarea" rows={5} value={contents} onChange={(e)=>setContents(e.target.value)}/>
                            <div className='text-end mt-2'>
                                <Button className='px-3 pt-2' variant='dark' size='sm' onClick={onClickInsert}>등록</Button>
                            </div>
                        </form>
                    </div>
                    :
                    <div className='text-end my-2'>
                        <Button className='px-3 pt-2' variant='dark' size='sm' onClick={onClickRegister}>댓글 등록</Button>
                    </div>
                    }
                    {list.map(reply=>
                        <div key={reply.rid}>
                            <Row style={{fontsize:'15px'}} className='mb-2'>
                                <Col xs={8} md={8} lg={8}>
                                    <span className='me-1'>{reply.uname}({reply.uid})</span>
                                    <Stars size={18} number={reply.rating} disabled={(!uid === reply.uid || !reply.isEdit) && true}
                                           getRating={(e)=>getReplyRating(e, reply.rid)}/> 
                                    <br/>
                                    {reply.fmtUpdateDate ?
                                        <span className='text-muted'>{reply.fmtUpdateDate} (수정)</span>
                                        :
                                        <span className='text-muted me-3'>{reply.fmtDate}</span>
                                    }
                                </Col>
                                {uid === reply.uid && !reply.isEdit &&
                                <Col className='text-end'>
                                    <Button variant='outline-dark' size='sm' className='pt-2 me-2' onClick={()=>onClickUpdate(reply.rid)}>수정</Button>
                                    <Button variant='outline-secondary' size='sm' className='pt-2' onClick={()=>onClickDelete(reply.rid)}>삭제</Button>
                                </Col>
                                }
                                {uid === reply.uid && reply.isEdit &&
                                <Col className='text-end'>
                                    <Button variant='outline-dark' size='sm' className='pt-2 me-2' onClick={()=>onClickSave(reply)}>저장</Button>
                                    <Button variant='outline-secondary' size='sm' className='pt-2' onClick={()=>onClickCancel(reply)}>취소</Button>
                                </Col>
                                }
                            </Row>
                            {reply.isEdit ? 
                            <div>
                                <Form.Control as="textarea" rows={5} value={reply.contents} onChange={(e)=>onChangeContent(e, reply.rid)}/>
                            </div>
                            :
                            <div className={reply.isEllip ? 'ellipsis' : undefined} style={{cursor:'pointer', whiteSpace:'pre-wrap'}} onClick={()=>onClickContents(reply.rid)}>
                                {reply.contents}
                            </div>
                            }
                            <hr/>
                        </div>
                    )}
                </Col>
            </Row>
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

export default ReplyPage