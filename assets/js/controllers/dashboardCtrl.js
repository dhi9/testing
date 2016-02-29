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

app.controller('VisitsCtrl', function ($scope, OrderService) {

	$scope.init = function(){
		OrderService.totalSalesPerWeek().
			success(function(data, status, headers, config) {
				$scope.data = {
					labels: data.array_week,
					datasets: [
						/*{
							label: 'Sales Order',
							fillColor: 'rgba(220,220,220,0.2)',
							strokeColor: 'rgba(220,220,220,1)',
							pointColor: 'rgba(220,220,220,1)',
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: 'rgba(220,220,220,1)',
							data: data.array_total
						},*/
						{
							label: 'Jumlah',
							fillColor: 'rgba(151,187,205,0.2)',
							strokeColor: 'rgba(151,187,205,1)',
							pointColor: 'rgba(151,187,205,1)',
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: 'rgba(151,187,205,1)',
							data: data.array_total
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

app.controller('SalesCtrl', function ($scope, PurchaseService) {
	PurchaseService.getThisYearPurchaseTotalPrice().success(function(data) {
		$scope.data = {
			labels: ['Purchase Order', 'Service Order'],
			datasets: [
				{
					label: 'IDR',
					fillColor: 'rgba(220,220,220,0.5)',
					strokeColor: 'rgba(220,220,220,0.8)',
					highlightFill: 'rgba(220,220,220,0.75)',
					highlightStroke: 'rgba(220,220,220,1)',
					data: data.purchase_total_price,
				},
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
	}).
	error(function(data, status, headers, config) {
		console.log(data);
		console.log(status);
		console.log(header);
		console.log(config);
	});
});

app.controller('NotCompletedCtrl', function ($scope, StatsService) {
	StatsService.countNotCompletedData().success(function(data) {
		$scope.notApprovedPurchaseItem = data.not_approved_purchase_item;
		$scope.notApprovedPurchaseService = data.not_approved_purchase_service;
		$scope.notCompletedPurchase = data.not_completed_purchase;
		$scope.notCompletedOrder = data.not_completed_order;
	}).
	error(function(data, status, headers, config) {
		console.log(data);
		console.log(status);
		console.log(header);
		console.log(config);
	});
});

app.controller('StockSalesCtrl', function ($scope, OrderService) {
	OrderService.getLast10Week().success(function(data){
		var m = [];
		
		data.stats.forEach(function(stat) {
			var arr = [];
			for (var key in stat) {
				if (stat.hasOwnProperty(key)) {
					var parse = parseInt(stat[key]);
					
					if (parse) {
						var a = { v: parse };
					}
					else{
						var a = { v: stat[key] };
					}
					
					arr.push(a);
				}
			};
			
			var b = {
				c: arr
			};
			m.push(b);
		});
		
		$scope.chartObject = {};
		$scope.chartObject.type = "PieChart";
		$scope.chartObject.data = {
			"cols": [
				{label: "Item Code", type: "string"},
				{label: "Quantity", type: "number"}
			],
			"rows": m,
		};
	});
});

app.controller('StockTypeCtrl', function ($scope, InventoryService) {
	InventoryService.totalTodayStockValue().success(function(data){
		$scope.chartObject = {};
		$scope.chartObject.type = "PieChart";
		$scope.chartObject.data = {
			"cols": [
				{label: "Item Code", type: "string"},
				{label: "Quantity", type: "number"}
			],
			"rows": [
				{c: [
					{v: "Tersedia"},
					{v: data.available_stock_value},
				]},
				{c: [
					{v: "Konsinyasi"},
					{v: data.consignment_stock_value},
				]},
			]
		};
	});
});