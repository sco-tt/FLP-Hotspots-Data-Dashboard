
  google.load("visualization", "1", {packages: ["corechart"]});
     function initialize() {
        var query = "SELECT 'Month', 'Date', COUNT (), 'Hotspot' FROM " +
                    "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq GROUP BY 'Month', 'Date', 'Hotspot'";
        var encodedQuery = encodeURIComponent(query);

        // Construct the URL
        var url = ['https://www.googleapis.com/fusiontables/v2/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
        var queryURL = url.join('');
            url.push('&callback=?');


        // Send the JSONP request using jQuery
        $.ajax({
          url: url.join(''),
          dataType: 'jsonp',
          success: function (data) {
            var rows = data['rows'];
            var monthArray = [ 
                [    
                     'Month',  
                     '01 - January',
                     '02 - February',
                     '03 - March',
                     '04 - April',
                     '05 - May',
                     '06 - Jun',
                     '07 - Jul',
                     '08 - Aug',
                     '09 - Sep',
                     '10 - Oct',
                     '11 - Nov', 
                     '12 - Dec'
                ],
                
                [
                    'Open Days'
                    
                ], 
                
                ['Sites Active', 
                    10, /** Jan **/
                    9, /** Feb **/ /**Jec was closed **/
                    9, /** Mar **/ /** Idaay was closed **/
                    9, /** Apr **/ /**HH was closed**/
                    10, /** May **/
                    10, /** Jun **/
                    9, /** Jul -- wol?? **/ /**VOAH was closed **/
                    10, /** Aug **/
                    10, /** Sept **/
                    10, /** Oct **/
                    9,  /** Nov **/
                    8, /**Dec**/              
                ]
            ];  
            var finalArray = [ ["Month"], ["Total Visits"], ["# of Sites Open*"], ["Open Days"], ["Avg Visits per Site"] ];
                for (var i = 1; i < monthArray[0].length; i++) {
                    
                    var openDays = 0;
                    var monthCount = 0;
                    var visitorsPerday = 0;

                  for (var j in rows) {
                        var month = rows[j][0];
                        var date = rows[j][1];
                        var count = rows[j][2];
                        if (month == monthArray[0][i]) {
                            if (date !== "") {
                                openDays++;
                            }
                            monthCount += Number(count);

                        }
                     }
                     visitorsPerday = Number((monthCount/monthArray[2][i]).toFixed(2,2));
                     finalArray[0].push(monthArray[0][i]);
                     finalArray[1].push(Number(monthCount));
                     finalArray[2].push(monthArray[2][i]);
                     finalArray[3].push(openDays);
                     finalArray[4].push(visitorsPerday);

                }
buildTable(finalArray);

          } // end sucess

        }); //end ajax
      }

        function buildTable (finalArray) {
            var ftdata = ['<table class="table table-striped"><thead><tr>'];
            for (var i = 0; i < finalArray.length; i++) {
                ftdata.push('<th>' + finalArray[i][0] + '</th>'); 
            }
            ftdata.push('</tr></thead><tbody>');

            for (var i = 1; i < finalArray[0].length; i++) {
                ftdata.push(
                            '<tr>' +
                            '<td>' + finalArray[0][i] + '</td>' + 
                            '<td>' + finalArray[1][i] + '</td>' +
                            '<td>' + finalArray[2][i] + '</td>' + 
                            '<td>' + finalArray[3][i] + '</td>' +
                            '<td>' + finalArray[4][i] + '</td>'  + 
                            '</tr>'
                            );
            }
            ftdata.push('</tbody></table>');
            document.getElementById('ft-data').innerHTML = ftdata.join('');
           formatData(finalArray); 
        }

        function formatData(finalArray) {
          console.log(finalArray);
          var rawOpenDays = [finalArray[0], finalArray[3]];
          var rawVisitsDay = [finalArray[0], finalArray[4]];
          var newOpenDays = [];
          var newVisitsDay = [];

            for (var i = 0; i < rawOpenDays[0].length; i++) {
                    newOpenDays.push([rawOpenDays[0][i], rawOpenDays[1][i]])
            }
            for (var i = 0; i < rawVisitsDay[0].length; i++) {
                    newVisitsDay.push([rawVisitsDay[0][i], rawVisitsDay[1][i]])
            }
            drawVisualization(newOpenDays);
            drawVisualization2(newVisitsDay);
        }

        function drawVisualization(formattedArray) {
             var data = google.visualization.arrayToDataTable(formattedArray);
             var dataView = new google.visualization.DataView(data);
              dataView.setColumns([{calc: function(data, row) { return data.getFormattedValue(row, 0); }, type:'string'}, 1]);
                var options = {
                  domainAxis: 'category',
                };
                var chart = new google.visualization.LineChart(document.getElementById('visualization'));
                chart.draw(data, options); 
      }
      function drawVisualization2(formattedArray) {
             var data = google.visualization.arrayToDataTable(formattedArray);
             var dataView = new google.visualization.DataView(data);
              dataView.setColumns([{calc: function(data, row) { return data.getFormattedValue(row, 0); }, type:'string'}, 1]);
                var options = {
                  domainAxis: 'category',
                };
                var chart = new google.visualization.LineChart(document.getElementById('visualization2'));
                chart.draw(data, options); 
      }