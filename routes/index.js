var express = require('express');
var router = express.Router();
// Request API access: http://www.yelp.com/developers/getting_started/api_access 
var Yelp = require('yelp');
var d;
var going = [];
var Bar = require('../models/bar');
 
var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});

module.exports = function(passport){
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index');
	});

	var allBars = [];
	
	router.post('/', function(req, res, next) {
		function getAllBars(callback) {
			Bar.find({}, function(err, docs) {
				if (err) {
					throw err;
				} else {
					callback(docs);
				}
			});
	    }

		getAllBars(function(docs) {
			allBars = docs;
		});

		function getResults(callback){
			yelp.search({ term: 'bar', location: req.body.location, limit: 10 }, function(err, data){
				if (err) {
		            throw err;
	            } else {
	                callback(data);
	            }
			});			
		}

		getResults(function(data){
			d = data.businesses;
			going = [];
			for(var i = 0; i < d.length; i++){
				var count = 0;
				for(var j = 0; j < allBars.length; j++) {
					if(d[i].id == allBars[j].barId) {
						count++;
					}
				}
				going.push(count);
			}
			res.render('index', { data: d, going: going });
		});
	});

	router.get('/auth/github',
	  passport.authenticate('github'));

	router.get('/auth/github/callback', 
	  passport.authenticate('github', { failureRedirect: '/' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.render('index', { data: d, going: going });
	  });

	router.get('/going/:id', ensureAuthenticated, function(req, res, next) {
		Bar.findOrCreate({ githubId: req.user.githubId, barId: req.params.id }, function (err, bar, created) {
			if(created == false){
				Bar.remove({"_id": bar._id}, function(err){
					if (err)
						console.log(err.message)
				});
			}

			function getAllBars(callback) {
				Bar.find({}, function(err, docs) {
					if (err) {
						throw err;
					} else {
						callback(docs);
					}
				});
			}		    

			getAllBars(function(docs) {
				allBars = docs;
				going = [];
				for(var i = 0; i < d.length; i++){
					var count = 0;
					for(var j = 0; j < allBars.length; j++) {
						if(d[i].id == allBars[j].barId) {
							count++;
						}
					}
					going.push(count);
				} 
				res.render('index', { data: d, going: going });
			});
		});
	});

	// Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed.  Otherwise, the user will be redirected to the
	//   login page.
	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
	  	res.redirect('/auth/github')
	}

	return router;
}


 
