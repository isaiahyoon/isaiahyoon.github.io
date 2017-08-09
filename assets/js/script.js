$(document).ready(function(){
	$("#contact").click(function() {
		$("#modal-container").fadeIn(500);
	});

	$("#cancel").click(function() {
		$("#modal-container").fadeOut(500);
	});

	$("#modal-overlay").click(function() {
		$("#modal-container").fadeOut(500);
	});
});