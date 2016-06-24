$( document ).ready(function() {

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