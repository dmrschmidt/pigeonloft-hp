/* Author:

*/

var displayStatus = 0;

$().ready(function(){
	$.getJSON('http://pigeonmail.me/postcards/'+postcard_id+'.json', function(data) {
		console.log(data["postcards"]);
		
		$("#postcard-front").html('<img src="'+data["postcards"]["image_retina_url"]+'" class="postcard-front" />');
		$("#postcard-text h2").text(data["postcards"]["title"]);
		$("#postcard-text p").html(data["postcards"]["text"].replace(/\n/g, "&nbsp;<br />"));
		$("#recipient-line-1").text(data["postcards"]["recipient"]["name"]);
		$("#recipient-line-2").text(data["postcards"]["recipient"]["address_detail"]["thoroughfare"]);
		$("#recipient-line-3").text(data["postcards"]["recipient"]["address_detail"]["locality"]);
		$("#recipient-line-4").text(data["postcards"]["recipient"]["address_detail"]["country"]);
		
		for(var comment_number in data["postcards"]["comments"]) {
			var comment = data["postcards"]["comments"][comment_number];
			console.log(comment);
			$("#comments-list").append(
				'<li>' +
					'<div class="head">' +
						'<div class="username">'+comment["username"]+'</div>' +
						'<div class="location">'+comment["address_detail"]["locality"]+', '+comment["address_detail"]["country"]+'</div>' +
						'<div class="timestamp">'+comment["created_at"]+'</div>' +
					'</div>' +
					'<img src="'+comment["image_preview_url"]+'" class="preview" />' +
					'<img src="/images/stapler_needle.png" class="stapler" />' +
					'<p class="tk-gooddog-new">'+comment["text"]+'</p>' +
				'</li>');
		}
	});
	
	$("#flipper").bind("click", function() {
		// toggle display status
		displayStatus = (displayStatus + 1) % 2;
		if(displayStatus == 1) {
			$("#postcard-back-wrapper").fadeToggle("slow");
			$("#postcard-front-wrapper").fadeToggle("slow");
		} else {
			$("#postcard-back-wrapper").fadeToggle("slow");
			$("#postcard-front-wrapper").fadeToggle("slow");
		}
	});
	
	// $("#flipPad a:not(.revert)").bind("click",function(){
	// 	var $this = $(this);
	// 	// alert($("#" + $this.attr("title")).html());
	// 	$("#flipBox").flip({
	// 		direction: $this.attr("rel"),
	// 		content: $("#" + $this.attr("title")).html(),
	// 		onBefore: function(){$(".revert").show()}
	// 	});
	// 	
	// 	return false;
	// });
});