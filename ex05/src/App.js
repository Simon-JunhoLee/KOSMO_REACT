import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import MenuPage from './components/MenuPage';

function App() {
    return (
        <div className="App">
            <Container>
                <MenuPage/>
            </Container>
        </div>
    );
}

export default App;
