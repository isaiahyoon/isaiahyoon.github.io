$(document).ready(function(){
  $("#nav").load("nav.html");
  $("#modal-container").load("modal.html");
  
	$("#contact").click(function() {
		$("#modal-container").fadeIn(500);
	});

	$("#cancel").click(function() {
		$("#modal-container").fadeOut(500);
	});

	$("#modal-overlay").click(function() {
		$("#modal-container").fadeOut(500);
	});

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      // ESC
      $("#modal-container").fadeOut(500);
    }
  });
});