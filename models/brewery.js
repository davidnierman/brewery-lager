// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

//import beer model for populate
const Beer = require('./beer')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const brewerySchema = new Schema(
	{
		open_brewery_db_id: { type: mongoose.Mixed, required: true },
		visited: { type: Boolean, required: true },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Brewery = model('Brewery', brewerySchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Brewery

