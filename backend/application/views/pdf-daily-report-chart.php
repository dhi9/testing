<html>
  <head>
    <!--Load the AJAX API-->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">

      // Load the Visualization API and the corechart package.
      google.charts.load('current', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart_div = document.getElementById('chart_div');
        //var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
          var chart = new google.visualization.PieChart(chart_div);
        google.visualization.events.addListener(chart, 'ready', function () {
            chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
            console.log(chart_div.innerHTML);
        });
          
        chart.draw(data, options);
      }
    </script>
      <style>
          table{border-collapse: collapse;} table tr td{padding: 5px;} #mg50{margin: 30px;} .noborder->tr->th{border: none}
      </style>
  </head>

  <body>
      <div id="chart_div"></div>
  </body>
</html>