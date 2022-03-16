///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Beer = require('./beer')

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////
// save the connection in a variable
const db = mongoose.connection;

db.on('open', () => {

    const startBeers = [
        {
            name: "API - IPA",
            type: 'IPA',
            tasting_notes: 'Floral & Fruity',
            date_tasted: 2021-05-11,
            owner: '62311fc03bbab49a5a97a4d9' // test user 'd'
        },
        {
            name: "HAZY - Typer",
            type: 'Hazy',
            tasting_notes: 'Fruity!',
            date_tasted: 2022-02-02,
            owner: '62311fc03bbab49a5a97a4d9' // test user 'd'
        },
        {
            name: "Oh to the milk stout",
            type: 'Milk Stout',
            tasting_notes: 'Sweet and malty',
            date_tasted: 2019-04-04,
            owner: '62311fc03bbab49a5a97a4d9' // test user 'd'
        },
        {
            name: "Don't Be Sour",
            type: 'Sout',
            tasting_notes: 'Tart Rasberry',
            date_tasted: 2020-03-08,
            owner: '62311fc03bbab49a5a97a4d9' // test user 'd'
        }
    ]

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
