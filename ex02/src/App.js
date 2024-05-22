import logo from './logo.svg';
import './App.css';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Bottom from './components/Bottom';
import Menubar from './components/Menubar';

const App = () => {
  return (
        <Container>
            <Header/>
            <Menubar/>
            <Bottom/>
        </Container>
    
  );
}

export default App;
