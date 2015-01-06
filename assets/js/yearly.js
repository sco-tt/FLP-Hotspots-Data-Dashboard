google.load('visualization', '1');

function drawTable() {
 		// Construct query
 		//Query compnents end up in query
  var query = 'SELECT "Month", COUNT() FROM "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq GROUP BY "Month" ORDER BY "Month"';
  var queryText = encodeURIComponent(query);
  var gvizQuery = new google.visualization.Query(
    'https://www.google.com/fusiontables/gvizdata?tq='  + queryText);
    // Send query and draw table with data in response
    gvizQuery.send(function(response) {
      var numRows = response.getDataTable().getNumberOfRows();
      var numCols = response.getDataTable().getNumberOfColumns();
      var ftdata = ['<table class="table table-striped"><thead><tr>'];
      var sum = 0;
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
    sum += rowValue;
      //console.log("pass # " + i + " is " + rowValue + ", sum is " + sum);
    ftdata.push('</tr>');
    }
    ftdata.push('</tbody></table>');
    document.getElementById('yearlyTotal').innerHTML = "2014 Yearly Total: " + sum;  
    document.getElementById('ft-data').innerHTML = ftdata.join('');
  });
     //Call the chart
  drawVisualization(); 
}
function drawVisualization( monthName) {
  var query = 'SELECT "Month", COUNT() FROM "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq GROUP BY "Month" ORDER BY "Month"';

    google.visualization.drawChart({
      containerId: 'visualization',
      dataSourceUrl: 'https://www.google.com/fusiontables/gvizdata?tq=',
      query: query,
      chartType: 'LineChart',
      options: {
          label: '# of Visits',
          title: 'Hotspot Usage in 2014',
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