$(document).ready(function(){
  $("#nav").load("nav.html");
  $("#modal-container").load("modal.html");

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      // ESC
      closeModal();
    }
  });
});

function loadModal() {
  $("#modal-container").fadeIn(500);
}

function closeModal() {
  $("#modal-container").fadeOut(500);
}