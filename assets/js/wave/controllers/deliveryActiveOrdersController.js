app.controller('DeliveryActiveOrdersController', function($scope, $filter, ApiCallService, ngTableParams) {

	$scope.orders = [];
	
	$scope.init = function() {
		ApiCallService.getActiveOrders().
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.orders = data.orders;
					
					for (var i=0; i< $scope.orders.length; i++) {
						if ($scope.orders[i].next_requested_delivery_date) {
							$scope.orders[i].next_requested_delivery_date = moment($scope.orders[i].next_requested_delivery_date).format('DD-MM-YYYY');
						}
						$scope.orders[i].date_created = moment($scope.orders[i].date_created).format('DD-MM-YYYY');
						$scope.orders[i].date_modified = moment($scope.orders[i].date_modified).format('DD-MM-YYYY');
						$scope.orders[i].production_completed_date = moment($scope.orders[i].production_completed_date).format('DD-MM-YYYY');
					}
					
					$scope.tableParams = new ngTableParams(
						{
							page: 1, // show first page
							count: 10 // count per page
						}, 
						{
							total: $scope.orders.length, // length of data
							getData: function ($defer, params) {
								var orderedData = params.sorting() ? $filter('orderBy')($scope.orders, params.orderBy()) : $scope.orders;
								$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
							}
						}
					);
				}
				else {
					console.log(data);
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	};
	
	$scope.init();
	
	$scope.isNullThen = function(inputNumber, replacementNumber) {    
		if (inputNumber === null || inputNumber === undefined) {
			return replacementNumber;
		}
		return inputNumber;
	}
	
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
				case 'X':
					statusLabel= "Tiba";
					break;
				case 'C':
					statusLabel= "Selesai";
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
					statusLabel= "label-default";
					break;
				case 'L':
					statusLabel= "label-warning";
					break;
				case 'X':
					statusLabel= "label-info";
					break;
				case 'C':
					statusLabel= "label-success";
					break;
			}
		}
		
		return statusLabel;
	}

});



