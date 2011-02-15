// var MAX_ITERATIONS = 5;
// var row1 = "40.754983,-73.984027";
// var row2 = "next: San Francisco, CA";
// var fixed = "";
// var size = 10;
// var position = 0;
// var iteration = 0;
// 
// function getChar() {
//   return (iteration < MAX_ITERATIONS - 1)
//     ? Math.floor(Math.random() * 10)
//     : row1[position];
// }
// 
// function type() {
//   var current = fixed + getChar();
//   $("#current var").replaceWith('<var>' + current + '</var>');
//   iteration = (iteration < MAX_ITERATIONS) ? (iteration + 1) : 0 ;
//   if(iteration == 0) {
//     fixed = current;
//     position++;
//   }
//   window.setTimeout("type()", 100);
// }
// 
// $(document.body).click(function () {
//   if ($("#speech_bubble").is(":hidden")) {
//     $("#speech_bubble").show("fast", type());
//   }
// });