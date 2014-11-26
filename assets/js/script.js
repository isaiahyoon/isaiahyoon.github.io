$(document).ready(function(){
	
	// Question 4
	// IMPLEMENT "SHOW MODAL" WHEN "CLICK ON LOGIN BUTTON FROM MAIN PAGE" HERE
	$("#contact").click(function() {
		$("#modal-container").fadeIn(500);
	});

	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON LOGIN BUTTON FROM MODAL BOX" HERE
	$("#cancel").click(function() {
		$("#modal-container").fadeOut(500);
	});

	$("#submit").click(function() {
		$("#modal-container").fadeOut(500);
	});

	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON CANCEL BUTTON FROM MODAL BOX" HERE
	$("#modal-overlay").click(function() {
		$("#modal-container").fadeOut(500);
	});
	
	// Question 5
	// IMPLEMENT "HIDE MODAL" WHEN "CLICK ON MODAL OVERLAY" HERE
	
});