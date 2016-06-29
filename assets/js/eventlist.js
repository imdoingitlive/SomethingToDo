(function() {
		
	//Local variables
	var ticketMasterAPI = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E";
	var tmApiKey = "1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E";

	// Fix the menu bar on top of the viewport
	$(window).bind('scroll', function() {
		
		// Get the viewport height and subtract nav bar height
		var navHeight = $( window ).height() - 70;

		// Fix the nav bar when scrolled to top of viewport
		if ($(window).scrollTop() > navHeight) {
			$('nav').addClass('fixed');
		}
		else {
			$('nav').removeClass('fixed');
		}
	});

	// Function to read parameters from URL
	function $_GET(param) {

		// Initialize variable
		var vars = {};

		// Get the key value pair from URL
		window.location.href.replace( location.hash, '' ).replace(/[?&]+([^=&]+)=?([^&]*)?/gi, 
			function( m, key, value ) { 
				vars[key] = value !== undefined ? value : '';
			}
		);

		// For the function parameter get the value
		if ( param ) {
			return vars[param] ? vars[param] : null;	
		}

		// Return value
		return vars;
	}

	// Function to create Ticket Master query URL
	function getAPIQuery(fparmCity, fparmPostalCode)	{

		// Local variables
		var apiQuery = "";
		var startDateTime = "";
		var city = "";
		var postalCode = "";

		// Get values from URL
		startDateTime = $_GET("startDateTime");
		city	= $_GET("city");
		postalCode = $_GET("postalCode");

		if (fparmCity !== null)	{
			city = fparmCity;
		}

		if (fparmPostalCode!== null)	{
			postalCode = fparmPostalCode;
		}

		// If postal code is not null then use postal code
		if ( postalCode !== null )	{
			apiQuery = ticketMasterAPI + "&startDateTime=" + startDateTime + "&postalCode=" + postalCode;
		}

		// If city is not null then use city
		if ( city !== null )	{
			apiQuery = ticketMasterAPI + "&startDateTime=" + startDateTime + "&city=" + city;
		}

		// Return API Query
		return apiQuery;
	}

	// Function to display event listing
	function createEventListing(fparmAPIURL)	{
		
		// Function call to get API query
		var apiURL = fparmAPIURL;

		// Remove child elements
		$(".event-list").empty();

		$.ajax({
            url: apiURL,   // TicketMaster API
            method: 'GET'    // Get object data from API
    	})

    	.done(function(response) {  // When response object is returned
            
            // Get the data from response object
            var results = response._embedded;

            // If no event resulting is returned
            if (results == null) { 

            	// Show custom error modal message
            	$('.ui.small.modal.custom-error')
  				.modal('show')
				;
            }
            
            // If event listing is returned
            else {
          
	            // Loop through object
	            for (var j = 0; j < results.events.length; j++) {

	                // Create div jquery objects
	                var eventColDiv = $('<div class="column">');
	                var eventSegmentsDiv = $('<div class="ui horizontal segments col-style">');
	                var eventSegmentImgDiv = $('<div class="ui segment seg-user-style">');
	                var eventSegmentPDiv = $('<div class="ui segment seg-user-style">');

	                // Create p jquery objects
	                var pEventText = $('<p>').text(results.events[j].name);
	                var pEventSegment = $('<p>').text(results.events[j].classifications[0].segment.name);

	                // Get image array
	                var imgs = results.events[j].images;
	                var eventImage;
	                   
	                // Loop through image array and get the image URL for ratio: 16_9, width: 640, height: 360
	                for (var i = 0; i < imgs.length; i++) {
	                    if ( imgs[i].ratio == "16_9" && imgs[i].width == 640 && imgs[i].height == 360 )  {
	                    	
	                    	// Create image jquery object
	                    	eventImage = $('<img class="ui small image">').attr('src', imgs[i].url);
	                    }
	                }

	                // Add data attribute
	                eventSegmentsDiv.attr('data-eventid', results.events[j].id);

	                // Add class 
	                eventSegmentsDiv.addClass('click-event');

	                // Append p object to div object
	                eventSegmentPDiv.append(pEventText);

	                // Append img and p object to div object
	                eventSegmentImgDiv.append(eventImage);
	                eventSegmentImgDiv.append(pEventSegment);

	                // Append Segments
	                eventSegmentsDiv.append(eventSegmentImgDiv);
	                eventSegmentsDiv.append(eventSegmentPDiv);
	                eventColDiv.append(eventSegmentsDiv);

	                // Add to page
	                $('.event-list').append(eventColDiv);
	                
	            }
        	}
        });

        return false;

	}

	// When enter key is pressed in the search bar
	$(".city-zipcode").keyup(function (e) {
    	if (e.keyCode == 13) {

    		// Check if value is not blank
	        if ($(".city-zipcode").val() !== "")	{

	    		var enteredValue = "";

	    		// If five digit zip code
	    		if (isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($(".city-zipcode").val()))	{
	    			enteredValue = $(".city-zipcode").val();
	    			createEventListing(getAPIQuery(null, enteredValue));
	    		}	

	    		// If city is entered
	    		else {
	    			enteredValue = $(".city-zipcode").val().replace(" ","%20");
	    			createEventListing(getAPIQuery(enteredValue, null));
	    		}
	        }
    	}	
	});

	// If button in search bar is clicked
	$(document.body).on('click','.city-zipcode-btn', function(){
    	
		// Check if value is not blank
    	if ($(".city-zipcode").val() !== "")  {

    		var enteredValue = "";

    		// If five digit zip code
    		if (isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($(".city-zipcode").val()))	{
    			enteredValue = $(".city-zipcode").val();
    			createEventListing(getAPIQuery(null, enteredValue));
    		}

    		// If city is entered	
    		else {
    			enteredValue = $(".city-zipcode").val().replace(" ","%20");
    			createEventListing(getAPIQuery(enteredValue, null));
    		}
	    }
   	});


	// When About button is click, open modal window
	$(document.body).on('click','.myAboutClick', function(){

		// Show custom about modal window
		$('.ui.small.modal.custom-about')
  			.modal('show')
		;

	});

	// When Team button is click, open modal window
	$(document.body).on('click','.myTeamClick', function(){

		// Show custom team modal window
		$('.ui.small.modal.custom-team')
  			.modal('show')
		;

	});

	// When Contact button is click, open modal window
	$(document.body).on('click','.myContactClick', function(){

		// Show custom contact modal window
		$('.ui.basic.modal')
  			.modal('show')
		;

	});

	// When individual event listing is clicked
	$(document.body).on('click','.click-event', function(){

        // Get the event id from data attribute  
        var clickedEventId = $(this).data('eventid'); 

        getEventDetails(clickedEventId);
    
        // For the event id, show the details modal window
        // console.log("https://app.ticketmaster.com/discovery/v2/events/" + clickedEventId + ".json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E");
    });

	// Load event listing
	createEventListing(getAPIQuery(null, null));

	//////////////////////////////////////////////////////////////////////
	// Below code integreted from Stefanie 
	//////////////////////////////////////////////////////////////////////

	function getEventDetails(pEventID){
		
		eventDetail(pEventID);

		$('#event-modal')
  			.modal('show')
		;

		// $('.ui.modal').modal('show');
		$('.ui.accordion').accordion();
	 };

	//Function to display event details
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

				// console.log(tmQueryURL);
				// console.log("https://app.ticketmaster.com/discovery/v2/events/G5diZf7xE5vpO.json?apikey=OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS");
				// console.log(tmData);

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
			 	$('#image-content-eventdtl').empty();
			 	displayImage(tmData.images);

			 	/*-------------*/
			 	/* Display Venue Info
			 	/*-------------*/
			 	$('.venue.content.ui.accordion').empty();
			 	displayVenues(tmData._embedded.venues);

			 	/*-------------*/
			 	/* Display the Public Sale Start Date/Time
			 	/*-------------*/
			 	displayDate(tmData);

			 	/*-------------*/
			 	/* Display a list of Restaurants in the area
			 	/*-------------*/
			 	$('.restaurant.content.ui.accordion').empty();
			 	if (tmData._embedded.venues.length > 0) {
			 		var zipcode = tmData._embedded.venues[0].postalCode;
			 		restaurantList(zipcode);
			 	}

			});
	};

	// Function to display images
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
		
		$('#image-content-eventdtl').append(imageDiv);
	}

	// Function to display venues
	function displayVenues(venues) {

		for (var i = 0; i < venues.length; i++) {
			/* The first venue found will be active */
			displayVenue(venues[i], i == 0 ? true : false);
		}
	}

	// Function to display event venue
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

		var url = '<a href="' + venue.url + '" target="_blank">More Info...</a>';
		innerContentDiv.append("<br>" + url);

		outerContentDiv.append(innerContentDiv);

		$('.venue.content.ui.accordion').append(titleDiv);

		$('.venue.content.ui.accordion').append(outerContentDiv);

	}

	// Function to display date by event 
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

	// Function to display event price ranges
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

	/*****
	 * Restaurant Functions
	 *****/

	// Function to query by zip code for restaurants
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

	// Function to display restaurant
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

		var url = '<a href="' + restaurant.reserve_url + '" target="_blank">Reservations...</a>';
		innerContentDiv.append("<br>" + url);

		outerContentDiv.append(innerContentDiv);

		$('.restaurant.content.ui.accordion').append(titleDiv);

		$('.restaurant.content.ui.accordion').append(outerContentDiv);

	}

	/////////////////////////////////////////////////////////////////

})();