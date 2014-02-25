/*****************************************************
Interactive Campus Map Geog 790 Project Spring 2013
Grant Herbert
*****************************************************/
//globals
var map;
var feature;
var iMarker; //icon marker
var pMarker; //point marker
var popupText;
var markerArray = []; //array to handle multiple returns
var markerLayer;
var inputBoxID = "searchNIU";

function initmap() {
	var BVersion = IEBrowser.Version();
	if (BVersion < 10) {
		alert("You need IE 10, or the latest Chrome or Firefox for this page");
		hideElem("searchNIU");
		hideElem("btnOSMAPI");
		hideElem("btnShowAll");
		hideElem("btnClearAll");
		document.getElementById("results").innerHTML = "Sorry, you need IE10 or the latest versions of Chrome or Firefox to use this site.<br><br>You are using <strong>IE" + BVersion + "</strong> (or maybe your IE browser is using compatibility view).<br><br>In the meantime here is a map of the NIU Campus.";
		createMap();
	} else {
		createMap();
		getStarted();
	}
}

function createMap() {	
	// Map uses lat/long - NIU 41.936,-88.773
	map = L.map('map').setView([41.936,-88.773], 15);
	
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Nominatim Search Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>, Data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'				
	}).addTo(map);
	
	var overlayOSM = L.geoJson(testNIUJSON, {style: osmJsonStyle, onEachFeature: addPopupContent}).addTo(map);
	
	//remove default zoom control and add new one in better position
	map.zoomControl.removeFrom(map); 
	var newZoom = L.control.zoom({position: 'topright'}); 
	map.addControl(newZoom);

	//zoom event listener
	map.on( "zoomend", function( e ) {
		checkZoom();
	});
}
function getStarted () {
	jQuery("#searchNIU").keydown( function() {
		testKeyPress(event); //bind keydown event
	});
	//hide buttons until needed
	hideElem("btnShowAll");
	hideElem("btnClearAll");
	document.getElementById("searchNIU").focus();
}

// IE browser version check from http://obvcode.blogspot.com/2007/11/easiest-way-to-check-ie-version-with.html
var IEBrowser = {
  Version: function() {
    var version = 999; // we assume a sane browser
    if (navigator.appVersion.indexOf("MSIE") != -1)
      // bah, IE again, lets downgrade version number
      version = parseFloat(navigator.appVersion.split("MSIE")[1]);
    return version;
  }
}

/*** code for OSM geoJSON layer ***/
function osmJsonStyle(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: '#82716B',
		dashArray: '2',
		fillColor: '#82716B',
		fillOpacity: 0.2
	};
}
//adds a popup for geoJSON features
function addPopupContent(feature, layer) {
	// does this feature have a property named popupContent?
	if (feature.properties && feature.properties.popupContent) {
		layer.bindPopup(feature.properties.popupContent);
	} else if (feature.properties && feature.properties.name){
		var popupContent = 'Name: ' + feature.properties.name;
		if (feature.properties.tags) {
			//need to dig out the tag content, is all in feature.properties.tag as string, delimited by ',' or ';;' and all wrapped in strings
			var wArray = feature.properties.tags.split(",");
			var tagString = getContentFromJSON(wArray);
			if (tagString != "" ){ 
				popupContent = popupContent + '<br>' + tagString;
			}
		}
		layer.bindPopup(popupContent);
	}	
}

//grab name and alternative names from tags for geoJSON popup
function getContentFromJSON(wArray) {
var index, value;
var result = "";
for (i = 0; i < wArray.length; ++i) {
    value = wArray[i];
    if (value.substring(1, 9) === "alt_name") {
		result = '<em>also</em><br>';
        var len = value.length;
		value = value.substring(11, len);
		var valArray = value.split(";;");
		jQuery.each(valArray, function(idx, v) {
			v = v.replace(/"/g, ''); //global strip extra quotes
			v = v.trim();
			if (v != "") {
				result = result  + ' - ' +v + '<br>';
			}
		});
    }
}
return result; //will be "" or a string value
}

/*************** autocomplete function (requires jquery) ****/
//Future: remove hardcoded list and import list from text
//create category list from jQuery example
jQuery.widget( "custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      jQuery.each( items, function( index, item ) {
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        that._renderItemData( ul, item );
      });
    }
});
	
jQuery(function() {
	var availableTags = [
	/* building names */
	{label: "Adams Hall", category : "Buildings"},
	{label: "Altgeld Hall", category : "Buildings"},
	{label: "Anderson Hall", category : "Buildings"},
	{label: "Barsema Alumni & Visitors Center", category : "Buildings"},
	{label: "Barsema Hall", category : "Buildings"},
	{label: "Campus Life", category : "Buildings"},
	{label: "Center for Black Studies", category : "Buildings"},
	{label: "Center for Diversity Resources", category : "Buildings"},
	{label: "Center for the Study of Family Violence and Sexual Assault", category : "Buildings"},
	{label: "Child Care Center", category : "Buildings"},
	{label: "Cole Hall", category : "Buildings"},
	{label: "Convocation Center", category : "Buildings"},
	{label: "Davis Hall", category : "Buildings"},
	{label: "Dorland Building", category : "Buildings"},
	{label: "Douglas Hall", category : "Buildings"},
	{label: "DuSable Hall", category : "Buildings"},
	{label: "East Heating Plant", category : "Buildings"},
	{label: "Engineering Building", category : "Buildings"},
	{label: "Evans Field House", category : "Buildings"},
	{label: "Faraday Hall", category : "Buildings"},
	{label: "Founders Memorial Library", category : "Buildings"},
	{label: "Founders Café", category : "Buildings"},
	{label: "Gabel Hall", category : "Buildings"},
	{label: "Gilbert Hall", category : "Buildings"},
	{label: "Graham Hall", category : "Buildings"},
	{label: "Grant Towers North", category : "Buildings"},
	{label: "Grant Towers South", category : "Buildings"},
	{label: "Greenhouse", category : "Buildings"},
	{label: "Health Service Center", category : "Buildings"},
	{label: "Holmes Student Center", category : "Buildings"},
	{label: "Huskie Stadium", category : "Buildings"},
	{label: "La Tourette Hall", category : "Buildings"},
	{label: "Lincoln Hall", category : "Buildings"},
	{label: "Lowden Hall", category : "Buildings"},
	{label: "McMurry Hall", category : "Buildings"},
	{label: "Montgomery Hall", category : "Buildings"},
	{label: "Music Building", category : "Buildings"},
	{label: "Neptune Central", category : "Buildings"},
	{label: "Neptune East", category : "Buildings"},
	{label: "Neptune North", category : "Buildings"},
	{label: "Neptune West", category : "Buildings"},
	{label: "Northern View Community", category : "Buildings"},
	{label: "Parking Garage", category: "Parking"},
	{label: "Physical Plant", category : "Buildings"},
	{label: "Psychology/Computer Science", category : "Buildings"},
	{label: "Public Safety", category : "Buildings"},
	{label: "Reavis Hall", category : "Buildings"},
	{label: "Recreation Center", category : "Buildings"},
	{label: "Software Implementation Center", category : "Buildings"},
	{label: "Speech & Hearing Clinic", category : "Buildings"},
	{label: "Stevens Annex", category : "Buildings"},
	{label: "Stevens Building", category : "Buildings"},
	{label: "Stevenson Towers North", category : "Buildings"},
	{label: "Stevenson Towers South", category : "Buildings"},
	{label: "Still Gym", category : "Buildings"},
	{label: "Still Hall", category : "Buildings"},
	{label: "Swen Parson", category : "Buildings"},
	{label: "Telephone & Security Building", category : "Buildings"},
	{label: "Television Center", category : "Buildings"},
	{label: "University Apartments", category : "Buildings"},
	{label: "Visual Arts Building", category : "Buildings"},
	{label: "Watson Hall", category : "Buildings"},
	{label: "West Heating Plant", category : "Buildings"},
	{label: "Williston Hall", category : "Buildings"},
	{label: "Wirtz Hall", category : "Buildings"},
	{label: "Women’s Resources", category : "Buildings"},
	{label: "Yordon Academic and Athletic Performance Center", category : "Buildings"},
	{label: "Zeke Giorgi Law Clinic", category : "Buildings"},
	{label: "Zulauf Hall", category : "Buildings"},

	/* department names */
	{label: "Accountancy Department", category : "Departments"},
	{label: "Allied Health & Communicative Disorders Department", category : "Departments"},
	{label: "Anthropology Department", category : "Departments"},
	{label: "Art Department", category : "Departments"},
	{label: "Biological Sciences  Department", category : "Departments"},
	{label: "Chemistry and Biochemistry Department", category : "Departments"},
	{label: "Communication Department", category : "Departments"},
	{label: "Computer Science Department", category : "Departments"},
	{label: "Counseling, Adult and Higher Education Department", category : "Departments"},
	{label: "Economics Department", category : "Departments"},
	{label: "Educational Technology, Research and Assessment Department", category : "Departments"},
	{label: "Electrical Engineering Department", category : "Departments"},
	{label: "English Department", category : "Departments"},
	{label: "Environmental Studies Department", category : "Departments"},
	{label: "Family, Consumer and Nutrition Sciences Department", category : "Departments"},
	{label: "Finance Department", category : "Departments"},
	{label: "Foreign Languages and Literatures Department", category : "Departments"},
	{label: "Geography Department", category : "Departments"},
	{label: "Geology and Environmental Geosciences Department", category : "Departments"},
	{label: "History Department", category : "Departments"},
	{label: "Industrial and Systems Engineering Department", category : "Departments"},
	{label: "Kinesiology and Physical Education Department", category : "Departments"},
	{label: "Leadership, Educational Psychology and Foundations Department", category : "Departments"},
	{label: "Literacy Education Department", category : "Departments"},
	{label: "Management Department", category : "Departments"},
	{label: "Marketing Department", category : "Departments"},
	{label: "Mathematical Sciences Department", category : "Departments"},
	{label: "Mechanical Engineering Department", category : "Departments"},
	{label: "Military Science Department", category : "Departments"},
	{label: "Music Department", category : "Departments"},
	{label: "Nursing and Health Studies Department", category : "Departments"},
	{label: "Operations Management and Information Systems Department", category : "Departments"},
	{label: "Philosophy Department", category : "Departments"},
	{label: "Physics Department", category : "Departments"},
	{label: "Political Science Department", category : "Departments"},
	{label: "Psychology Department", category : "Departments"},
	{label: "Public Administration Department", category : "Departments"},
	{label: "Sociology Department", category : "Departments"},
	{label: "Special and Early Education Department", category : "Departments"},
	{label: "Statistics Department", category : "Departments"},
	{label: "Technology Department", category : "Departments"},
	{label: "Theatre and Dance Department", category : "Departments"},

	/*parking types*/
	{label: "Blue Parking", category: "Parking"},
	{label: "Brown Parking", category: "Parking"},
	{label: "Green Parking", category: "Parking"},
	{label: "Orange Parking", category: "Parking"},
	{label: "Purple Parking", category: "Parking"},
	{label: "Yellow Parking", category: "Parking"},
	{label: "Faculty Parking", category: "Parking"},
	{label: "Staff Parking", category: "Parking"},
	{label: "Student Commuter Parking", category: "Parking"},
	{label: "Resident Student Parking", category: "Parking"},
	{label: "DeKalb Resident Parking", category: "Parking"},
	{label: "Remote Parking", category: "Parking"},
	{label: "Motorcycle Parking", category: "Parking"},
	/* parking lots etc*/
	{label: "Parking Garage", category: "Parking"},
	{label: "Event Parking ", category : "Parking"},
	{label: "Event Parking", category: "Parking"},
	{label: "Event Parking C1", category : "Parking"},
	{label: "Event Parking Lot C2", category : "Parking"},
	{label: "OD Parking Lot", category : "Parking"},
	{label: "Parking Lot 10", category : "Parking"},
	{label: "Parking Lot 11", category : "Parking"},
	{label: "Parking Lot 12", category : "Parking"},
	{label: "Parking Lot 15E", category : "Parking"},
	{label: "Parking Lot 2", category : "Parking"},
	{label: "Parking Lot 20", category : "Parking"},
	{label: "Parking Lot 21 ", category : "Parking"},
	{label: "Parking Lot 23", category : "Parking"},
	{label: "Parking Lot 24", category : "Parking"},
	{label: "Parking Lot 25", category : "Parking"},
	{label: "Parking Lot 26D", category : "Parking"},
	{label: "Parking Lot 26S", category : "Parking"},
	{label: "Parking Lot 26W", category : "Parking"},
	{label: "Parking Lot 27", category : "Parking"},
	{label: "Parking Lot 27D", category : "Parking"},
	{label: "Parking Lot 27S", category : "Parking"},
	{label: "Parking Lot 29 ", category : "Parking"},
	{label: "Parking Lot 29D", category : "Parking"},
	{label: "Parking Lot 30D", category : "Parking"},
	{label: "Parking Lot 31 ", category : "Parking"},
	{label: "Parking Lot 31A", category : "Parking"},
	{label: "Parking Lot 31B", category : "Parking"},
	{label: "Parking Lot 32", category : "Parking"},
	{label: "Parking Lot 35", category : "Parking"},
	{label: "Parking Lot 36", category : "Parking"},
	{label: "Parking Lot 38", category : "Parking"},
	{label: "Parking Lot 39 ", category : "Parking"},
	{label: "Parking Lot 40", category : "Parking"},
	{label: "Parking Lot 43", category : "Parking"},
	{label: "Parking Lot 44", category : "Parking"},
	{label: "Parking Lot 44A", category : "Parking"},
	{label: "Parking Lot 45", category : "Parking"},
	{label: "Parking Lot 48", category : "Parking"},
	{label: "Parking Lot 49", category : "Parking"},
	{label: "Parking Lot 9", category : "Parking"},
	{label: "Parking Lot A", category : "Parking"},
	{label: "Parking Lot B", category : "Parking"},
	{label: "Parking Lot C", category : "Parking"},
	{label: "Parking Lot C3", category : "Parking"},
	{label: "Parking Lot C3 3/4", category : "Parking"},
	{label: "Parking Lot C4 ", category : "Parking"},
	{label: "Parking Lot E", category : "Parking"},
	{label: "Parking Lot H ", category : "Parking"},
	{label: "Parking Lot L", category : "Parking"},
	{label: "Parking Lot M1", category : "Parking"},
	{label: "Parking Lot M12", category : "Parking"},
	{label: "Parking Lot M4", category : "Parking"},
	{label: "Parking Lot M5", category : "Parking"},
	{label: "Parking Lot M6 ", category : "Parking"},
	{label: "Parking Lot NV", category : "Parking"},
	{label: "Parking Lot O ", category : "Parking"},
	{label: "Parking Lot P", category : "Parking"},
	{label: "Parking Lot PS", category : "Parking"},
	{label: "Parking Lot S", category : "Parking"},
	{label: "Parking Lot T", category : "Parking"},
	{label: "Parking Lot V", category : "Parking"},
	{label: "Parking Lot W", category : "Parking"},
	{label: "Parking Lot X", category : "Parking"},
	{label: "Visitor Pay Parking Lot", category : "Parking"},
	
	/* Sports fields*/
	{label: "Huskie Indoor Training Center", category : "Sports"},
	{label: "Outdoor Recreation Sport Complex", category : "Sports"},
	{label: "NIU Track and Field", category : "Sports"},
	{label: "Brigham Field", category : "Sports"},
	{label: "Tennis Courts", category : "Sports"},
	{label: "NIU Soccer Field", category : "Sports"},

	/* other */
	{label: "Gabel Pool", category: ""},
	{label: "Law Library", category: ""},
	{label: "Financial Aid Office", category: ""},
	{label: "Bursars Office", category: ""},
	{label: "Student Employment Office", category: ""},
	{label: "Admissions Office", category: ""},
	{label: "Undergraduate Admissions Office", category: ""},
	{label: "International Students Office", category: ""},
	{label: "Office of Registration and Records", category: ""},
	{label: "Study Abroad", category: ""},
	{label: "Holmes Student Center Hotel", category: ""},
	{label: "University Bookstore", category: ""},
	{label: "Ombudsman", category: ""},
	{label: "East Lagoon", category: ""},
	{label: "Lorusso Lagoon", category: ""},
	/*Food*/
	{label: "Huskie Den", category: "Food"},
	{label: "Blackhawk Dining Center", category: "Food"},
	{label: "Huskie Hub", category: "Food"},
	{label: "Subway", category: "Food"}
	
	];
	
	//autocomplete using category (above this function)
	jQuery( "#searchNIU" ).catcomplete({
      source: availableTags,
	  delay: 0,
	  minLength: 1
 	});
	  
});
/*** end autocomplete function ****/


//usage: <input onkeypress="testKeyPress(event, 'buttonID')">
function testKeyPress(event) {
	//console.log(event.keyCode);
	//expects the event plus a string representing the button id to trigger if true
	// note, this code does not prevent the enter key from triggering a submit if a form exists on the page
	var ENTERKEY = 13;
	var TABKEY = 9;
	
	if (event.keyCode == ENTERKEY) {
		eventKeyEnter();
	}
	if (event.keyCode == TABKEY) {
		if (event.preventDefault) { 
			event.preventDefault(); 
		} else { 
			event.returnValue = false; //IE workaround
		}
		grabFirstVal($('ul'));
	}
}

function eventKeyEnter() {
    hideElem("btnShowAll");
	jQuery('#searchNIU').catcomplete('close');
	searchOSM();
}
function grabFirstVal(ul) {
	//gets the FIRST value in the list to populate searchbox, fires enter event
    hideElem("btnShowAll");
	var listItem = $('li.ui-menu-item:first')[0];
	if (typeof(listItem) == "undefined") {
		resetInputBox("searchNIU");
	} else {
		if (listItem.childNodes[0].text) {
		this.value = listItem.childNodes[0].text;
		} else { 
		this.value = listItem.childNodes[0].innerText; //shitty IE workaround
		}
		if (event.preventDefault) { 
			event.preventDefault(); 
		} else { 
			event.returnValue = false; //IE workaround
		}
		document.getElementById("searchNIU").value = this.value;
		jQuery('#searchNIU').catcomplete('close');
		searchOSM(); 
	}
}


/**** search the OSM data using NOMINATIM API or the MapQuest version.
modified: code originally from https://github.com/derickr/osm-tools/tree/master/leaflet-nominatim-example
OSM nominatum api has limits, MapQuest is more forgiving
*****/
function searchOSM() {
	value = document.getElementById("searchNIU").value;	
	if (value == "" || typeof(value) == "undefined") {
		resetInputBox("searchNIU");
	} else {
		clearMap();
		clearHTML();
		
		//return a JSON object
		var strAPI = "https://open.mapquestapi.com/nominatim/v1/search?&format=json";
		var query = "&q=" + encodeURIComponent(value);
		//viewbox format left, top, right, bottom
		var viewbox = "&viewbox=-88.756,41.948,-88.799,41.930&bounded=1";
		var poly = "&polygon=1";
		var addrDet = "&addressdetails=1";
        var limit = "&limit=100"; //limit number of returns
		var strSearch = strAPI+query+viewbox+poly+addrDet+limit;
		var strPoly = "";
        var arrayPoly = [];
        var items = []; 
        markerArray = [];
		//call string, read in json results.  jQuery getJSON not good with IE
        jQuery.support.cors = true;
        jQuery.ajax({
            url: strSearch,
            cache: false,
            dataType: "json",
            success: function(data) {
                jQuery.each(data, function(key, val) {
                //only want ways, not nodes
                if (val.osm_type == "way") {
                    osmID = val.osm_id;
                    strPoly = "";
                    arrayPoly = [];
                                
                    var polyOutline_temp2 = [];
                    if (val.polygonpoints) {
                    var polyOutline_temp = val.polygonpoints; 
                    
                    
                    //polyOutline_temp object is [lng, lat] format but leaflet expects [lat, lng] so switch them, build the string [[lat, lng],[lat,lng]]to pass to displaySelection
                    for (var i = 0; i < polyOutline_temp.length; i++) {
                        polyOutline_temp2[i] = polyOutline_temp[i].reverse().join(); //reverse them and join them together for the hyperlink string
                        strPoly = strPoly + "[" + polyOutline_temp2[i].toString() + "]"; 
                        if (i < (polyOutline_temp.length - 1)) {
                            strPoly = strPoly + ","; 
                            }
                        //arrayPoly is used for direct call (if only one item found)
                        arrayPoly[i] = polyOutline_temp[i]; 
                        arrayPoly[i][0] = parseFloat(polyOutline_temp[i][0]); //convert subarray values
                        arrayPoly[i][1] = parseFloat(polyOutline_temp[i][1]); 
                    }
                    } else {
                    //val doesn't have polygonpoints, treat as single point, duplicate the lat long and treat as zero length line
                        strPoly = "[" + val.lat + ", " + val.lon + "], [" + val.lat + ", " + val.lon + "]";
                        arrayPoly[0] = [parseFloat(val.lat), parseFloat(val.lon)];
                        arrayPoly[1] = [parseFloat(val.lat), parseFloat(val.lon)];
                    }
                    //build the link 
                    var str = "<li><a href='#' onclick='displaySelection([" + strPoly + "]" + ", \"" + osmID + "\");return false;'>" + val.display_name.split(",",1) + ", " + val.address.road + '</a></li>'
                    items.push(str);
                    
                    var arrayPoly2 = []; //need to leave arrayPoly alone
                    var len = arrayPoly.length;
                    arrayPoly2.push(arrayPoly);
                    arrayPoly2[len] = val.display_name.split(",",3).toString(); //insert name as last item in array for popup
                    markerArray.push(arrayPoly2); 
                }
            });
                
                jQuery('#about').empty()
                jQuery('#results').empty(); 
                jQuery('#resultText').empty(); 
                var numResults = items.length;
                if (numResults == 1) {
                    //jump straight to the item
                    displaySelection(arrayPoly, osmID);	
                } else if (numResults > 1) {			
                    $('<p>', { html: numResults + " results found for <i>" + "\"" + value + "\"</i>:" }).appendTo('#resultText');
                    $('<ul/>', { 'class': 'result-list', html: items.join('')}).appendTo('#results');
                    showElem("btnShowAll");
                    showElem("btnClearAll");
                } else {
                    $('<p>', { html: "No results found for <i>" + "\"" + value + "\"</i>" }).appendTo('#results');
                }
                
                resetInputBox("searchNIU");
            },
            error: function (request, status, error) { 
                alert(status + ", " + error); 
                }
        });
    }
}

function getOSMObj(osmID, center) {
	// use overpassAPI to extract JSON object
	// using osm_ID to get just one result
	// escape codes ':' %3A ';' %3B '[' %5B ']' %5D 
	
	if(osmID !== "") {
		//either overpass API will work
		var overpassAPI = "http://overpass-api.de/api/interpreter?data="; //germany
 		//var overpassAPI = "http://overpass.osm.rambler.ru/cgi/interpreter?data="; //russia
		var type = "%5Bout%3Ajson%5D%3Bway("; //json output, only returning ways
		var close = ")%3Bout%3B";
		var overpassJSON = overpassAPI + type + osmID + close;
		
		popupText = "";
		var items = []; //array of items to add to html about area
		var osmKV = []; //OSM key value pairs
		//get the object (in json) back from overpass, skipping the node ids and going for tags
		jQuery.getJSON(overpassJSON, function(data) {
			osmKV = data.elements[0].tags;
			
			jQuery.each(osmKV, function(key, val) { 
			/*  example tags
				"Wifi": "Yes",
				"addr:housename": "Davis Hall",
				"addr:housenumber": "312",
				"addr:postcode": "60115",
				"addr:street": "Normal Road",
				"alt_name": "Geography Department; Meteorology Department;",
				"amenity": "university",
				"building": "public",
				"name": "Davis Hall",
				"url": "www.niu.edu/geog/; www.niu.edu/geology/",
				"website": "www.niu.edu",
				"abstract": "some text"
				gnis:
				*/
			var str = "";
			switch (key) {
			case "name":
				osmName = val; //for about list
				if (osmName == "") {
					osmName = "Selection";
					}
				break;
			case "abstract": 
				//fallthrough
			case "description": 
				str = str + '<li><em>' + val + '</em></li>';
				break;
			case "alt_name":
				key = "Contains";
				var valArray = val.split(";");
				jQuery.each(valArray, function(idx, v) {
					v = v.trim();
					if (v.length > 0) {
						str = str + '<li><em>' + key + '</em>: ' + v + '</a></li>';
					}
				});
				break;
			case "url":
				//fallthrough
			case "website":
                // make clickable
				var valArray = val.split(";");
				jQuery.each(valArray, function(idx, v) {
					v = v.trim();
					if (v.substring(0, 3) == "www") {
						str = str + '<li>' + key + ': <a href="http://' + v + '" target=_"blank">' + v + '</a></li>';
					} else if (v.substring(0, 4) == "http") {
						str = str + '<li>' + key + ': <a href="' + v + '" target=_"blank">' + v + '</a></li>';
					}
				});
				break;
			//simple cases
			case "old_name":
				//fallthrough
			case "wifi":
				str = str + '<li>' + key + ': ' + val + '</li>';
				break;
			default:
				//all other values
				str = "ignore";
				break;
			}
			
			if (str != "ignore") {
				items.push(str);
				popupText = popupText + str;
			}
			});
		
		jQuery('#about').empty(); //clear html element. 
		if (items.length > 0) {			
			$('<p>', { html: "<strong>" + osmName + "<strong>:" }).appendTo('#about');
			$('<ul/>', { 'class': 'about-list', html: items.join('')}).appendTo('#about');
			
		} else {
			$('<p>', { html: "No information available" }).appendTo('#about');
		}	
		//add the markers
		addPointMarker(center); 
		addIconMarker(center);
		showElem("btnClearAll");
		});
	} else { alert("no osmID passed in");
	}
	
}

//zoom marker management. Turn specific markers on and off depending on zoom level
function checkZoom() {
	zoom = map.getZoom( );
		//18 is the closest zoom level
		if ( zoom <= 16 ) {
			if (iMarker && pMarker) {
				map.removeLayer(iMarker); //remove icon marker
				map.addLayer(pMarker); //add point marker
			}
		} else {
			if (pMarker && iMarker) {
				map.removeLayer(pMarker); 
				map.addLayer(iMarker); 
				}
		}
}

//add a point marker with popup info (only used for higher zoom levels)
function addPointMarker(center) {
	if (pMarker) {
		map.removeLayer(pMarker);
	}
	pMarker = L.marker(center).addTo(map);
	pMarker.bindPopup(popupText);
	checkZoom();
}

//add marker using an image icon
function addIconMarker(center) {
	if (iMarker) {
		map.removeLayer(iMarker);
	}
	var imgIcon = L.icon({
		/* iconUrl: 'images/circle1t50.png', */
		iconUrl: 'images/animatedCircle.gif',
		iconSize: [143, 193] //size in pixels. Can we resize this on the fly depending on bbox?
		});
	iMarker = L.marker(center, {icon: imgIcon});
	iMarker.setOpacity(0.5);
	iMarker.addTo(map);
	iMarker.bindPopup(popupText);
	checkZoom();
}


//use polygon outline to highlight building/way
function displaySelection(polyRep, osmID) {
	clearMap();
	feature = L.polyline( polyRep, {color: '#82716B', weight: 2, opacity: 0.8, fill: false, clickable: true}).addTo(map); 
	//get bounds and center
	var fBounds = new L.LatLngBounds(polyRep);
	var center = fBounds.getCenter();
	
	//get the osm details, create popup
	getOSMObj(osmID, center); 
	
	map.fitBounds(polyRep);
	polyRep = null;
}

function showAllResultsOnMap() {
	makeMarkerArray(markerArray);
}

function makeMarkerArray(markerArray) {
	//go through the results list and add a marker for the centre of each point and zoom to fit the bounds of all. 
	clearMap();	
	markerLayer = new L.FeatureGroup;
	for (var i = 0; i < markerArray.length; i++) {
		var mArray = [];
		mArray = markerArray[i];
		var strPop = mArray[mArray.length-1]; //for popup
		mArray = mArray[0];
		var pBounds = new L.LatLngBounds(mArray);
		var center = pBounds.getCenter();
		var marker = L.marker(center).bindPopup(strPop);
		marker.addTo(markerLayer);
	}
	markerLayer.addTo(map);
	
	var bounds = markerLayer.getBounds();
	map.fitBounds(bounds);
}


//hide or show HTML element, pass in id value
function hideElem(btnID) {
	this.document.getElementById(btnID).style.visibility = 'hidden';
}
 function showElem(btnID) {
	this.document.getElementById(btnID).style.visibility = 'visible';
}

function resetInputBox(elementID) {
	document.getElementById("searchNIU").value = document.getElementById("searchNIU").defaultValue;
}

function clearAll() {
    clearMap();
    clearHTML();
    document.getElementById("searchNIU").focus();
}
//clear all markers from the map
function clearMap() {
	if (iMarker) {
		iMarker.closePopup();
		map.removeLayer(iMarker); //remove icon marker
	}
	if (pMarker) {
		pMarker.closePopup();
		map.removeLayer(pMarker); //remove icon marker
	}
	if (feature) {
		map.removeLayer(feature);
	}
	if (markerLayer) {
		map.removeLayer(markerLayer);
	}
}

function clearHTML() {
	jQuery('#about').empty(); //clear html element. 
	jQuery('#results').empty(); //clear html element. 
    jQuery('#resultText').empty(); //clear html element. 
}
