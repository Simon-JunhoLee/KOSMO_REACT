import React, { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';

const Posts = () => {
    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);
    const [posts, setPosts] = useState([]);
    const callAPI = () => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => {
            // console.log(json)
            const start = (page-1) * 10 + 1;
            const end = (page*10);
            setLast(Math.ceil(json.length/10));
            const data = json.filter(j => j.id >= start && j.id <= end);
            setPosts(data);
        });
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    return (
        <div className='my-5'>
            <h1>게시글목록</h1>
            <Table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(p=>
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.title}</td>
                        </tr>
                    )}

                </tbody>
            </Table>
                    <div className='mt-3'>
                        <Button variant='dark' size='sm' onClick={()=>setPage(page-1)} disabled={page===1}>이전</Button>
                        <span className='mx-3'>{page}</span>
                        <Button variant='dark' size='sm' onClick={()=>setPage(page+1)} disabled={page===last}>다음</Button>
                    </div>
        </div>
    )
}

export default Posts