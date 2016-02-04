'use strict';
/** 
  * controllers used for the dashboard
*/
app.controller('SparklineCtrl', function ($scope, ApiCallService) {
	
	// 3 variabel di bawah JANGAN DIHAPUS. Ada yang bisa bikin error
	$scope.sales = [600, 923, 482, 1211, 490, 1125, 1487];
	$scope.earnings = [400, 650, 886, 443, 502, 412, 353];
	$scope.referrals = [4879, 6567, 5022, 5890, 9234, 7128, 4811];
	
	$scope.totalMonthlyOrder = [];
	$scope.totalMonthlyDelivery = [];
	$scope.totalDeliveryRequest = [];
		
	$scope.sumArray = function(array){
		var total = 0;
    
		array.forEach(function(data){
			total += parseInt(data);
		});
    
		return total;
	}
	
	$scope.init = function(){
		ApiCallService.getMonthlyStats().
			success(function(data, status, headers, config) {
				$scope.totalMonthlyOrder = data.total_monthly_order;
				$scope.totalMonthlyDelivery = data.total_monthly_delivery;
				$scope.deliveryRequestsAccuracy = data.delivery_requests_accuracy;
				
				$scope.totalOrder = $scope.sumArray($scope.totalMonthlyOrder);
				$scope.totalDelivery = $scope.sumArray($scope.totalMonthlyDelivery);
				$scope.totalDeliveryRequest = $scope.sumArray($scope.deliveryRequestsAccuracy)/$scope.deliveryRequestsAccuracy.length;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init();
});

app.controller('VisitsCtrl', function ($scope, ApiCallService) {

	$scope.init = function(){
		ApiCallService.getMonthlyStats().
			success(function(data, status, headers, config) {
				$scope.data = {
					labels: data.months,
					datasets: [
						{
							label: 'Sales Order',
							fillColor: 'rgba(220,220,220,0.2)',
							strokeColor: 'rgba(220,220,220,1)',
							pointColor: 'rgba(220,220,220,1)',
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: 'rgba(220,220,220,1)',
							data: data.total_monthly_order
						},
						{
							label: 'Pengiriman',
							fillColor: 'rgba(151,187,205,0.2)',
							strokeColor: 'rgba(151,187,205,1)',
							pointColor: 'rgba(151,187,205,1)',
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: 'rgba(151,187,205,1)',
							data: data.total_monthly_delivery
						}
					]
				};
	
				$scope.options = {
		
					maintainAspectRatio: false,
	
					// Sets the chart to be responsive
					responsive: true,
	
					///Boolean - Whether grid lines are shown across the chart
					scaleShowGridLines: true,
	
					//String - Colour of the grid lines
					scaleGridLineColor: 'rgba(0,0,0,.05)',
	
					//Number - Width of the grid lines
					scaleGridLineWidth: 1,
	
					//Boolean - Whether the line is curved between points
					bezierCurve: false,
	
					//Number - Tension of the bezier curve between points
					bezierCurveTension: 0.4,
	
					//Boolean - Whether to show a dot for each point
					pointDot: true,
	
					//Number - Radius of each point dot in pixels
					pointDotRadius: 4,
	
					//Number - Pixel width of point dot stroke
					pointDotStrokeWidth: 1,
	
					//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
					pointHitDetectionRadius: 20,
	
					//Boolean - Whether to show a stroke for datasets
					datasetStroke: true,
	
					//Number - Pixel width of dataset stroke
					datasetStrokeWidth: 2,
	
					//Boolean - Whether to fill the dataset with a colour
					datasetFill: true,
	
					// Function - on animation progress
					onAnimationProgress: function () { },
	
					// Function - on animation complete
					onAnimationComplete: function () { },
	
					//String - A legend template
					legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
				};
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init();

});

app.controller('DeliveryStatusCtrl', function ($scope, ApiCallService) {

	$scope.total = [];

	$scope.init = function(){
		ApiCallService.getTodayDeliveryStats().
			success(function(data, status, headers, config) {
				$scope.stats = data.stats;
				
				for (var i=0; i< $scope.stats.length; i++) {
					if ($scope.stats[i].status == 'A') {
						$scope.total.a = $scope.stats[i].total;
					}
					if ($scope.stats[i].status == 'L') {
						$scope.total.l = $scope.stats[i].total;
					}
					if ($scope.stats[i].status == 'S') {
						$scope.total.s = $scope.stats[i].total;
					}
					if ($scope.stats[i].status == 'C') {
						$scope.total.c = $scope.stats[i].total;
					}
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init();
	
	$scope.UTILgetStatusLabel = function(status, level) {
		
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "Penyerahan";
					break;
				case 'P':
					statusLabel= "Produksi";
					break;
				case 'R':
					statusLabel= "Tersedia";
					break;
				case 'B':
					statusLabel= "Credit Block";
					break;
				case 'D':
					statusLabel= "Pengiriman";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "Aktif";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "Dibuat";
					break;
				case 'L':
					statusLabel= "Pemuatan";
					break;
				case 'S':
					statusLabel= "Tiba";
					break;
				case 'C':
					statusLabel= "Selesai";
					break;
				case 'X':
					statusLabel= "Batal";
					break;
			}
		}
		
		return statusLabel;
	}
	
	$scope.UTILgetStatusClass = function(status, level) {
		
		var statusLabel;
		
		if (level == "ORDER") {
			switch(status) {
				case 'N':
					statusLabel= "label-default";
					break;
				case 'P':
					statusLabel= "label-warning";
					break;
				case 'R':
					statusLabel= "label-info";
					break;
				case 'B':
					statusLabel= "label-danger";
					break;
				case 'D':
					statusLabel= "label-inverse";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
			}
		}
		else if (level == "DELIVERYREQUEST") {
			switch(status) {
				case 'A':
					statusLabel= "label-default";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
				case 'X':
					statusLabel= "label-inverse";
					break;
			}
		}
		else if(level == "DELIVERY"){
			switch(status) {
				case 'A':
					statusLabel= "default";
					break;
				case 'L':
					statusLabel= "warning";
					break;
				case 'S':
					statusLabel= "info";
					break;
				case 'C':
					statusLabel= "success";
					break;
				case 'X':
					statusLabel= "inverse";
					break;
			}
		}
		
		return statusLabel;
	}

});

app.controller('DisplayDeliveryCtrl', function ($scope, ApiCallService) {
	$scope.todayDeliveries = [];
	$scope.activeDeliveries = [];

	$scope.init = function(){
		ApiCallService.getTodayDeliveries().
			success(function(data, status, headers, config) {
				$scope.todayDeliveries = data.today_deliveries;
				$scope.activeDeliveries = data.active_deliveries;
				
				for (var i=0; i< $scope.activeDeliveries.length; i++) {
					$scope.activeDeliveries[i].loading_date = moment($scope.activeDeliveries[i].loading_date).format('DD-MM-YYYY');
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init();

});

app.controller('NotReturnedDeliveriesCtrl', function ($scope, ApiCallService) {

	$scope.init = function(){
		ApiCallService.getNotReturnedDeliveries().
			success(function(data, status, headers, config) {
				$scope.deliveries = data.deliveries;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init();

});

app.controller('SalesCtrl', function ($scope) {

    // Chart.js Data
    $scope.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
              label: 'My First dataset',
              fillColor: 'rgba(220,220,220,0.5)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: 'rgba(220,220,220,0.75)',
              highlightStroke: 'rgba(220,220,220,1)',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              fillColor: 'rgba(151,187,205,0.5)',
              strokeColor: 'rgba(151,187,205,0.8)',
              highlightFill: 'rgba(151,187,205,0.75)',
              highlightStroke: 'rgba(151,187,205,1)',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
    };

    // Chart.js Options
    $scope.options = {
        maintainAspectRatio: false,

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

});
app.controller('OnotherCtrl', function ($scope) {

    // Chart.js Data
    $scope.data = [
      {
          value: 300,
          color: '#F7464A',
          highlight: '#FF5A5E',
          label: 'Red'
      },
      {
          value: 50,
          color: '#46BFBD',
          highlight: '#5AD3D1',
          label: 'Green'
      },
      {
          value: 100,
          color: '#FDB45C',
          highlight: '#FFC870',
          label: 'Yellow'
      }
    ];
    $scope.total = 450;
    // Chart.js Options
    $scope.options = {

        // Sets the chart to be responsive
        responsive: false,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect
        animationEasing: 'easeOutBounce',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

    };

});
app.controller('LastCtrl', function ($scope) {

    // Chart.js Data
    $scope.data = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
          {
              label: 'My First dataset',
              fillColor: 'rgba(220,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              pointColor: 'rgba(220,220,220,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
              label: 'My Second dataset',
              fillColor: 'rgba(151,187,205,0.2)',
              strokeColor: 'rgba(151,187,205,1)',
              pointColor: 'rgba(151,187,205,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(151,187,205,1)',
              data: [28, 48, 40, 19, 96, 27, 100]
          }
        ]
    };

    // Chart.js Options
    $scope.options = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether to show lines for each scale point
        scaleShowLine: true,

        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut: true,

        //Boolean - Whether to show labels on the scale
        scaleShowLabels: false,

        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,

        //String - Colour of the angle line
        angleLineColor: 'rgba(0,0,0,.1)',

        //Number - Pixel width of the angle line
        angleLineWidth: 1,

        //String - Point label font declaration
        pointLabelFontFamily: '"Arial"',

        //String - Point label font weight
        pointLabelFontStyle: 'normal',

        //Number - Point label font size in pixels
        pointLabelFontSize: 10,

        //String - Point label font colour
        pointLabelFontColor: '#666',

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 3,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

});
