import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Counter from './components/Counter';
import Message from './components/Message';
import Students from './components/Students';
import Posts from './components/Posts';
import Todos from './components/Todos';
import {Row, Col} from 'react-bootstrap'


const App = () => {
  return (
    <div className="App">
      <Counter/>
      <Message/>
      <Students/>
        <Row>
        <Col>
            <Posts/>
        </Col>
        <Col>
            <Todos/>
        </Col>
        </Row>
    </div>
  );
}

export default App;
