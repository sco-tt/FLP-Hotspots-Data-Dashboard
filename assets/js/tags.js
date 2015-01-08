jQuery(document).ready(function($){
  "use strict";

  function queryFt() {
  var query = "SELECT 'Age', 'Tag1', 'Tag2', 'Tag3', 'Tag4' FROM " +
  "1D7abkHy7QdnOtPkRhDCENIMskH-ujJVXE7UsEceq ORDER BY 'Age'";
  var encodedQuery = encodeURIComponent(query);

  // Construct the URL
  var url = ["https://www.googleapis.com/fusiontables/v2/query"];
  url.push("?sql=" + encodedQuery);
  url.push("&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ");
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
                    ["SNW!","Social Networking",0],  
                    ["EML!","Email",0],
                    ["ADO!","Technology Adoption",0], 
                    ["APP!","Job Application",0],
                    ["BAS!","Computer Basics",0],
                    ["COV!","Cover Letter",0],
                    ["CRT!","Creative/Artistic",0],
                    ["DOC!","Document/Word processing",0],
                    ["FRM!","Online forms",0],
                    ["FAX!","Fax",0],
                    ["GAM!","Games",0],
                    ["HED!","Higher Education",0],
                    ["HW!","Homework", 0],
                    ["INT!","Got a job interview",0],
                    ["JOB!","Got a job",0],
                    ["JSE!","Job Search",0],
                    ["LC!","Sign up for library card", 0],
                    ["PRT!","Printing",0],
                    ["RES!","Resume",0],
                    ["SRC!","Internet Search",0],
                    ["ODB!","Online Database",0],
                    ["GDT!","Used Gadget",0],
                    ["ENT!","Entrepreneurial Activity",0]
                  ];

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
      for (var j=0, len2 = tagList.length; j < len2; j++) {
          if (arr.indexOf(tagList[j][0]) != -1) {
              tagList[j][2]++;
          }
      }
  }
  writeData(tagList, totalVisits, taggedVisits);

}


function writeData(tagList, totalVisits, taggedVisits) {

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

  var ftdata = ["<table class='table table-striped'><thead><tr><th>Tag</th><th>Description</th><th>Count</th><th>%</th></tr></thead>"];
    for (var i = 0, len = tagList.length; i < len; i++) {
      var percent = ((tagList[i][2]/taggedVisits)*100).toFixed(2);
      ftdata.push("<tr>"+
                    "<td>" + tagList[i][0] + "</td>" +
                    "<td>" + tagList[i][1] + "</td>" +
                    "<td>" + tagList[i][2] + "</td>" +
                    "<td>" + percent + "</td>" +
                  "</tr>");
    }
    ftdata.push("</tbody></table>");
      $("#ft-data").removeClass("spinning");
    document.getElementById("ft-data").innerHTML = ftdata.join("");
  }
    queryFt();
});