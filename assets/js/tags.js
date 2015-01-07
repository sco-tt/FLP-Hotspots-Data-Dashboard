function initialize() {
  var query = "SELECT 'Age', 'Tag1', 'Tag2', 'Tag3', 'Tag4' FROM " +
  "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq ORDER BY 'Age'";
  var encodedQuery = encodeURIComponent(query);

  // Construct the URL
  var url = ['https://www.googleapis.com/fusiontables/v2/query'];
  url.push('?sql=' + encodedQuery);
  url.push('&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ');
  var queryURL = url.join('');
  var queryLink = document.getElementById('query');
  queryLink.innerHTML = "<a href=" + queryURL + ">" + queryURL + "</a>";  
    url.push('&callback=?');
    $("#ft-data").addClass("spinning");


  // Send the JSONP request using jQuery
  $.ajax({
    url: url.join(''),
    dataType: 'jsonp',
    success: function (data) {
       uppercase(data);
    } 
  }); 
  }

function uppercase (data) {
  var data_uppercase = Array();
  for (i=0, len = data.rows.length; i < len; i++) {
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
                    ["SNW!",0],
                    ["EML!",0],
                    ["ADO!",0], 
                    ["APP!",0],
                    ["BAS!",0],
                    ["COV!",0],
                    ["CRT!",0],
                    ["DOC!",0],
                    ["FRM!",0],
                    ["FAX!",0],
                    ["GAM!",0],
                    ["HED!",0],
                    ["HW!", 0],
                    ["INT!",0],
                    ["JOB!",0],
                    ["JSE!",0],
                    ["LC!", 0],
                    ["PRT!",0],
                    ["RES!",0],
                    ["SRC!",0],
                    ["ODB!",0],
                    ["GDT!",0],
                    ["ENT!",0]
                  ];

  var totalVisits = 0;
  var taggedVisits = 0;

  for (i=0, len = data_uppercase.length; i < len; i++) {
      totalVisits++;
      var arr = data_uppercase[i];
     
     //Check if at least of one of our tag columns has a value and logged tag visits
      if ( (arr[1]) || (arr[2]) || (arr[3]) || (arr[4]) ) {
        taggedVisits++;
      }
      
      //Test each row against our index. TO DO: make sure this is checking all parts of the arr array
      for (var j=0, len2 = tagList.length; j < len2; j++) {
          if (arr.indexOf(tagList[j][0]) != -1) {
              tagList[j][1]++;
          }
      }
  }
  console.log(tagList);
  console.log("Total Visits: " + totalVisits);
  console.log("Tagged Visits: " + taggedVisits);

  writeData(tagList, totalVisits, taggedVisits);

}

function writeData(tagList, totalVisits, taggedVisits) {
  console.log(tagList);
  var ftdata = ['<table class="table table-striped"><thead><tr><th>Tag</th><th>Count</th</tr>'];
    for (var i = 0, len = tagList.length; i < len; i++) {
      ftdata.push('<tr><td>' + tagList[i][0] + '</td><td>' + tagList[i][1] + '</td></tr>');
    }
    ftdata.push('</tbody></table>');
      $("#ft-data").removeClass("spinning");
    document.getElementById('ft-data').innerHTML = ftdata.join('');
  }