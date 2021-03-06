google.load('visualization', '1',{ packages: ['corechart'] });
  function drawTable() {
   // Construct query
   //Query compnents end up in query
   var query;
   var baseQuery = 'SELECT "Hotspot", COUNT() FROM "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq"';
var orderPref = document.getElementById('orderPref').value;
var month = document.getElementById('month');
var monthValue = month.value;
var monthName = month[month.selectedIndex].innerHTML;
      //console.log("Month name is " + monthName);
      var queryAddition;
      if (month) {
          queryAddition = " WHERE 'Month' = '" + monthValue + "'" + " GROUP BY 'Hotspot'";
      }
      if (orderPref) {
          queryAddition +=  "ORDER BY " + orderPref;
      }
    var query = baseQuery + queryAddition;
    var queryText = encodeURIComponent(query);
    var gvizQuery = new google.visualization.Query(
        'https://www.google.com/fusiontables/gvizdata?tq='  + queryText);

    // Send query and draw table with data in response
    gvizQuery.send(function(response) {
      var numRows = response.getDataTable().getNumberOfRows();
      var numCols = response.getDataTable().getNumberOfColumns();
console.log(numCols);
      var ftdata = ['<table><thead><tr>'];
      for (var i = 1; i < numCols; i++) {
        ftdata.push('<th>' + 'Hotspot' + '</th>' + '<th>' + 'Patron Count' + '</th>');
      }
      ftdata.push('</tr></thead><tbody>');

      for (var i = 0; i < numRows; i++) {
        ftdata.push('<tr>');
        for(var j = 0; j < numCols; j++) {
          var rowValue = response.getDataTable().getValue(i, j);
          ftdata.push('<td>' + rowValue + '</td>'); 
        }
         ftdata.push('</tr>');
      }
      ftdata.push('</tbody></table>');
      document.getElementById('ft-data').innerHTML = ftdata.join('');
    });   
    //Call the chart
   drawVisualization(query, monthName); 
  }

 function drawVisualization(query, monthName) {
        google.visualization.drawChart({
          containerId: 'visualization',
          dataSourceUrl: 'http://www.google.com/fusiontables/gvizdata?tq=',
          query: query,
          chartType: 'BarChart',
          options: {
              label: '# of Visits',
              title: 'Hotspot Usage in ' + monthName + ' 2014',
            vAxis: {
              title: 'Hotspot'
            },
            hAxis: {
              title: 'Patron visits'
            }
          }
        });
      }

  google.setOnLoadCallback(drawTable);     