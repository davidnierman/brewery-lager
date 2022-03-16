// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

//import brewery model for populate
const Brewery = require('./brewery')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const beerSchema = new Schema(
	{
		name: { type: String, required: true },
		type: { type: String, required: true },
		tasting_notes: { type: String, required: true },
		date_tasted: { type: mongoose.Mixed, required: true },
        brewery: { 
            type: Schema.Types.ObjectID,
            ref:'Brewery'
        },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Beer = model('Beer', beerSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Beer
