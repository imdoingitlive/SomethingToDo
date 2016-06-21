(function() {
		
	//Local variables
	var ticketMasterAPI = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E";
	

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
	function getAPIQuery()	{

		// Local variables
		var apiQuery = "";
		var startDateTime = "";
		var city = "";
		var postalCode = "";

		// Get values from URL
		startDateTime = $_GET("startDateTime");
		city	= $_GET("city");
		postalCode = $_GET("postalCode");

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

	function createEventListing()	{
		
		// Function call to get API query
		var apiURL = getAPIQuery();

		// Remove child elements
		$(".event-list").empty();

		$.ajax({
            url: apiURL,   // TicketMaster API
            method: 'GET'    // Get object data from API
    	})

    	.done(function(response) {  // When response object is returned
            
            // Get the data from response object
            var results = response._embedded;
            
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

                // Append p objects to div object
                eventSegmentPDiv.append(pEventText);
                eventSegmentPDiv.append(pEventSegment);

                // Append img object to div object
                eventSegmentImgDiv.append(eventImage);

                // Append Segments
                eventSegmentsDiv.append(eventSegmentImgDiv);
                eventSegmentsDiv.append(eventSegmentPDiv);
                eventColDiv.append(eventSegmentsDiv);

                // Add to page
                $('.event-list').append(eventColDiv);
                
            }

        });

	}

	// When individual event listing is clicked
	$(document.body).on('click','.click-event', function(){

        // Get the event id from data attribute  
        var clickedEventId = $(this).data('eventid'); 
    
        // For the event id, show the details modal window
        console.log("https://app.ticketmaster.com/discovery/v2/events/" + clickedEventId + ".json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E");
    });

	// Load event listing
	createEventListing();

})();