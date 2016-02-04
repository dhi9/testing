app.controller('VehicleMasterNewController', function($scope, $modal, $state, $stateParams, VehicleService, SweetAlert, VendorService) {
	var newVehicle = [];
	$scope.vehicle=[];
	$scope.vehicleType=[];
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
		},
	];
	
	VehicleService.getVehicleTypeList().
		success(function(data) {
			if (data.call_status === "success") {
				$scope.vehicleType = data.vehicle_type_list;
			}
		});
		
	VendorService.getVendorList().success(function(data) {
		if (data.call_status === "success") {
			$scope.vendorList = data.vendor_list;
		}
	});
	
	$scope.insertVehicle = function(newVehicle) {
		$scope.newVehicle = newVehicle;
		$scope.newVehicle.status = "A";
		VehicleService.insertNewVehicle($scope.newVehicle).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Buat Vehicle Baru Berhasil",
						text: "Vehicle " + $scope.newVehicle.vehicle_plate + " telah disimpan.", 
						type: "success", 
						animation: "slide-from-top"
					});
                    $state.go('app.master.vehicle');
				}
				else {
					SweetAlert.swal({
						title: "Buat Vehicle Baru Gagal",
						text: data.error_message, 
						type: "error", 
						animation: "slide-from-top"
					});
				}
				console.log($scope.newVehicle);
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(config);
			});
	}
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