/* Author:

*/

$().ready(function(){
	$.getJSON('http://pigeonmail.me/postcards/'+postcard_id+'.json', function(data) {
		console.log(data["postcards"]);
		
		$("#postcard-text h2").text(data["postcards"]["title"]);
		$("#postcard-text p").html(data["postcards"]["text"].replace("\n", "&nbsp;<br />"));
		$("#recipient-line-1").text(data["postcards"]["recipient"]["name"]);
		$("#recipient-line-2").text(data["postcards"]["recipient"]["address_detail"]["thoroughfare"]);
		$("#recipient-line-3").text(data["postcards"]["recipient"]["address_detail"]["locality"]);
		$("#recipient-line-4").text(data["postcards"]["recipient"]["address_detail"]["country"]);
		
		for(var comment_number in data["postcards"]["comments"]) {
			var comment = data["postcards"]["comments"][comment_number];
			console.log(comment);
			$("#comments-list").append('<li><img src="'+comment["image_preview_url"]+'" class="preview" /><img src="/images/stapler_needle.png" class="stapler" /><p class="tk-gooddog-new">'+comment["text"]+'</p></li>');
		}
	});
});