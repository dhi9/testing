app.controller('ItemMasterEditController', function($scope, $state, $stateParams, ApiCallService, SweetAlert) {
	
	$scope.state = $state.current;
	$scope.item = {};
	
	var itemCode = $stateParams.item_code;
	
	$scope.updateItem = function(item) {
		$scope.buttonLoading = true;
		
		ApiCallService.updateItem(item).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Ubah Barang Berhasil",
						text: "Item " + item.item_name + " berhasil diubah.", 
						type: "success", 
						confirmButtonText: "Ok",
						closeOnConfirm: true,
						animation: "slide-from-top"
					});
				}
				else if (data.call_status === "error") {
					if(data.error_code == "701") {
						SweetAlert.swal({
							title: "Perhatian!",
							text: "Harap login kembali", 
							type: "error", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						}, 
						function() {
							$state.go('app.login');
						});
					}
					else {
						SweetAlert.swal({
							title: "Success",
							text: data.error_message, 
							type: "success", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
				}
				
				$scope.buttonLoading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.buttonLoading = false;
			});
	}
	
	$scope.init = function(){
		
		ApiCallService.getItemByItemCode(itemCode).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.item = data.item_details;
				}
				else if (data.call_status === "error") {
					if(data.error_code == "701") {
						SweetAlert.swal({
							title: "Perhatian!",
							text: "Harap login kembali", 
							type: "error", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						}, 
						function() {
							$state.go('app.login');
						});
					}
					else {
						SweetAlert.swal({
							title: "Success",
							text: data.error_message, 
							type: "success", 
							confirmButtonText: "Ok",
							closeOnConfirm: true,
							animation: "slide-from-top"
						});
					}
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
});
