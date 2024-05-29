import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Row, Col, InputGroup, Form, Button } from 'react-bootstrap'
import Swal from 'sweetalert2';

const SearchPage = () => {
    const [chk, setChk] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [query, setQuery] = useState('리액트');
    const [total, setTotal] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(()=>{
        let count = 0;
        books.forEach(book => book.checked && count++);
        setChk(count);
    }, [books])

    const callAPI = async () => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=${size}&page=${page}`;
        const config = {
            "headers": { "Authorization": "KakaoAK 35c0aa5e699cabcb9592ef08fb07d91a" }
        }
        setLoading(true);
        const res = await axios.get(url, config);
        // console.log(res.data);
        const documents = res.data.documents;
        setBooks(documents.map(book => book && { ...book, checked: false, fmtPrice:book.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}));
        setIsEnd(res.data.meta.is_end);
        setTotal(res.data.meta.pageable_count);
        setLoading(false);
    }

    useEffect(() => {
        callAPI()
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (query === "") {
            alert("검색어를 입력하세요!");
            return;
        }
        setPage(1);
        callAPI();
    }

    const onChangeAll = (e) => {
        setBooks(books.map(book => book && { ...book, checked: e.target.checked }));
    }

    const onChangeSingle = (e, isbn) => {
        setBooks(books.map(book => book.isbn === isbn ? { ...book, checked: e.target.checked } : book));
    }

    const onInsert = async (book) => {
        Swal.fire({
            title: `"${book.title}" 도서를 등록하시겠습니까?`,
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(book);
                const data = { ...book, authors: book.authors.join(',') }
                const res = await axios.post('/books/insert', data);
                if (res.data.result === 1) {
                    Swal.fire({
                        title: "도서등록 완료",
                        text: `"${book.title}" 도서 등록`,
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "도서등록 오류",
                        text: `"${book.title}"는 이미 등록된 도서입니다.`,
                        icon: "error"
                    });
                }
            }
        });
    }

    const onInsertChecked = () => {
        if(chk === 0){
            Swal.fire({
                title: "도서저장 오류",
                text: "저장할 도서를 선택하십시오.",
                icon: "error"
            });
            return;
        }
        Swal.fire({
            title: `"${chk}"개의 도서를 저장하시겠습니까?`,
            text: "",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "black",
            cancelButtonColor: "gray",
            confirmButtonText: "Save"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 선택한 도서들을 저장
                let count = 0;
                let inserted = 0;
                books.forEach(async book=>{
                    if(book.checked){
                        const data = { ...book, authors: book.authors.join(',') }
                        const res = await axios.post('/books/insert', data);
                        count++;
                        if (res.data.result === 1) {
                            inserted++;
                            if(count === chk){
                                Swal.fire({
                                    title: "도서등록 완료",
                                    text: `${inserted} 개의 도서가 저장되었습니다.`,
                                    icon: "success"
                                });
                                setBooks(books.map(book => book && { ...book, checked: false}));
                            }
                        } else {
                            if(count === chk){
                                Swal.fire({
                                    title: "도서등록 오류",
                                    text: "선택된 도서는 이미 등록된 도서입니다.",
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

    if (loading) return <h1 className='text-center my-5'>로딩중......</h1>
    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={6} md={5} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button variant='dark'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='mt-2'>
                    검색수: {total}건
                </Col>
                <Col className='text-end'>
                    <Button variant='dark' onClick={onInsertChecked}>선택저장</Button>
                </Col>
            </Row>
            <Table hover>
                <colgroup>
                    <col width="3%" />
                    <col width="25%" />
                    <col width="5%" />
                    <col width="36%" />
                    <col width="10%" />
                    <col width="15%" />
                    <col width="6%" />
                </colgroup>
                <thead className='table-dark'>
                    <tr className='text-center'>
                        <td><input type="checkbox" className='form-check-input' onChange={onChangeAll} checked={chk === books.length}/></td>
                        <td>isbn</td>
                        <td colSpan={2}>Title</td>
                        <td>Price</td>
                        <td>Authors</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book =>
                        <tr key={book.isbn}>
                            <td className='text-center'><input type="checkbox" checked={book.checked} className='form-check-input' onChange={(e) => onChangeSingle(e, book.isbn)} /></td>
                            <td className='text-center'>{book.isbn}</td>
                            <td><img src={book.thumbnail || 'http://via.placeholder.com/120x170'} width="40px" /></td>
                            <td className='text-truncate'>{book.title}</td>
                            <td className='text-center'>{book.fmtPrice}원</td>
                            <td className='text-center'>{book.authors.join(',')}</td>
                            <td className='text-center'><Button variant='dark' size='sm' onClick={() => onInsert(book)}>등록</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant='dark'>이전</Button>
                <span className='mx-3'>{page}</span>
                <Button onClick={() => setPage(page + 1)} disabled={isEnd} variant='dark'>다음</Button>
            </div>
        </div>
    )
}

export default SearchPage