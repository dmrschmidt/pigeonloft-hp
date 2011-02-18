/*
 * Handling for the speech bubbles which use my jQuery typewriter plugin to
 * simulate and old-shool style and support our vintage design.
 */
var markers;
var timeouts = [1000, 1000, 500, 900];

/*
 * Lets the GPS marker pop-up at their locations sequentially.
 */
function display() {
  $(markers.shift()).fadeIn("fast");
  if(markers.length > 0) window.setTimeout("display()", timeouts.shift());
}

/*
 * Do the initial loading of the bubble marker and link them to their
 * typewriter bubbles.
 */
$(document).ready(function() {
  /*
   * hide the typewriters (they need to be visual by default in case someone)
   * with deactivated JS comes along.
   */
  $(".typewriter").each(function(index, writer) { $(writer).hide(); });
  // let the markers show their bubble when clicked
  $(".marker").each(function(index, marker) {
    // hide the marker (so they can show up again later)
    $(marker).hide();
    $(marker).click(function() {
      // each marker knows it's typewriter bubble through that attribute
      var box = $('#'+$(marker).attr("data-start-typewriter"));
      box.show("fast");
    })
  });
  // let the markers appear sequentially
  markers = $(".marker").toArray();
  window.setTimeout("display()", timeouts.shift());
});