(function ($) {
"use strict";

google.load("visualization", "1");

function drawTable() {
  var year = document.getElementById("year").value;
  console.log(year);
 		// Construct query
 		//Query compnents end up in query
  var basequery = 'SELECT "Month", COUNT() FROM "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq"';
  if (year) {
    var yearToggle = 'WHERE "Year" = ' + year + '"'; 
  }
  else {
    yearToggle = '';
  }

  var queryOrder = 'GROUP BY "Month" ORDER BY "Month"';
  var query = basequery + yearToggle + queryOrder;
  var queryText = encodeURIComponent(query);
  var gvizQuery = new google.visualization.Query(
    "https://www.google.com/fusiontables/gvizdata?tq="  + queryText);
    // Send query and draw table with data in response
    gvizQuery.send(function(response) {
      var numRows = response.getDataTable().getNumberOfRows();
      var numCols = response.getDataTable().getNumberOfColumns();
      var ftdata = ["<table class='table table-striped'><thead><tr>"];
      var sum = 0;
    /** 
      * Build the table
    **/
    for (var i = 1; i < numCols; i++) {
      ftdata.push("<th>" + "Hotspot" + "</th>" + "<th>" + "Patron Count" + "</th>");
    }
    ftdata.push("</tr></thead><tbody>");

    for (i = 0; i < numRows; i++) {
      ftdata.push("<tr>");
          var rowValue;
          for(var j = 0; j < numCols; j++) {
            rowValue = response.getDataTable().getValue(i, j);
            ftdata.push("<td>" + rowValue + "</td>");
          }
      sum += rowValue;
      ftdata.push("</tr>");
    }

    ftdata.push("</tbody></table>");
    
    document.getElementById("yearlyTotal").innerHTML = year + " Yearly Total: " + sum;  
    document.getElementById("ft-data").innerHTML = ftdata.join("");
  });
  drawVisualization(query, year); 
}
function drawVisualization(query) {
    google.visualization.drawChart({
      containerId: "visualization",
      dataSourceUrl: "https://www.google.com/fusiontables/gvizdata?tq=",
      query: query,
      chartType: "LineChart",
      options: {
          label: "# of Visits",
          title: "Hotspot Usage by Month",
        vAxis: {
          title: "Hotspot"
        },
        hAxis: {
          title: "Patron visits"
        }
      }
    });
  }

google.setOnLoadCallback(drawTable);  

$(".selectors").change( function () {
  drawTable();
});

})(jQuery);