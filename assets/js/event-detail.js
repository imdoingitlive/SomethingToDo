/****
 * Use the ticketmaster API to access event detail 
 * for the event ID supplied.

 https://app.ticketmaster.com/discovery/v2/events/G5diZf7xE5vpO.json?apikey=OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS

 * Use the OpenTable API to access a list of restaurants in
 * the general vinciy
 *
 * http://opentable.herokuapp.com/api
 *
 ****/

(function() {


	/*------  TEMPORARY CODE  ----------------
	/* Comment out temporary code to test with 
	/* integrated app.
	/*-----*/
	// Temporary variables so to hold hardcoded id and key for testing
	var eventID = "G5diZf7xE5vpO.json";
	var tmApiKey = "OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS";

	function test(){
		console.log("test");

		eventDetail(eventID);

		$('.ui.modal').modal('show');

		$('.ui.accordion').accordion();
	 };

	test();

	/* -------  END TEMPORARY CODE --------- */

	/*****
	 * Event Detail Functions
	 *****/

	function eventDetail(eventID) {

	 	/*-------------*/
	 	/* 1: Get event detail from the Ticket Master API
	 	/*-------------*/
		var tmQueryURL="https://app.ticketmaster.com/discovery/v2/events/" +
	 			eventID + "?apikey=" + tmApiKey;
	 	// var tmQueryURL="https://app.ticketmaster.com/discovery/v2/events/G5diZf7xE5vpO.json?apikey=OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS";

	 	// The AJAX function uses the URL and Gets the JSON data associated with it. 
	 	// The data then gets stored in the variable called: "tmData"
		$.ajax({url: tmQueryURL, method: "GET"}) 
			.done(function(tmData) {
				console.log(tmQueryURL);
				console.log("https://app.ticketmaster.com/discovery/v2/events/G5diZf7xE5vpO.json?apikey=OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS");
				console.log(tmData);

			 	/*--------------------------------------*/
			 	/* Display the Event Name in the Heading
			 	/*--------------------------------------*/
				$('#modal-header').html(tmData.name);

				/*-------------*/
				/* Display sub-headings
			 	/*-------------*/
			 	$('left-column').append("<h5>Event Details</h5>");
			 	$('right-column').append("<h5>Nearby Restaurants</h5>");

			 	/* Display an Image for the Event
			 	/*-------------*/
			 	displayImage(tmData.images);

			 	/*-------------*/
			 	/* Display Venue Info
			 	/*-------------*/
			 	displayVenues(tmData._embedded.venues);

			 	/*-------------*/
			 	/* Display the Public Sale Start Date/Time
			 	/*-------------*/
			 	displayDate(tmData);

			 	/*-------------*/
			 	/* Display a list of Restaurants in the area
			 	/*-------------*/
			 	if (tmData._embedded.venues.length > 0) {
			 		var zipcode = tmData._embedded.venues[0].postalCode;
			 		restaurantList(zipcode);
			 	}

			});
	};

	function displayImage(images) {

		var imageDiv = $('<img>');
		imageDiv.addClass('image');
		imageDiv.addClass('event-detail-img');

		// Search for the image where the following keys are found:
		// ratio = "16_9"
		// width = 205
		// height = 115

		for (var i = 0; i < images.length; i++) {
			var img = images[i];

			if (img.ratio == "16_9" && img.width == 205 && img.height == 115){
				imageDiv.attr('src', img.url);
				break;
			}
		}
		
		$('#image-content').append(imageDiv);
	}

	function displayVenues(venues) {

		for (var i = 0; i < venues.length; i++) {
			/* The first venue found will be active */
			displayVenue(venues[i], i == 0 ? true : false);
		}
	}

	function displayVenue(venue, isActive) {

		var titleDiv = $('<div>');
		var iconDiv = $('<i>');
		var outerContentDiv = $('<div>');
		var innerContentDiv = $('<p>');

		if (isActive) {
			titleDiv.addClass('title active');
			outerContentDiv.addClass('content active');
			innerContentDiv.addClass('transition visible');
			innerContentDiv.attr('style', 'display: block !important;');
		} else {
			titleDiv.addClass('title');
			outerContentDiv.addClass('content');
			innerContentDiv.addClass('transition hidden');
		}

		iconDiv.addClass('dropdown icon');

		titleDiv.append(iconDiv);
		titleDiv.append(venue.name);

		innerContentDiv.append(venue.address.line1 + "<br>");
		innerContentDiv.append(venue.city.name + ", " + 
								venue.state.stateCode + ", " +
								venue.postalCode);

		var url = '<a href="' + venue.url + '">More Info...</a>';
		innerContentDiv.append("<br>" + url);

		outerContentDiv.append(innerContentDiv);

		$('.venue.content.ui.accordion').append(titleDiv);

		$('.venue.content.ui.accordion').append(outerContentDiv);

	}

	function displayDate(event) {
		var date = moment(event.dates.start.dateTime).format("MMMM Do YYYY, h:mm A");
		var saleDate = moment(event.sales.public.startDateTime).format("MMMM Do YYYY, h:mm A");

		date = "<p>Event Date: " + date + "</p>";
		saleDate = "<p>On Sale Starting: " + saleDate + "</p>";

		$('#image-content').append('<div class="content" id="event-content"></div>');

		$('#event-content').append(date);
		$('#event-content').append(saleDate);

		displayPriceRange(event.priceRanges);
	}

	function displayPriceRange(prices) {
		// Search for the price range where:
		// type = "standard"
			var currency = "";
			var min = 0;
			var max = 0;

		for (var i = 0; i < prices.length; i++) {

			if (prices[i].type == "standard"){
				currency = prices[i].currency;
				min = prices[i].min;
				max = prices[i].max;

				break;
			}
		}
		
		var priceRange = "<p>Prices Range From: " + min + " - " + max + " " + currency + "</p><br>";

		$('#event-content').append(priceRange);
	}

	$('.venue.content.ui.accordion').on("click", function(title) {
		// Add functionality to re-display restaurant list
		// when venue is selected
	});

	/*****
	 * Restaurant Functions
	 *****/
	function restaurantList(zipcode) {

	 	/*-------------*/
	 	/* 1: Get list of restaurants from the OpenTable API
	 	/*-------------*/
		var otQueryURL="https://opentable.herokuapp.com/api/restaurants?zip=" + zipcode;

	 	// The AJAX function uses the URL and Gets the JSON data associated with it. 
	 	// The data then gets stored in the variable called: "otData"
		$.ajax({url: otQueryURL, method: "GET"}) 
			.done(function(otData) {
				console.log(otQueryURL);
				console.log(otData);

			 	/*-------------*/
			 	/* 2: Use an accordion element to display the first 5
			 	/* restaurants in the list of restaurants returned from the API.
			 	/* The first restaurant's info will be active.
			 	/*-------------*/
			 	for (var i = 0; i < otData.restaurants.length && i < 5; i++) {
					/* The first restaurant found will be active */
					var r = otData.restaurants[i];
					displayRestaurant(otData.restaurants[i], i == 0 ? true : false);
				}
			});
	}

	function displayRestaurant(restaurant, isActive) {

		var titleDiv = $('<div>');
		var iconDiv = $('<i>');
		var outerContentDiv = $('<div>');
		var innerContentDiv = $('<p>');

		if (isActive) {
			titleDiv.addClass('title active');
			outerContentDiv.addClass('content active');
			innerContentDiv.addClass('transition visible');
			innerContentDiv.attr('style', 'display: block !important;');
		} else {
			titleDiv.addClass('title');
			outerContentDiv.addClass('content');
			innerContentDiv.addClass('transition hidden');
		}

		iconDiv.addClass('dropdown icon');

		// Display restaurant name in the title
		titleDiv.append(iconDiv);
		titleDiv.append(restaurant.name);

		// Display an image from the restaurant
		var imageDiv = $('<img>');
		imageDiv.addClass('restaurant-img');
		imageDiv.attr('src', restaurant.image_url);
		innerContentDiv.append(imageDiv);

		innerContentDiv.append("<br>" +
								restaurant.address + "<br>" + 
								restaurant.city + ", " + 
								restaurant.state + ", " + 
								restaurant.postal_code);

		var url = '<a href="' + restaurant.reserve_url + '">Reservations...</a>';
		innerContentDiv.append("<br>" + url);

		outerContentDiv.append(innerContentDiv);

		$('.restaurant.content.ui.accordion').append(titleDiv);

		$('.restaurant.content.ui.accordion').append(outerContentDiv);

	}

})();