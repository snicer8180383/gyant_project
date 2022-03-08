import './App.css';
import { useEffect , useState} from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {Container} from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import jwt from 'jsonwebtoken';
import Login from "./pages/login";
import Diagnose from './pages/diagnose';

function App() {
	const [show, setShow] = useState(false);
	const [name, setName] = useState('');
  function handleClick(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    setShow(false);
    window.location.href = '/';
  }

  useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (user) {
        setShow(true);
        setName(user.name);
			} 
		}
	}, [])

  return (
    <Router>
        <Container>
        <Navbar>
          <Container>
            <Link to="/">GYANT</Link>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {show ? <b><a href="#login" className='no_underline'>{name}</a> | <span onClick={handleClick} className="logout">Logout</span></b> : ''}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
          <Routes>
            <Route exact path="/" element={<Login/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/diagnose" element={<Diagnose/>} />
          </Routes>
        </Container>
      </Router>
  );
}

export default App;
