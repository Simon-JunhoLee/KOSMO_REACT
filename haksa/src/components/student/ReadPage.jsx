import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'
import EnrollList from './EnrollList';
import { FaUser } from "react-icons/fa6";
import { BoxContext } from '../../context/BoxContext';
import { app } from '../../firebaseInit';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const ReadPage = () => {
    const { scode } = useParams();
    const [student, setStudent] = useState('');
    const { sname, dept, birthday, advisor, pname, year } = student;
    const [list, setList] = useState([]);
    const [file, setFile] = useState({
        fileBytes : null,
        fileName : ''
    });
    const {fileBytes, fileName} = file;
    const refFile = useRef(null);
    const {setBox} = useContext(BoxContext);
    const storage = getStorage(app);

    const style = {
        color:'gray',
        fontSize:'3rem',
        cursor: 'pointer',
        borderRadius:'50%',
        width: '100px',
        height: '100px'
    }

    const onChangeFile = (e) => {
        setFile({
            fileBytes: e.target.files[0],
            fileName: URL.createObjectURL(e.target.files[0])
        });
    }

    const onUploadPhoto = async() => {
        if(!fileBytes) {
            setBox({
                show: true,
                message: '업로드할 이미지를 선택하세요!'
            });
            return;
        }
        // 사진업로드
        const snapshot = await uploadBytes(ref(storage, `/photo/${scode}/${Date.now()}.jpg`), fileBytes);
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);
        setBox({
            show: true,
            message: '저장완료'
        });
        await axios.post('/stu/update/photo', {scode, photo:url});
        callAPI();
    }

    const callAPI = async () => {
        const res = await axios.get(`/stu/${scode}`);
        // console.log(res.data);
        setStudent(res.data);
        setFile({fileBytes:null, fileName:res.data.photo});
    }

    const callCourses = async() => {
        const res1 = await axios.get(`/enroll/scode/${scode}`);
        setList(res1.data);
    }

    useEffect(() => {
        callAPI();
        callCourses();
    }, []);

    return (
        <div>
            <h1 className='text-center my-5'>학생정보</h1>
            <div className='text-end pb-3 px-5'>
                <a href={`/stu/update/${scode}`}><Button variant='dark' size='sm' className='px-3'>정보수정</Button></a>
            </div>
            <div className='px-5 text-center'>
                <Table bordered>
                    <tbody>
                        <tr className='text-center'>
                            <td rowSpan={2} className='text-center align-middle'>
                                {!fileName && <FaUser style={style} onClick={() => refFile.current.click()}/>}
                                {fileName && <img src={fileName} onClick={() => refFile.current.click()} style={style}/>}
                                <input type="file" ref={refFile} style={{display:'none'}} onChange={onChangeFile}/>
                                <div className='mt-2'>
                                    <Link to='#' onClick={onUploadPhoto}>
                                        <Button variant='dark' size='sm'>이미지 저장</Button>
                                    </Link>
                                </div>
                            </td>
                            <td className='text-center table-dark title'>학번</td>
                            <td>{scode}</td>
                            <td className='text-center table-dark title'>성명</td>
                            <td>{sname}</td>
                            <td className='text-center table-dark title'>학과</td>
                            <td className='title'>{dept ? `${dept}` : '-'}</td>
                        </tr>
                        <tr className='text-center'>
                            <td className='text-center table-dark title'>지도교수</td>
                            <td>{advisor ? `${pname}(${advisor})` : '-'}</td>
                            <td className='text-center table-dark title'>학년</td>
                            <td>{year ? `${year}` : '-'}</td>
                            <td className='text-center table-dark title'>생년월일</td>
                            <td>{birthday ? `${birthday}` : '-'}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            {list.length > 0 ? 
            <EnrollList list={list} scode={scode} callCourses={callCourses}/>
            :
            <div></div>
            }
        </div>
    )
}

export default ReadPage