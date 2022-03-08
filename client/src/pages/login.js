import React, { useEffect, useState } from "react";
import {Row, Col, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
  const navigate = useNavigate();

	async function loginUser(event) {
		event.preventDefault();

		const response = await fetch('http://localhost:1337/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		const data = await response.json();

		if (data.user) {
			localStorage.setItem('token', data.user);
      setShow(true);
			window.location.href = '/diagnose';
		} else {
			alert('Please check your username and password');
		}
	}
  return (
    <Row>
      <Col></Col>
      <Col>
        <h3 className="title">Login</h3>
        <Form onSubmit={loginUser}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  )
};

export default Login;