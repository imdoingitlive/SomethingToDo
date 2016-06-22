/****
 * Use the ticketmaster API to access event detail 
 * for the event ID supplied.

 https://app.ticketmaster.com/discovery/v2/events/G5diZf7xE5vpO.json?apikey=OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS

 ****/

 var eventID = "G5diZf7xE5vpO.json";
 var tmApiKey = "OmRbi4xJQVJOYo6jqYeDimlPMGA8UvXS";
 
 function test(){
 	console.log("test");

 	eventDetail(eventID);

 	$('.ui.modal').modal('show');

 	$('.ui.accordion').accordion();
 };

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
			$('.header').html(tmData.name);

		 	/*-------------*/
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

		});
};

function displayImage(images) {

	var imageDiv = $('<img>');
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
	innerContentDiv.append(venue.city.name + ", " + venue.state.stateCode);
var url = '<a href="' + venue.url + '">More Info...</a>';
//	innerContentDiv.append('<a href="' + venue.url + '"></a>');
	innerContentDiv.append("<br>" + url);
	outerContentDiv.append(innerContentDiv);

	$('.venue.content.ui.styled.accordion').append(titleDiv);

	$('.venue.content.ui.styled.accordion').append(outerContentDiv);
/*
  <div class="title active">
    <i class="dropdown icon"></i>
    What is a dog?
  </div>
  <div class="content active">
    <p class="transition visible" style="display: block !important;">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
*/
 /*****

Sample code for accordian styled container.

Show the detail for the first venue in the list.

Other venues will be collapsed.

<div class="ui styled accordion">
  <div class="title active">
    <i class="dropdown icon"></i>
    What is a dog?
  </div>
  <div class="content active">
    <p class="transition visible" style="display: block !important;">A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.</p>
  </div>
  <div class="title">
    <i class="dropdown icon"></i>
    What kinds of dogs are there?
  </div>
  <div class="content">
    <p class="transition hidden">There are many breeds of dogs. Each breed varies in size and temperament. Owners often select a breed of dog that they find to be compatible with their own lifestyle and desires from a companion.</p>
  </div>
  <div class="title">
    <i class="dropdown icon"></i>
    How do you acquire a dog?
  </div>
  <div class="content">
    <p class="transition hidden">Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
    <p class="transition hidden">A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
  </div>
</div>

****/

}

function displayDate(event) {

	var date = moment(event.dates.start.dateTime).format("MM/DD/YY hh:mm A");
	var saleDate = moment(event.sales.public.startDateTime).format("MM/DD/YY hh:mm A");

	date = "<h5>Event Date: </h5>" + date + "<br>";
	saleDate = "<h5>On Sale to General Public Starting: </h5>" + saleDate + "<br>";

	$('#image-content').append('<div class="ui segment" id="event-content"></div>');

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
	
	var priceRange = "<h5>Prices Range From: </h5>" + min + " - " + max + " " + currency + "<br>";

	$('#event-content').append(priceRange);
}
$('.venue.content.ui.styled.accordion').on("click", function(title) {

});

test();