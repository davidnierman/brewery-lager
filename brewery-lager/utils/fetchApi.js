
// Requirements
require('dotenv').config() // make our .env variables available via process.env
const fetch = require('node-fetch') // require fetch

// assign a variable to open brewery db api
const apiUrl = process.env.OPENBREWERYDBAPI

// Query Parameters Brewery DB API will accept

BreweryDbQueryParams = ['by_city', 'by_name', 'by_state', 'by_postal', 'by_type']


// create a function that will fetch data
const fetchBreweryData = (searchMethod, input) => {
    let response
    inputUrlEncoded = input.replaceAll(' ', '%20') // replace spaces with %20 to make it url friendly
    if (BreweryDbQueryParams.includes(searchMethod)) {
        const url = `${apiUrl}?${searchMethod}=${input}`
        console.log(url)
        fetch(url)
            .then(breweries => {
                return breweries.json()
            })
                .then(json => {
                    //console.log(json)
                    return json
                })
                .catch(error => {
                    console.log('error fetching ', error)
                })
            .catch(error => {
                console.log('error fetching ', error)
            })
    } 
}

// export utility 
module.exports = function(searchMethod, input) {
    fetchBreweryData(searchMethod, input)
}