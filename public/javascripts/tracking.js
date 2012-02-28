$(document).ready(function() {
    
    
   
    /* Basic Google map options */
    var options = {
        center: new google.maps.LatLng(21.291982, -157.821856),
        zoom: 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: false,
        
    }

    /* Render the map */
    var map = new google.maps.Map(document.getElementById('map_canvas'), options);

    /* Create a custom map type */
    var texturedMapType = new google.maps.ImageMapType({
        getTileUrl: function(tileCoord, zoom, ownerDocument)
        {
            return 'img/textile_texture.png';
        },
        isPng: true,                    
        tileSize: new google.maps.Size(450, 332)
    });

    /* Add a new layer between the map and the markers and render tiles here */
    map.overlayMapTypes.push(null);
    map.overlayMapTypes.setAt(0, texturedMapType);
    
    /* drop location markers */
    var pinMarkerIcon = new google.maps.MarkerImage('img/pin-icon-s.png',
          new google.maps.Size(11, 22), // size
          new google.maps.Point(0,0),  // origin
          new google.maps.Point(6, 19));  // anchor
          
    /* destination markers */
    var finishMarkerIcon = new google.maps.MarkerImage('img/finish-icon-s.png',
          new google.maps.Size(22, 22), // size
          new google.maps.Point(0,0),  // origin
          new google.maps.Point(6, 19));  // anchor

    /* drop location markers */
    var postcardMarkerIcon = new google.maps.MarkerImage('img/postcard-icon-s.png',
          new google.maps.Size(24, 19), // size
          new google.maps.Point(0,0),  // origin
          new google.maps.Point(12, 9));  // anchor
          
    /* user avatar markers */
    var avatarMarkerIcon = new google.maps.MarkerImage('img/anonymous-s.jpg',
          new google.maps.Size(24, 24),  // size
          new google.maps.Point(0,0),  // origin
          new google.maps.Point(12, 12)); // anchor

    
    $.getJSON('http://pigeonmail.me/postcards/'+postcard_id+'.json', function(data) {
    	var postcard = data["postcards"];
    
        $("#title").text(postcard.title);
        
        var mapBounds = new google.maps.LatLngBounds();
        
        var coords = jQuery.map(postcard.drop_locations, function(loc, i) {
            return new google.maps.LatLng(loc.latlng.lat, loc.latlng.lng);
        });
        if(postcard.delivered) coords.splice(coords.length-1, 1);
        
        for(var i=0; i<coords.length; i++) {
            
            var marker = new google.maps.Marker({
                position: coords[i],
                map: map,
                zIndex: 2,
                icon: pinMarkerIcon
            });

            if(i>0) {
                var flightPath = new google.maps.Polyline({
                    path: [coords[i-1], coords[i]],
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    geodesic: false
                });
                flightPath.setMap(map);

                var bounds = new google.maps.LatLngBounds();
                bounds.extend(coords[i-1]);
                bounds.extend(coords[i]);
                
                mapBounds.extend(coords[i]);
                
                var userMarker = new google.maps.Marker({
                    position: bounds.getCenter(),
                    map: map,
                    zIndex: 1,
                    icon: avatarMarkerIcon
                }); 
            }
        }
        
        var finishBounds = new google.maps.LatLng(postcard.recipient.location.lat, postcard.recipient.location.lng);
        var marker = new google.maps.Marker({
            position: finishBounds,
            map: map,
            zIndex: 2,
            icon: finishMarkerIcon
        });
        mapBounds.extend(finishBounds);
        
        var postcardPosition;
        if(postcard.delivered) {
            // card is already delivered
            postcardPosition = finishBounds;
            
            var flightPath2 = new google.maps.Polyline({
                path: [coords[coords.length-1], finishBounds],
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                geodesic: false
            });
            flightPath2.setMap(map);
        
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(coords[coords.length-1]);
            bounds.extend(finishBounds);
            var userMarker = new google.maps.Marker({
                position: bounds.getCenter(),
                map: map,
                zIndex: 1,
                icon: avatarMarkerIcon
            });
            
            var postcardMarker = new google.maps.Marker({
                position: postcardPosition,
                map: map,
                zIndex: 1,
                icon: postcardMarkerIcon
            });
        } else {
            if(postcard.drop_locations[postcard.drop_locations.length-1].picker_id) {
                // someone is currently carrying the card
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(coords[coords.length-1]);
                bounds.extend(finishBounds);
                var halfway = bounds.getCenter();
                bounds = new google.maps.LatLngBounds();
                bounds.extend(coords[coords.length-1]);
                bounds.extend(halfway);
                postcardPosition = bounds.getCenter(); // quarterway to destination
            } else { 
                // no picker_id: card is still lying at the last drop location
                postcardPosition = coords[coords.length-1]
            }
        }
        
        map.fitBounds(mapBounds);
        
        
        /*
         * Helper method for pretty route descriptions
         * from: geocoding result for from location
         * to: geocoding result for to location
         * returns [from location name, to location name]
         */
        function describeRoute(from, to) {
            
            function getComponent(address, type) {
                var component = jQuery.grep(address.address_components, function(el) {
                    return (jQuery.inArray(type, el.types) > -1)
                });
                if(component.length == 0) return null;
                else return component[0].short_name;
            }
            
            var fromStreet  = getComponent(from, "route"),
                toStreet    = getComponent(to, "route"),
                fromCity    = getComponent(from, "locality"),
                toCity      = getComponent(to, "locality"),
                fromCountry = getComponent(from, "country"),
                toCountry   = getComponent(to, "country");
                
            if(fromCountry!=toCountry) 
                return [fromCity + " (" + fromCountry + ")", toCity + " (" + toCountry + ")"];
            else if(fromCity!=toCity)
                return [fromCity, toCity];
            else
                return [fromStreet, toStreet];
        }
        
        
        /*
         * latLng: latLng for reverse geocode request
         * index: the index of the li for which to update the pick address
         * (index-1: index of the li for which to update the drop address)
         */
        var geocodingResults = new Array();
        function reverseGeocode(latLng, index) {
            var geocoder = new google.maps.Geocoder();
            if(geocoder) {
               geocoder.geocode({ 'location': latLng }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                     geocodingResults[index] = results[0];
                     if(geocodingResults[index-1]) {
                         var route = describeRoute(geocodingResults[index-1], geocodingResults[index]);
                         var li = $("#travel_log ul li").eq(index-1);
                         li.find(".from").text(route[0]);
                         li.find(".to").text(route[1]);
                     }
                     if(geocodingResults[index+1]) {
                         var route = describeRoute(geocodingResults[index], geocodingResults[index+1]);
                         var li = $("#travel_log ul li").eq(index);
                          li.find(".from").text(route[0]);
                          li.find(".to").text(route[1]);
                     }
                  }
                  else {
                     console.log("Geocoding failed: " + status);
                  }
               });
            }
        };
        
        for(var i=1; i<postcard.drop_locations.length; i++) {
            var pickLoc = postcard.drop_locations[i-1],
                dropLoc = postcard.drop_locations[i];
            var pickLatLng = new google.maps.LatLng(pickLoc.latlng.lat, pickLoc.latlng.lng),
                dropLatLng = new google.maps.LatLng(dropLoc.latlng.lat, dropLoc.latlng.lng);

            reverseGeocode(pickLatLng, i-1);
                
            var li = $("<li />");
            var avatar = $('<img src="img/anonymous.jpg" class="avatar" />').attr("alt", dropLoc.dropper_username || "Anonymous");
            var title = $("<h3/>").text(dropLoc.dropper_username || "Anonymous")
            var route = $('<p class="route"><span class="from"></span><span class="to"></span></p>');
            
            var distance = $('<p class="distance" />').text(
                Math.round(google.maps.geometry.spherical.computeDistanceBetween(pickLatLng, dropLatLng)/1000) + " km"
            );
            
            li.append(avatar).append(title).append(distance).append(route);
            $("#travel_log ul").append(li);
        }
        
        reverseGeocode(dropLatLng, postcard.drop_locations.length-1);
        
        // setup scroller
        $(".nano").nanoScroller();
        
        
        
    });
    
});

