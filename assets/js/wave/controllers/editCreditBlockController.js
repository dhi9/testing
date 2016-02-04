app.controller('EditCreditBlockController', function($scope, $state, $stateParams, ApiCallService, CustomerService, SweetAlert) {
	
	$scope.state = $state.current;
	
	var customerId = $stateParams.customer_id;
	
	$scope.buttonAddCreditBlock = true;
	$scope.panelAddCreditBlock = false;
	
	// fungsi tambah credit blog
	$scope.addCreditBlock = function(){
		var input = {
			customer_id: customerId,
			credit_blocked_reason: $scope.customer_details.credit_blocked_reason
		};
		
		ApiCallService.addCreditBlock(input).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Credit block telah disimpan", 
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
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
		
		$scope.customer_details.is_credit_blocked = 1;
		$scope.panelAddCreditBlock = false;
	};
	
	// fungsi hapus credit blog
	$scope.removeCreditBlock = function(){
		var input = {customer_id: customerId};
		
		ApiCallService.removeCreditBlock(input).
			success(function(data, status, headers, config) {
				
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Credit block telah dihapus", 
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
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
		
		$scope.customer_details.is_credit_blocked = 0;
		$scope.buttonAddCreditBlock = true;
		$scope.customer_details.credit_blocked_reason = "";
	};
	
	// funsgi inisialisasi
	$scope.init = function(){
		
		// ambil data customer dengan api
		CustomerService.getCustomerById(customerId).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.customer_details = data.customer_details;
					if ($scope.customer_details.is_credit_blocked == '1') {
						$scope.buttonAddCreditBlock = false;
					}
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
});
