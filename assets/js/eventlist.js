(function() {
		
	//Local variables
	var ticketMasterAPI = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E";
	

	// Fix the menu bar top of the viewport
	$(window).bind('scroll', function() {
	
	var navHeight = $( window ).height() - 70;
		if ($(window).scrollTop() > navHeight) {
			$('nav').addClass('fixed');
		}
		else {
			$('nav').removeClass('fixed');
		}
	});

	// Function to read parameters from URL
	function $_GET(param) {

		var vars = {};
		window.location.href.replace( location.hash, '' ).replace(/[?&]+([^=&]+)=?([^&]*)?/gi, 
			function( m, key, value ) { 
				vars[key] = value !== undefined ? value : '';
			}
		);

		if ( param ) {
			return vars[param] ? vars[param] : null;	
		}
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

                // Create div jquery object
                var eventColDiv = $('<div class="column">');
                var eventSegmentsDiv = $('<div class="ui horizontal segments col-style">');
                var eventSegmentImgDiv = $('<div class="ui segment seg-user-style">');
                var eventSegmentPDiv = $('<div class="ui segment seg-user-style">');

                // Create p jquery object
                var pEventText = $('<p>').text(results.events[j].name);
                var pEventSegment = $('<p>').text(results.events[j].classifications[0].segment.name);

                // Create p jquery object
                var imgs = results.events[j].images;
                var eventImage;
                   
                for (var i = 0; i < imgs.length; i++) {
                    if ( imgs[i].ratio == "16_9" && imgs[i].width == 640 && imgs[i].height == 360 )  {
                    	eventImage = $('<img class="ui small image">').attr('src', imgs[i].url);
                    }
                }

                // Add data attribute
                eventSegmentsDiv.attr('data-eventid', results.events[j].id);

                // Add class 
                eventSegmentsDiv.addClass('click-event');

                // Append p object to div object
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

	// When individual event is clicked
	$(document.body).on('click','.click-event', function(){

        // Get the event id from data attribute  
        var clickedEventId = $(this).data('eventid'); 
    
        console.log("https://app.ticketmaster.com/discovery/v2/events/" + clickedEventId + ".json?apikey=1PbxFPsZAmiNpIqOY0EMRT9oG7YhX38E");
    });

	createEventListing();

})();