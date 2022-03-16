// Import Dependencies
const express = require('express')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')

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
router.get('/tastedlist', (req, res) => {
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
				.exec(function (err, beer) {
					if (err) return handleError(err)
					beersWithBreweryPop.push(beer)
					console.log(beer)
				})
			}
			res.render('beer/tastedlist', { beersWithBreweryPop, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
				})
})

// CREATE BEER TASTING - FORM (renders the form needed to submit a new beer tasting)
router.get('/:breweryid/create-beer-tasting', (req, res) => {
	const { username, userId, loggedIn } = req.session
	const breweryId = req.params.breweryid
	Brewery.findById(breweryId)
		.then(brewery => {
			console.log('found brewery object to add to beer tasting', brewery)
			res.render('beer/createBeerTasting', {brewery,userId, username, loggedIn })
		})
		.catch(error=>{
			console.log('error fetching brewering', error)
		})
	})

// CREATE BEER TASTING - ACTION (creates a beer tasting record)
router.post('/:breweryid/create-beer-tasting', (req, res) => {
	const newBeer = req.body
	console.log(newBeer)
	Beer.create(newBeer)
		.then(beer => {
			console.log('this was returned from create beer', beer)
			res.send(beer)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const exampleId = req.params.id
	Example.findById(exampleId)
		.then(example => {
			res.render('examples/edit', { example })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const exampleId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Example.findByIdAndUpdate(exampleId, req.body, { new: true })
		.then(example => {
			res.redirect(`/examples/${example.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:beerid', (req, res) => {
	const beerId = req.params.beerid
	Beer.findById(beerId)
		.then(beer => {
            const {username, loggedIn, userId} = req.session
			res.render('beer/showBeerDetails', { beer, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const exampleId = req.params.id
	Example.findByIdAndRemove(exampleId)
		.then(example => {
			res.redirect('/examples')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
