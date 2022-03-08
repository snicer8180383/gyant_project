const mongoose = require('mongoose');

const Cases = new mongoose.Schema(
	{
		doctor_id: { type: String },
		label: { type: String, required: true },
		time_labeled: { type: Date },
		condition_id: { type: String },
	},
	{ collection: 'cases' }
);

const model = mongoose.model('Cases', Cases);

module.exports = model;