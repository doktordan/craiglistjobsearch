'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Book Name',
		trim: true
	},
	author: {
		type: String,
		default: '',
		required: 'Please fill Book Author',
		trim: true
	},
	price: {
		type: String,
		default: '',
		required: 'Please fill Book Price',
		trim: true
	},
	portada:{
	    type: String,
        default: '',
        trim: true
	},
	isbn: {
		type: String,
		default: '',
		required: 'Please fill Book ISBN',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Book', BookSchema);