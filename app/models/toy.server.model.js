'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Toy Schema
 */
var ToySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Toy name',
		trim: true
	},
	barcode: {
		type: String,
		default: '',
		required: 'Please fill Toy Barcode',
		trim: true
	},
	price: {
		type: String,
		default: '',
		required: 'Please fill Toy Price',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Toy Description',
		trim: true
	},
	brand: {
		type: String,
		default: '',
		required: 'Please fill Toy Brand',
		trim: true
	},
    imgurl: {
        type: String,
        default: '',
        //required: 'Please fill Toy Brand',
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

mongoose.model('Toy', ToySchema);