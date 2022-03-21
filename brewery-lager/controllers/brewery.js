// Import Dependencies
const express = require('express')
const Brewery = require('../models/brewery')
const Beer = require('../models/beer')
const fetchBreweries = require('../utils/fetchBreweries')


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
	const { username, userId, loggedIn } = req.session
	const promiseList = []
	Brewery.find({ $and: [{owner: userId}, {visited:false}]})
		.then(breweries => {
			for (i in breweries) {
				const promise = Promise.resolve(fetchBreweries.byId(breweries[i].open_brewery_db_id))	
				.then(breweryDetails => {
						// create a DEEP copy
						brewery = JSON.parse(JSON.stringify(breweries[i]))
						brewery.info = breweryDetails
						//console.log('BREWERY', brewery)
						return brewery
					})
				console.log('PROMISE LIST: ', promise)
				promiseList.push(promise)
				console.log(promiseList)
			}
			console.log('PROMISE LIST: ', promiseList)
			Promise.all(promiseList)
				.then( values => {
					breweries = values
					console.log('BREWERIES GOING TO RENDER: ', values)
					res.render('brewery/bucketlist', {breweries, username, loggedIn })
			})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
// INDEX/LIST VISITEDLIST (shows only the user's breweries) - DONE FOR NOW
router.get('/visitedlist', (req, res) => {
    const { username, userId, loggedIn } = req.session
	const promiseList = []
	Brewery.find({ $and: [{owner: userId}, {visited:true}]})
		.then(breweries => {
			for (i in breweries) {
				const promise = Promise.resolve(fetchBreweries.byId(breweries[i].open_brewery_db_id))	
				.then(breweryDetails => {
						// create a DEEP copy
						brewery = JSON.parse(JSON.stringify(breweries[i]))
						brewery.info = breweryDetails
						//console.log('BREWERY', brewery)
						return brewery
					})
				console.log('PROMISE LIST: ', promise)
				promiseList.push(promise)
				console.log(promiseList)
			}
			console.log('PROMISE LIST: ', promiseList)
			Promise.all(promiseList)
				.then( values => {
					breweries = values
					console.log('BREWERIES GOING TO RENDER: ', values)
					res.render('brewery/visitedlist', {breweries, username, loggedIn })
			})
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

// SEARCH RESULTS (displays search results in a table with buttons to add brewery to vist or bucket list)
router.post('/searchResults', (req, res) => {
	const { username, userId, loggedIn } = req.session 
	const searchMethod = req.body.searchMethod
	const input = req.body.input
	Promise.resolve(fetchBreweries.bySearchMethod(searchMethod, input))
	.then(breweries=>{
		for (let i = 0; i < breweries.length; i++){
			Brewery.countDocuments({open_brewery_db_id:breweries[i].id })
			.then(number=>{
					if(number > 0){
					breweries.splice(i,1)
				}
			})
		} 
		res.render('brewery/showQueryResults', {breweries, searchMethod, input, username, userId, loggedIn})})
})

// ADD BREWERY TO LIST && REMOVE FROM SEARCH RESULTS UPON REDIRECT
router.post('/addBreweryToList', (req, res) => {
	const { username, userId, loggedIn } = req.session // IS THIS NEEDED ON ALL TO PASS THE SESSION INFO TO LAYOUT???????
	const {open_brewery_db_id, visited} = req.body
	const newBrewery = {
		open_brewery_db_id: open_brewery_db_id,
		visited: visited,
		owner: userId
	}
	console.log('newBrewery, ', newBrewery)
	Brewery.create(newBrewery)
		.then(createBreweryResponse=>{
			console.log('create Brewery Response ', createBreweryResponse)
			res.redirect(307, './searchResults')
		})
		.catch(error => {
			console.log('error adding new brewery, ', error)
		})
})

// UPDATE BREWERY VISITED STATUS (only change visited status because all other brewery info is pulled from API)
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

// SHOW BREWERY AND RELATED BEERS (shows brewery info and table of corresponding beers)
router.get('/:id', (req, res) => {
	const {username, loggedIn, userId} = req.session
	const breweryId = req.params.id
			Brewery.findById(breweryId)
			.then(response => {
				const localBrewery = response
				fetchBreweries.byId(localBrewery.open_brewery_db_id)// start a new promise chain here with fetch
					.then(response => {
						const apiBrewery = response
						console.log('apiBrewery: ', apiBrewery)
						Beer.find({brewery: breweryId })
						.then(breweryBeers =>{
							const beers = breweryBeers
							for(i in beers){
								beers[i].date_tasted = moment(beers.date_tasted).format("MMM Do, YYYY")
							}
							res.render('brewery/showBrewery', { localBrewery, apiBrewery, beers, username, loggedIn, userId })
						})
						.catch((error) => {
						res.redirect(`/error?error=${error}`)
						})
					})
					.catch((error) => {
						res.redirect(`/error?error=${error}`)
					})
			}	)		
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
