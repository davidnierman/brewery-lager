// Import Dependencies
const express = require('express')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')

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

// INDEX OF BEERS TASTED (shows only the user's beers)
router.get('/index', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	const beersWithBreweryPop = []
	Beer.find({ owner: userId })
		.then(beers =>{
			//console.log(beers)
			for (i in beers){
				let beer = beers[i]
				let beerId = beer.id
				Beer.findById(beer.id)
				.populate('brewery')
				.then(beer => {
					beersWithBreweryPop.push(beer)
				})
			}
			res.render('beer/index', { beersWithBreweryPop, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
				})
})

// CREATE BEER TASTING - FORM (renders the form needed to submit a new beer tasting)
router.get('/:breweryid/create', (req, res) => {
	const { username, userId, loggedIn } = req.session
	const breweryId = req.params.breweryid
	Brewery.findById(breweryId)
		.then(brewery => {
			res.render('beer/create', {brewery,userId, username, loggedIn })
		})
		.catch(error=>{
			console.log('error fetching brewering', error)
		})
	})

// CREATE BEER TASTING - ACTION (creates a beer tasting record)
router.post('/create', (req, res) => {
	const newBeer = req.body
	console.log(newBeer)
	Beer.create(newBeer)
		.then(beer => {
			res.redirect(`./${beer.id}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// EDIT BEER TASTING - FORM (renders the form needed to submit edits to a beer tasting record)
router.get('/:id/edit', (req, res) => {
	const { username, userId, loggedIn } = req.session
	const beerId = req.params.id
	Beer.findById(beerId)
		.then(beer => {
			res.render('beer/edit', { beer, username, userId, loggedIn })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// UPDATE BEER DETAILS (updates details about beer)
router.put('/:id', (req, res) => {
	const beerId = req.params.id
	Beer.findByIdAndUpdate(beerId, req.body, { new: true })
		.then(updatedBeer => {
			res.redirect(`/beer/${updatedBeer.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// SHOW BEER DETAILS (show details about a particular beer)
router.get('/:beerid', (req, res) => {
	const {username, loggedIn, userId} = req.session
	const beerId = req.params.beerid
	Beer.findById(beerId)
		.populate('brewery')
		.then(beer => {
			beer.date_tasted = moment(beer.date_tasted).format("MMM Do, YYYY")
			res.render('beer/showDetails', { beer, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// DELETE BEER TASTING (delete beer tasting and return to brewery)
router.delete('/:id', (req, res) => {
	const beerId = req.params.id
	//console.log('removing beer with id: ', beerId )
	Beer.findByIdAndRemove(beerId)
		.then(removedBeer => {
			console.log('brewery ID to reroute to: ', removedBeer.brewery)
			const brewery = removedBeer.brewery
			res.redirect(`/brewery/${brewery}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
