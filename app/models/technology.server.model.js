'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Technology Schema
 */
var TechnologySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Technology name',
		trim: true
	},
    brand: {
        type: String,
        default: '',
        required: 'Please fill Brand name',
        trim: true
    },
    image: {
        type: String,
        default: '',
        //required: 'Please fill Technology name',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Please fill Technology name',
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

mongoose.model('Technology', TechnologySchema);