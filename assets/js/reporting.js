(function ($) {
"use strict";

	/**
	  * Using jQuery Event Handlers to look at the 'Hotspot' and 'FY' checkbox sets. Add/remove values to hotspotQueryParams array 
	**/ 

	var hotspotQueryParams = [[],[]];

	$("#hotspot").children().children().on( "change", function() {
	    if ($(this).is(":checked")) {
	    	hotspotQueryParams[0].push(this.value);
	    }
	    else {
	    	var index = hotspotQueryParams[0].indexOf(this.value);
			if (index > -1) {
				hotspotQueryParams[0].splice(index, 1);
			}
	    }
	});

	$("#FY").children().children().on( "change", function() {
	    if ($(this).is(":checked")) {
	    	hotspotQueryParams[1].push(this.value);
	    }
	    else {
	    	var index = hotspotQueryParams[1].indexOf(this.value);
			if (index > -1) {
				hotspotQueryParams[1].splice(index, 1);
			}
	    }
	});

	$("#search").on("click", function() {
		// Devel: List our query params
		// console.log(hotspotQueryParams);
		$("#ft-data").html("");
		
		var selectedHotspots = "";
		var selectedFY = "";
		
		if (hotspotQueryParams[0].length > 0) {
			selectedHotspots += "(";	
			for (var i = 0, len = hotspotQueryParams[0].length; i < len; i++) {
				selectedHotspots += "'" + hotspotQueryParams[0][i] + "',"; 
			}
			selectedHotspots = selectedHotspots.substring(0, selectedHotspots.length-1);
			selectedHotspots += ")";
		}
		else { }

		if (hotspotQueryParams[1].length > 0) {
			selectedFY += "(";
			var selectedFY = "(";
			for (var i = 0, len = hotspotQueryParams[1].length; i < len; i++) {
				selectedFY += hotspotQueryParams[1][i]; 
			}
			selectedFY = selectedFY.substring(0, selectedFY.length-1) + ")";	
		}
		else { }

		queryBuilder(selectedHotspots, selectedFY);
	})

	/**
	  * Build our query url depending on the parameters that are checked in the form
	**/

	function queryBuilder(selectedHotspots, selectedFY) {
		var hotspotsLength = selectedHotspots.length;
		var fyLength = selectedFY.length;
		
		var queryAddition;
		
		if (!(selectedHotspots) && !(selectedFY)) { //none
			queryAddition = "";
		}
		if ((selectedHotspots) && (selectedFY)) { //both
			queryAddition = " WHERE 'Hotspot' IN " + selectedHotspots + " AND 'Month' IN " + selectedFY + "";
		}
		if ((selectedHotspots) && !(selectedFY)) { //only hotspots
			queryAddition = " WHERE 'Hotspot' IN " + selectedHotspots + "";
		}
		if (!(selectedHotspots) && (selectedFY)) { //only FY
			queryAddition = " WHERE 'Month' IN " + selectedFY + "";
		}

	queryFt(queryAddition)
	}
	



	function queryFt(queryAddition) {
		var baseQuery = "SELECT 'Age', 'Tag1', 'Tag2', 'Tag3', 'Tag4' FROM " +
						"1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq";
		var query = baseQuery + queryAddition;
		var encodedQuery = encodeURIComponent(query);

		// Construct the URL
		var url = ["https://www.googleapis.com/fusiontables/v2/query"];
		url.push("?sql=" + encodedQuery);
		url.push("&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ");
		//Devel: write out query
		var queryURL = url.join('');
		var queryLink = document.getElementById('query');
		queryLink.innerHTML = "<a href=" + queryURL + ">Link to Query</a>";  
		url.push("&callback=?");
		$("#ft-data").addClass("spinning");
		$.ajax({
			url: url.join(""),
			dataType: "jsonp",
			success: function (data) {
			   uppercase(data);
			} 
		}); 
	}

function uppercase (data) {
  var data_uppercase = [];
  for (var i = 0, len = data.rows.length; i < len; i++) {
    var row = data.rows[i];
    data_uppercase.push([row[0], 
                        row[1].toUpperCase(),
                        row[2].toUpperCase(),
                        row[3].toUpperCase(),
                        row[4].toUpperCase(),
                        ]);
  }
  search(data_uppercase);
}


function search (data_uppercase) {
	var tagList = [
                    ["Job Searching",0, [["JSE!"], ["JOB!"], ["RES!"], ["APP!"], ["ENT!"], ["INT!"], ["COV!"]]],
                    ["Education", 0, [["HW!"], ["HED!"], ["ODB!"]]],
                    ["Social Networking",0,[["SNW!"]]],  
                    ["Email",0, [["EML!"]]],
                    ["General Browsing", 0, [["ADO!"], ["GAM!"], ["GDT!"], ["SRC!"]]]	,
                    ["Faxing (Other)", 0, [["FAX!"]]],
                    ["Word processing!",0,[["DOC!"]]] 
                  ]

	var totalVisits = 0;
	var taggedVisits = 0;

	for (var i = 0, len = data_uppercase.length; i < len; i++) {
	  totalVisits++;
	  var arr = data_uppercase[i];
	 
	 //Check if at least of one of our tag columns has a value and logged tag visits
	  if ( (arr[1]) || (arr[2]) || (arr[3]) || (arr[4]) ) {
	    taggedVisits++;
	  }
	  
	  //Test each row against our index and write to the array, acting as a count
	  var counter = 0;
	  for (var j=0, len2 = tagList.length; j < len2; j++) { // loop through each tag category
	  	var categoryMatch = 0;
	  	for (var k = 0, len3 = tagList[j][2].length; k < len3; k++)	{ //loop through each categorized tag
			var ref = tagList[j][2][k];
	  		if ( (arr[1].indexOf(ref) != -1) ||
	      		 (arr[2].indexOf(ref) != -1) ||
	      		 (arr[3].indexOf(ref) != -1) ||
	      		 (arr[4].indexOf(ref) != -1)
	  		 ){
		    categoryMatch++;
	  		//console.log("Row # " + i + "content: " + arr + " match with " + ref + " of " + tagList[j][0] + ", new count " + (tagList[j][1]+1));
	  		}
	      }
	      if (categoryMatch > 0) {
	      	tagList[j][1]++;
	      }
	  }
	}
	var percent = ((taggedVisits/totalVisits)*100).toFixed(2);

  console.log(tagList);
  console.log("Total Visits: " + totalVisits + "\nTagged Visits" + taggedVisits);
  writeData(tagList, totalVisits, taggedVisits, percent);

}


function writeData(tagList, totalVisits, taggedVisits, percent) {
	console.log(percent);
	$('span#totalVisits').html(totalVisits);
	$('span#taggedVisits').html(taggedVisits);
	$('span#percentTagged').html(percent+"%");



  function sortTaglist () {
    tagList.sort(function (a, b) {
      if (b[2] > a[2]) {
        return 1;
      }
      if (b[2] < a[2]) {
        return -1;
      }
      return 0;
    });
  }

  sortTaglist();	

  var ftdata = ["<table class='table table-striped'><thead><tr><th>Reporting Category</th><th>Tags</th><th>Count</th><th>%</th></tr></thead>"];
    for (var i = 0, len = tagList.length; i < len; i++) {
      var percent = ((tagList[i][2]/taggedVisits)*100).toFixed(2);
      ftdata.push("<tr>"+
                    "<td>" + tagList[i][0] + "</td>" +
                    "<td>" + tagList[i][2] + "</td>" +
                    "<td>" + tagList[i][1] + "</td>" +
                    "<td>" + (((tagList[i][1]/taggedVisits)*100).toFixed(2)) + "</td>" +
                  "</tr>");
    }
    ftdata.push("</tbody></table>");
    $("#ft-data").removeClass("spinning");
    document.getElementById("ft-data").innerHTML = ftdata.join("");
  }

})(jQuery);