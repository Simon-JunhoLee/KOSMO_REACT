import moment, { now } from 'moment';
import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { app } from '../../firebaseInit'
import { addDoc, collection, getFirestore, orderBy, where, onSnapshot, query, deleteDoc, doc, setDoc } from 'firebase/firestore';
import '../Paging.css'
import Pagination from 'react-js-pagination';

const ListPage = ({id}) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [total, setTotal] = useState(100);
    const [comments, setComments] = useState([]);
    const db = getFirestore(app);

    const navi = useNavigate();
    const {pathname} = useLocation();
    const [content, setContent] = useState('');

    const callAPI = () => {
        const q = query(collection(db, 'comments'), where('id', '==', id), orderBy('date', 'desc'));
        onSnapshot(q, res=>{
            let rows = [];
            let count = 0;
            res.forEach(row=>{
                count++;
                rows.push({no: count,
                           cid: row.id, 
                           ...row.data(), 
                           isEllip:true, 
                           isEdit:false, 
                           text:row.data().content
                        })
            });
            // console.log(rows);
            setTotal(count);
            const start = (page-1)*size+1
            const end = (page*size);
            rows = rows.filter(row => row.no>=start && row.no<=end);
            setComments(rows);
        });
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onClickInsert = async() => {
        if(sessionStorage.getItem('email')){
            if(content === ''){
                alert('댓글내용을 입력하세요!')
                return;
            }
            // alert(content);
            const email = sessionStorage.getItem('email');
            const now = new Date();
            const date = moment(now).format('YYYY-MM-DD HH:mm:ss');
            const comment = {id, email, date, content};
            // console.log(comment);
            await addDoc(collection(db, `comments`), comment);
            alert('댓글 등록 완료');
            setContent("");
            setPage(1);
        }else{
            // console.log(pathname);
            sessionStorage.setItem('target', pathname);
            navi('/user/login');
        }
    }

    const onClickContent = (cid) => {
        const rows = comments.map(c => c.cid === cid ? {...c, isEllip:!c.isEllip} : c);
        setComments(rows);
    }

    const onClickDelete = async(cid) => {
        if(!window.confirm(`${cid}번 댓글을 삭제하시겠습니까?`)) return;
        // 삭제
        await deleteDoc(doc(db, `comments/${cid}`));
    }

    const onClickUpdate = (cid) => {
        const rows = comments.map(c => c.cid === cid ? {...c, isEdit:true} : c);
        setComments(rows);
    }

    const onClickCancel = (cid, content, text) => {
        if(content !== text){
            if(!window.confirm("취소하시겠습니까?")) return;
        }
        const rows = comments.map(c => c.cid === cid ? {...c, isEdit:false, content:text} : c);
        setComments(rows);
    }

    const onChangeContent = (e, cid) => {
        const rows = comments.map(c => c.cid === cid ? {...c, content:e.target.value} : c);
        setComments(rows);
    }

    const onClickSave = async(comment) => {
        if(comment.content === comment.text) return;
        if(!window.confirm("변경된 내용을 저장하시겠습니까?")) return;
        //저장
        console.log(comment);
        const rows = comments.map(c => c.cid === comment.cid ? {...c, isEdit:false} : c);
        setComments(rows);
        const date=moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        await setDoc(doc(db, `comments/${comment.cid}`), {...comment, edit_date:date});
    }

    return (
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                {sessionStorage.getItem('email')&& 
                <div>
                    <Form.Control as="textarea" rows={5} placeholder='댓글내용을 입력하세요.' value={content} onChange={(e) => setContent(e.target.value)}/>
                </div>
                }
                <div className='text-end my-3'>
                    <Button className='px-5' variant='outline-secondary' onClick={onClickInsert}>댓글 등록</Button>
                </div>
                <div className='comments'>
                    {comments.map(c=>
                    <div key={c.cid}>
                    <Row className='mb-2'>
                        <Col xs={8} className='text-muted' style={{fontSize:'15px'}}>
                            <span>{c.email}</span>
                            <span>{c.date}</span>
                            {c.edit_date && <span> (수정됨) {c.edit_date}</span>}
                        </Col>
                        {(c.email === sessionStorage.getItem('email')) && !c.isEdit &&
                        <Col className='text-end'>
                            <Button variant='outline-secondary' size='sm' onClick={()=>onClickUpdate(c.cid)}>수정</Button>
                            <Button variant='outline-secondary' size='sm' className='ms-2' onClick={()=>onClickDelete(c.cid)}>삭제</Button>
                        </Col>
                        }
                        {(c.email === sessionStorage.getItem('email')) && c.isEdit &&
                        <Col className='text-end'>
                            <Button variant='outline-secondary' size='sm' onClick={()=>onClickSave(c)}>저장</Button>
                            <Button variant='outline-secondary' size='sm' className='ms-2' onClick={()=>onClickCancel(c.cid, c.content, c.text)}>취소</Button>
                        </Col>
                        }
                    </Row>
                    {c.isEdit ?
                        <div>
                            <Form.Control value={c.content} as="textarea" rows={10} onChange={(e) => onChangeContent(e, c.cid)}/>
                        </div>
                        :
                        <div className={c.isEllip ? 'ellipsis2' : undefined} style={{whiteSpace:'pre-wrap', cursor:'pointer'}} onClick={()=>onClickContent(c.cid)}>{c.content}</div>
                    }
                    <hr/>
                    </div>
                    )}
                </div>
            </Col>
            <Pagination
            activePage={page}
            itemsCountPerPage={size}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={(e)=>setPage(e)}/>
        </Row>
    )
}

export default ListPage