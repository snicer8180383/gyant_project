const mongoose = require('mongoose');

const Conditions = new mongoose.Schema(
	{
		ICD_10: { type: String, required: true, unique: true },
		ICD_10_Description: { type: String, required: true },
	},
	{ collection: 'conditions' }
);

const model = mongoose.model('Conditions', Conditions);

module.exports = model;