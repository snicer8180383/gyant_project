const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Conditions = require('./models/condition.model');
const Cases = require('./models/cases.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const port = 1337;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://root:Va1kJHGebdp6BMta@gyantproject.ipbks.mongodb.net/gyant?retryWrites=true&w=majority');

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	});

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	);

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				id: user._id,
				name: user.name,
				email: user.email,
			},
			'secret123'
		);

		return res.json({ status: 'ok', user: token });
	} else {
		return res.json({ status: 'error', user: false });
	}
})

app.get('/api/getConditions', async (req, res) =>{
    Conditions.find({}, function(err, condition) {
        var conditionMap = {};
    
        condition.forEach(function(cond) {
          conditionMap[cond._id] = cond;
        });
    
        res.send(conditionMap);  
      });
})

app.get('/api/getCases', async (req, res) =>{
    Cases.find({}, function(err, caseList) {
        var caseListMap = {};
    
        caseList.forEach(function(caseLine) {
            if(!caseLine.condition_id)
                caseListMap[caseLine._id] = caseLine;
        });
    
        res.send(caseListMap);  
      });
})

app.post('/api/setConditionCase', async (req, res) => {
	const token = req.headers['x-access-token'];

	try {
        const decoded = jwt.verify(token, 'secret123');
		const email = decoded.email;
        const user = await User.findOne({
            email: email,
        });
        if(user){

            await Cases.updateOne(
                { _id: req.body.case },
                { $set: { doctor_id: token, condition_id: req.body.condition, time_labeled:req.body.time } }
            )
            
            return res.json({ status: 'ok' })
        }
        return res.json({ status: 'failed' })

	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

app.listen(port, () => {
	console.log('Server started on '+port);
});