'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Craiglist Schema
 */
var CraiglistSchema = new Schema({
	city: {
		type: String,
		default: '',
		required: 'Please fill Craiglist name',
		trim: true
	},
	type: {
        type: String,
        default: '',
        required: 'Please fill Craiglist type',
        trim: true
    },
    search: {
        type: String,
        default: '',
        required: 'Please fill Craiglist search',
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

mongoose.model('Craiglist', CraiglistSchema);