$( document ).ready(function() {

	// var userInfo = $("#zipcode").val();
	// console.log(unserInfo);

	// $("#searchForm").validate({
	// 	rules: {
	// 		zipcode: {
	// 		required: true,
	// 		minlength: 5,
	// 		maxlength: 5,
	// 		zipcodeUS: true
	// 		}
	// 	}
	// });

	$('#zipcode').click(function(){
   		window.location.href='eventlist.html?startDateTime=2016-06-18T00:00:00Z&postalCode=10001';
	})

	$("#zipcode").keyup(function (e) {
    	if (e.keyCode == 13) {
			window.location.href='eventlist.html?startDateTime=2016-06-18T00:00:00Z&postalCode=10001';
    	}	
	});
});