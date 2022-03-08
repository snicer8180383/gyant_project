import React, { useEffect, useState } from "react";
import {Container, Row, Col} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Button } from "react-bootstrap";
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';

const Diagnose = () => {
	const [data, setData] = useState('');
	const [cases, setCases] = useState('');
	const [caseID, setCaseID] = useState('');
	const [textDone, setTextDone] = useState('');
	const [conditionSelected, setConditionSelected] = useState('');
    const actualCase = [];
    const count =  0;
    const navigate = useNavigate();
    const [label, setLabel] = useState('');
    
    async function getConditions() {
		const conditions = await fetch('http://localhost:1337/api/getConditions', {
		});
		const resultConditions = await conditions.json();
        setData(resultConditions);

        const cases = await fetch('http://localhost:1337/api/getCases', {
		});
		const resultCases = await cases.json();
        setCases(resultCases);
        if(Object.keys(resultCases).length === 0){
            setTextDone("You are done");
            setLabel("");
            setCaseID("");
        }

        Object.keys(resultCases).map(key => 
            {
                if(actualCase.length === 0)
                    actualCase.push({name: key, value: resultCases[key]});
            }
        )
        if(actualCase.length !== 0){
            setLabel(actualCase[0].value.label);
            setCaseID(actualCase[0].value._id);
        }
	}

    async function setCondition() {
        const response = await fetch('http://localhost:1337/api/setConditionCase', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				condition: conditionSelected,
				case: caseID,
                time: Date().toLocaleString(),
			}),
		})
        getConditions();
		// const req = await fetch('http://localhost:1337/api/getConditions', {
		// });

		// const data = await req.json();
        // setData(data);
	}

    useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			const user = jwt.decode(token);
			if (!user) {
				localStorage.removeItem('token');
                navigate('/login');
			} else {
				getConditions()
			}
		}else{
            navigate('/login');
        }
	}, [])

    return (
        <Container>
            <Row className="diagnose">
                <Col md={7}>
                    <Row>
                        <p>Please Review This Case:</p>
                    </Row>
                    <Row>
                        <Col className="description" dangerouslySetInnerHTML={{__html: label}}>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <p>Select Condition:</p>
                    </Row>
                    <Row className="condition">
                        
                        <Form.Select className="select" htmlSize="10" value={conditionSelected} onChange={(e) => setConditionSelected(e.target.value)}>
                            {
                                Object.keys(data).map(item => (
                                        <option key={data[item]._id} value={data[item].ICD_10}>{data[item].ICD_10_Description}</option>
                                ))
                            }
                        </Form.Select>
                    </Row>
                    <Row>
                        <Col>
                            <Button className="next-btn" onClick={setCondition}>Next Case</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col><h3 className="alertDone">{textDone}</h3></Col>
            </Row>
        </Container>
    )
};

export default Diagnose;