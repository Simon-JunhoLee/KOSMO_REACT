import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Button } from 'react-bootstrap';
import '../Paging.css';
import Pagination from 'react-js-pagination';
import Swal from 'sweetalert2';

const ListPage = () => {
    const [chk, setChk] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [books, setBooks] = useState([]);

    useEffect(()=>{
        let count = 0;
        books.forEach(book => book.checked && count++);
        setChk(count);
    }, [books])
    
    const callAPI = async() => {
        const url = `/books/list?page=${page}&size=${size}`;
        const res = await axios.get(url);
        const documents = res.data.documents;
        setBooks(documents.map(book => book && { ...book, checked: false}));
        setTotal(res.data.total);
        setBooks(documents);
        console.log(total);
    }

    useEffect(()=>{
        callAPI();
    }, [page])

    const onDelete = async(book) => {
        Swal.fire({
            title: "",
            text: `"${book.title}" 도서를 삭제하시겠습니까?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Delete"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 삭제작업
                const res = await axios.post('/books/delete', {bid:book.bid});
                if(res.data.result === 1){
                    Swal.fire({
                        title: "도서삭제 완료",
                        text: `"${book.title}" 도서가 삭제되었습니다.`,
                        icon: "success"
                    });
                    callAPI();
                }else{
                    Swal.fire({
                        title: "도서삭제 실패",
                        text: `"${book.title}" 도서는 삭제할 수 없습니다.`,
                        icon: "error"
                    });
                }
                
            }
        });
    }

    const onChangeAll = (e) => {
        setBooks(books.map(book => book && { ...book, checked: e.target.checked }));
    }

    const onChangeSingle = (e, bid) => {
        setBooks(books.map(book => book.bid === bid ? { ...book, checked: e.target.checked } : book));
    }

    const onDeleteChecked = () => {
        if(chk === 0) {
            Swal.fire({
                title: "도서삭제 오류",
                text: "삭제할 도서를 선택하십시오.",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: `"${chk}"개의 도서를 삭제하시겠습니까?`,
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 선택한 도서들을 저장
                let cnt = 0;
                let deleted = 0;
                books.forEach(async book=>{
                    if(book.checked){
                        const res = await axios.post('/books/delete', {bid:book.bid});
                        cnt++;
                        if (res.data.result === 1) {
                            deleted++;
                            if(cnt === chk){
                                Swal.fire({
                                    title: "도서삭제 완료",
                                    text: `${deleted} 개의 도서가 저장되었습니다.`,
                                    icon: "success"
                                });
                                callAPI();
                            }
                        } else {
                            if(cnt === chk){
                                Swal.fire({
                                    title: "도서삭제 오류",
                                    text: "선택된 도서는 이미 삭제된 도서입니다.",
                                    icon: "error"
                                });
                                setBooks(books.map(book => book && { ...book, checked: false }));
                            }
                        }
                    }
                })
            }
        });
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서목록</h1>
            <div className='text-start mb-3'>
                    <Button variant='dark' onClick={onDeleteChecked}>선택삭제</Button>
            </div>
            <Table hover>
                <thead className='table-dark text-center'>
                    <tr>
                        <td><input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={chk === books.length}/></td>
                        <td>ID</td>
                        <td className='text-end'>이미지</td>
                        <td>제목</td>
                        <td>가격</td>
                        <td>저자</td>
                        <td>등록일</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book=>
                        <tr className='text-center'>
                            <td className='text-center'><input type="checkbox" checked={book.checked} className='form-check-input' onChange={(e) => onChangeSingle(e, book.bid)} /></td>
                            <td>{book.bid}</td>
                            <td className='text-end'><img src={book.image || 'http://via.placeholder.com/120x170'} width="40px" /></td>
                            <td className='text-truncate'>{book.title}</td>
                            <td>{book.fmtPrice}</td>
                            <td>{book.author || "-"}</td>
                            <td>{book.fmtDate}</td>
                            <td><Button variant='dark' size='sm' onClick={() => onDelete(book)}>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination
                activePage={page}
                itemsCountPerPage={size}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(e)=>setPage(e)}/>
        </div>
    )
}

export default ListPage