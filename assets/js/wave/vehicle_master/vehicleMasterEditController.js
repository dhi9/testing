app.controller('VehicleMasterEditController', function($filter, $scope, $modal, $state, $stateParams, VehicleService, SweetAlert, ngTableParams, VendorService) {
	$scope.cap = {};
	var vehicleId = $stateParams.vehicle_id;
	$scope.capabilitiesList=[
		{
			"id":1, //optimal
			"label":"B3 License",
			"code":"B3LICENCE"
		},
		{
			"id":2, //optimal
			"label":"GPS",
			"code":"GPS",
		}
	];
	
	$scope.serviceList=[];
	$scope.service=[];
	$scope.vehicle=[];
	$scope.vehicleType=[];
	$scope.vehicle.capabilities={};
	var a = {};
	$scope.search = {};
	$scope.search.$ = '';
	
	VendorService.getVendorList().success(function(data) {
		if (data.call_status === "success") {
			$scope.vendorList = data.vendor_list;
		}
	});
	
	VehicleService.getVehicleTypeList().
		success(function(data) {
			if (data.call_status === "success") {
				$scope.vehicleType = data.vehicle_type_list;
			}
			VehicleService.getVehicleListByVehicleId(vehicleId).success(function(data){
				if (data.call_status == 'success') {
					$scope.vehicle = data.vehicleList;
					var str = $scope.vehicle.capabilities;
					var jsonObj = JSON.parse(str);
					$scope.vehicle.capabilities=jsonObj;
					if ($scope.vehicle.capabilities) {
						for (var i = 0; i < $scope.vehicle.capabilities.length; i++){
							for(var ca in $scope.vehicle.capabilities){
								a[$scope.vehicle.capabilities[i]]=true;
							}
						}
					}
					$scope.vehicle.max_weight = parseFloat($scope.vehicle.max_weight);
					$scope.vehicle.max_volume = parseFloat($scope.vehicle.max_volume);
					$scope.vehicle.cap=a;
				}
			});
		});
		
	$scope.updateVehicle = function() {
		$scope.vehicle.vehicle_id=vehicleId;
		$scope.vehicle.capabilities=$scope.vehicle.cap;
		var capp = JSON.stringify($scope.vehicle.capabilities);
		VehicleService.updateVehicle($scope.vehicle).
		success(function(data, status, headers, config) {
			if (data.call_status === "success") {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Data Vehicle berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
				$state.go('app.master.vehicle');
			}
			else {
				console.log(data);
			}
		})
	}
	
	$scope.loadServiceList = function(){
		VehicleService.getVehicleServiceListByVehicleId(vehicleId).success(function(data){
			$scope.serviceList = data.services_list;
			
			for(var i = 0; i < $scope.serviceList.length; i++){
				$scope.serviceList[i].service_date = new Date($scope.serviceList[i].service_date);
			}
			
			$scope.tableParams.total($scope.serviceList.length);
			$scope.tableParams.reload();
		});
	};
	$scope.loadServiceList();
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting:
			{
				'service_name': 'asc'
			}
		}, 
		{
			total: $scope.serviceList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.serviceList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				
				params.total(orderedData.length);
				
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	var vehicleCurrentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (vehicleCurrentPage === null) {
				vehicleCurrentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (vehicleCurrentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(vehicleCurrentPage);
			}
			vehicleCurrentPage = null;
		}
	});
	
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.newServiceModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'new_service_modal',
			controller: 'NewServiceModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
	
	$scope.editServiceModal = function (service) {
		var pass_data = {
			service: service
		};
		//console.log($scope);
		var modalInstance = $modal.open({
			templateUrl: 'edit_service_modal',
			controller: 'EditServiceModalCtrl',
			size: 'lg',
			scope: $scope,
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	};
});

app.controller('NewServiceModalCtrl', function ($scope, $modalInstance, VehicleService, SweetAlert, VendorService) {
	VendorService.getVendorList().success(function(data) {
		if (data.call_status === "success") {
			$scope.vendorList = data.vendor_list;
		}
	});
	
	$scope.newVehicleService = function(vehicle_id) {
		$scope.item.vehicle_id = vehicle_id;
		
		VehicleService.insertVehicleService($scope.item).
		success(function(data, status, headers, config) {
			if (data.call_status === "success") {
				SweetAlert.swal({
					title: "Create Service Success",
					text: "Service berhasil dibuat",
					type: "success",
					animation: "slide-from-top"
				});
				
				$scope.loadServiceList();
				
				$modalInstance.dismiss('close');
			}
			else {
				console.log(data);
			}
		}).
		error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(config);
		});
	}
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
	
});

app.controller('EditServiceModalCtrl', function ($scope, $modalInstance, VehicleService, passed_data, SweetAlert, VendorService) {
	$scope.service = passed_data.service;
	$scope.service.service_date=new Date(moment($scope.service.service_date));
	
	VendorService.getVendorList().success(function(data) {
		if (data.call_status === "success") {
			$scope.vendorList = data.vendor_list;
		}
	});
	
	$scope.getCurrentDateString = function() {
		return moment(Date.now()).format('YYYY-MM-DD');
	}
	
	$scope.updateVehicleService = function() {
		delete $scope.service.vendor_name;
		
		VehicleService.updateVehicleService($scope.service).
		success(function(data, status, headers, config) {
			if (data.call_status === "success") {
				SweetAlert.swal({
					title: "Update Service Success",
					text: "Service berhasil diubah",
					type: "success",
					animation: "slide-from-top"
				});
				
				$scope.loadServiceList();
				
				$modalInstance.dismiss('close');
			}
			else {
				console.log(data);
			}
		}).
		error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(config);
		});
	}
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
	
});

app.controller('UploadCtrl2', ['$scope', 'FileUploader',
function ($scope, FileUploader) {
	var uploader = $scope.uploader = new FileUploader({
		url: 'upload.php'
	});
	
	// FILTERS
	
	uploader.filters.push({
		name: 'customFilter',
		fn: function (item/*{File|FileLikeObject}*/, options) {
			return this.queue.length < 10;
		}
	});
	
	// CALLBACKS
	
	uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function (fileItem) {
		console.info('onAfterAddingFile', fileItem);
	};
	uploader.onAfterAddingAll = function (addedFileItems) {
		console.info('onAfterAddingAll', addedFileItems);
	};
	uploader.onBeforeUploadItem = function (item) {
		console.info('onBeforeUploadItem', item);
	};
	uploader.onProgressItem = function (fileItem, progress) {
		console.info('onProgressItem', fileItem, progress);
	};
	uploader.onProgressAll = function (progress) {
		console.info('onProgressAll', progress);
	};
	uploader.onSuccessItem = function (fileItem, response, status, headers) {
		console.info('onSuccessItem', fileItem, response, status, headers);
	};
	uploader.onErrorItem = function (fileItem, response, status, headers) {
		console.info('onErrorItem', fileItem, response, status, headers);
	};
	uploader.onCancelItem = function (fileItem, response, status, headers) {
		console.info('onCancelItem', fileItem, response, status, headers);
	};
	uploader.onCompleteItem = function (fileItem, response, status, headers) {
		console.info('onCompleteItem', fileItem, response, status, headers);
	};
	uploader.onCompleteAll = function () {
		console.info('onCompleteAll');
	};
	console.info('uploader', uploader);
}]);