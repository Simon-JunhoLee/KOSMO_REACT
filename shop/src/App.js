import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import TopPage from './components/TopPage';
import BottomPage from './components/BottomPage';
import MenuPage from './components/MenuPage';


function App() {
  return (
    <div className="App">
        <Container>
            <TopPage/>
            <MenuPage/>
            <BottomPage/>
        </Container>
    </div>
  );
}

export default App;
