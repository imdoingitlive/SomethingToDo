$( document ).ready(function() {

	// var userInfo = $("#zipcode").val();
	// console.log(unserInfo);

	$("#searchForm").validate({
		rules: {
			zipcode: {
			required: true,
			minlength: 5,
			maxlength: 5,
			zipcodeUS: true
			}
		}
	});
});