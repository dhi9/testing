app.controller('qrCodeScannerController', function($filter, $scope, $timeout, $http, $state, $stateParams, ngTableParams, ItemLookupService, ApiCallService, SweetAlert) {
	
	$scope.dataScanned = "";
	$scope.error = "";
	$scope.getData = false;
	$scope.scanning = false;
	$scope.scanningSuccess = false;
	$scope.oldData = "";
	
	$scope.onSuccess = function(data) {
		if (data == $scope.oldData) {
			//code
		}else{
			$scope.dataScanned = data;
			$scope.scanning = true;
			$scope.getDb(data);
			$scope.oldData = data;
			$scope.stopScan();
		}
    };
    $scope.onError = function(error) {
		$scope.error = error;
       
    };
    $scope.onVideoError = function(error) {
		$scope.error = error;
    
    };
	
	
	$scope.getDb = function(data){
		$scope.itemLookupList = ItemLookupService.getAllItems();
		
		ApiCallService.getDeliveryDetailByReference(data).
			success(function(data, status, headers, config) {
				
				if (data.call_status === "success") {
					console.log(data.delivery);
					if (data.delivery.delivery_reference == null) {
						$scope.getData = 'x';
						$scope.scanningSuccess = 'x';
						$timeout(function(){
							$scope.scanning = false;
							$scope.scanningSuccess = false;
						}, 3000);
					}else{
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
						$state.go("app.tools.qrdetail", { delivery_reference: $scope.dataScanned });
					}
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
	}

});