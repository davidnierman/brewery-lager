// Import Dependencies
const express = require('express')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')
const fetchBreweryData = require('../utils/fetchApi')


// Moments helps convert dates into correct format
// (Mongoose iso date format is extensive and not always needed)
const moment = require('moment')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})
/////////////////////////////////////
// Routes
//////////////////////////////////////

// INDEX/LIST BUCKETLIST (shows only the user's breweries) - DONE FOR NOW
router.get('/bucketlist', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
    Brewery.find({ $and: [{owner: userId}, {visited:false}]})
		.then(breweries => {
			res.render('brewery/bucketlist', {breweries, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
// INDEX/LIST VISITEDLIST (shows only the user's breweries) - DONE FOR NOW
router.get('/visitedlist', (req, res) => {
    const { username, userId, loggedIn } = req.session
	Brewery.find({ $and: [{owner: userId}, {visited:true}]})
		.then(breweries => {
			res.render('brewery/visitedlist', {breweries, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// SEARCH FORM FOR BREWERY (Allows a user to seach for a brewery and then add it to bucketlist)
router.get('/search', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('brewery/search', { username, loggedIn })
})

// SEARCH RESULTS 
router.post('/searchResults', (req, res) => {
	const { username, userId, loggedIn } = req.session // IS THIS NEEDED ON ALL TO PASS THE SESSION INFO TO LAYOUT???????
	const searchMethod = req.body.searchMethod
	const input = req.body.input
	Promise.resolve(fetchBreweryData(searchMethod, input))
	.then(breweries=>{res.render('brewery/showQueryResults', {breweries})})
})

// ADD BREWERY TO LIST
router.post('/addBreweryToList', (req, res) => {
	const { username, userId, loggedIn } = req.session // IS THIS NEEDED ON ALL TO PASS THE SESSION INFO TO LAYOUT???????
	const breweryAdditons = req.body
	res.send(breweryAdditons)
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Example.create(req.body)
		.then(example => {
			console.log('this was returned from create', example)
			res.redirect('/examples')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const breweryId = req.params.id
	Brewery.findById(breweryId)
		.then(brewery => {
			Brewery.findByIdAndUpdate(breweryId, {visited: !brewery.visited })
			.then(() => {
				res.redirect(`/brewery/${brewery.id}`)
			})
			.catch((error) => {
				res.redirect(`/error?error=${error}`)
			})
		})
})

// show route
router.get('/:id', (req, res) => {
	const breweryId = req.params.id
	Brewery.findById(breweryId)
		.then(returnedBrewery => {
            const {username, loggedIn, userId} = req.session
			const brewery = returnedBrewery
			Beer.find({brewery: breweryId })
			.then(breweryBeers =>{
				const beers = breweryBeers
				for(i in beers){
					beers[i].date_tasted = moment(beers.date_tasted).format("MMM Do, YYYY")
				}
				res.render('brewery/showBrewery', { brewery, beers, username, loggedIn, userId })
			})
			.catch((error) => {
				res.redirect(`/error?error=${error}`)
			})
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// DELETE BREWERY (delete brewery and return home)
router.delete('/:id', (req, res) => {
	const breweryId = req.params.id
	Brewery.findByIdAndRemove(breweryId)
		.then(() => {
			res.redirect('/')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
