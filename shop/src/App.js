import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import TopPage from './components/TopPage';
import BottomPage from './components/BottomPage';
import MenuPage from './components/MenuPage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CountContext } from './components/CountContext';


function App() {
    const uid = sessionStorage.getItem('uid');
    const [count, setCount] = useState(0);
    const CallAPICount = async () => {
        const res = await axios.get(`/cart/list?uid=${uid}`)
        setCount(res.data.length);
    }

    useEffect(()=>{
        CallAPICount();
    }, [])

    return (
        <CountContext.Provider value={{count, setCount}}>
            <Container>
                <TopPage />
                <MenuPage />
                <BottomPage />
            </Container>
        </CountContext.Provider>
    );
}

export default App;
