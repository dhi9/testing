app.controller('qrCodeScannerController', function($filter, $scope, $timeout, $http, $stateParams, ngTableParams, ItemLookupService, ApiCallService, SweetAlert) {
	$scope.reference = $stateParams.delivery_reference;
	
	
		$scope.itemLookupList = ItemLookupService.getAllItems();
		
		ApiCallService.getDeliveryDetailByReference($scope.reference).
			success(function(data, status, headers, config) {
				
				if (data.call_status === "success") {
					console.log(data.delivery);
					
						$scope.delivery = data.delivery;
						
						//simpan value awal untuk perbandingan sebelum di save
						$scope.original_value = {};
						$scope.original_value.actual_loading_date = null;
						$scope.original_value.arrival_date = null;
						$scope.original_value.confirmation_date = null;
						
						$scope.delivery.delivery_detail.date_created = moment($scope.delivery.delivery_detail.date_created).format('YYYY-MM-DD');
						if ($scope.delivery.delivery_detail.loading_date !== null) {
							$scope.delivery.delivery_detail.loading_date = new Date(moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD'));
							$scope.delivery.delivery_detail.print_loading_date = moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD');
							$scope.original_value.loading_date = new Date(moment($scope.delivery.delivery_detail.loading_date).format('YYYY-MM-DD'));
						}
						
						if ($scope.delivery.delivery_detail.actual_loading_date !== null) {
							$scope.delivery.delivery_detail.actual_loading_date = new Date(moment($scope.delivery.delivery_detail.actual_loading_date));
							$scope.original_value.actual_loading_date = new Date(moment($scope.delivery.delivery_detail.actual_loading_date));
						}
						
						if ($scope.delivery.delivery_detail.arrival_date !== null) {
							$scope.delivery.delivery_detail.arrival_date = new Date(moment($scope.delivery.delivery_detail.arrival_date));
							$scope.original_value.arrival_date = new Date(moment($scope.delivery.delivery_detail.arrival_date));
						}
						
						if ($scope.delivery.delivery_detail.confirmation_date !== null) {
							$scope.delivery.delivery_detail.confirmation_date = new Date(moment($scope.delivery.delivery_detail.confirmation_date));
							$scope.original_value.confirmation_date = new Date(moment($scope.delivery.delivery_detail.confirmation_date));
						}
						$scope.getData = true;
						$scope.scanningSuccess = true;
						$timeout(function(){
							$scope.scanning = false;
							$scope.scanningSuccess = false;
						}, 3000);
				}
				else if (data.call_status === "error") {
					console.log(data);
				}
				
				pageLock = {
					'level': 'D',
					'delivery_id': $scope.delivery.delivery_id
				};
				ApiCallService.checkPageLock(pageLock).
					success(function(data, status, headers, config) {
						if (data.call_status === "success") {
							
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
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	

});