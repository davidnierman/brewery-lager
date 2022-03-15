///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Brewery = require('./brewery')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {
	// array of starter breweries
	const startBreweries = [
        {
            open_brewery_db_id:299,
            visited: true,
            beers_tasted:[ ],
            owner: '6230b2bbf282d7be5a4bcc74' //test user 'd'
        },
        {
            open_brewery_db_id:283,
            visited: true,
            beers_tasted:[ ],
            owner: '6230b2bbf282d7be5a4bcc74' //test user 'd'
        },
        {
            open_brewery_db_id:81,
            visited: false,
            beers_tasted:[ ],
            owner: '6230b2bbf282d7be5a4bcc74' //test user 'd'
        },
        {
            open_brewery_db_id:124,
            visited: false,
            beers_tasted:[ ],
            owner: '6230b2bbf282d7be5a4bcc74' //test user 'd'
        },

	]

	// delete all the data that already exists(will only happen if data exists)
	Brewery.remove({})
        .then(deletedBreweries => {
		    console.log('this is what remove returns', deletedBreweries)
		    // then we create with our seed data
            Brewery.create(startBreweries)
                .then((data) => {
                    console.log('Here are the new seed brewweries', data)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
	    })
        .catch(error => {
            console.log(error)
            db.close()
        })
    
})	// then we can send if we want to see that data