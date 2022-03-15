///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Brewery = require('./brewery')
const Beer = require('./beer')

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

    const startBeers = [
        {
            name: "API - IPA",
            type: 'IPA',
            tasting_notes: 'Floral & Fruity',
            date_tasted: 2021-05-11,
            brewery: '6230b2f70de00174128e9ef2',
            owner: '6230b2bbf282d7be5a4bcc74' // test user 'd'
        },
        {
            name: "HAZY - Typer",
            type: 'Hazy',
            tasting_notes: 'Fruity!',
            date_tasted: 2022-02-02,
            brewery: '6230b2f70de00174128e9ef2',
            owner: '6230b2bbf282d7be5a4bcc74' // test user 'd'
        },
        {
            name: "Oh to the milk stout",
            type: 'Milk Stout',
            tasting_notes: 'Sweet and malty',
            date_tasted: 2019-04-04,
            brewery: '6230b2f70de00174128e9ef3',
            owner: '6230b2bbf282d7be5a4bcc74' // test user 'd'
        },
        {
            name: "Don't Be Sour",
            type: 'Sout',
            tasting_notes: 'Tart Rasberry',
            date_tasted: 2020-03-08,
            brewery: '6230b2f70de00174128e9ef4',
            owner: '6230b2bbf282d7be5a4bcc74' // test user 'd'
        }
    ]

	// delete all the data that already exists(will only happen if data exists)
	Brewery.remove({})
        .then(deletedBreweries => {
		    console.log('this is what remove returns', deletedBreweries)
		    // then we create with our seed data
            Brewery.create(startBreweries)
                .then((data) => {
                    console.log('Here are the new seed brewweries', data)
                    //db.close()
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

	// delete all the data that already exists(will only happen if data exists)
	Beer.remove({})
        .then(deletedBeers => {
		    console.log('this is what remove returns', deletedBeers)
		    // then we create with our seed data
            Beer.create(startBeers)
                .then((data) => {
                    console.log('Here are the new seed beers', data)
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
})





// then we can send if we want to see that data