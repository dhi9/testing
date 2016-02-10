app.controller('LoginController', function($scope, $state, $stateParams, ApiCallService, SweetAlert, ItemLookupService) {

	$scope.state = $state.current;
	$scope.error_message = "";
	
	$scope.user = {
		username: '',
		password: '',
		user_id: ''
	};
	
	$scope.login = function() {
	
		ApiCallService.login($scope.user).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.user.full_name = data.full_name;
					ItemLookupService.retrieveItemLookup();
					localStorage.setItem('vontisUsername', JSON.stringify($scope.user.username));
					localStorage.setItem('vontisFullname', JSON.stringify($scope.user.full_name));
					$state.go('app.dashboard');
				}
				else {
					if (data.error_code === "999") {
						$scope.user.user_id = data.user_id;
						SweetAlert.swal({
							title: "Anda Belum Logout Di Tempat Lain",
							text: "Klik Teruskan untuk logout dari sesi di tempat lain terlebih dahulu.", 
							type: "warning",
							showCancelButton: true,
							confirmButtonText: "Teruskan",
							animation: "slide-from-top"
						},
						function(isConfirm){
							if (isConfirm) {
								$scope.deleteActiveLogin();
							}
							else {
								
							}
						});
					}
					else {
						//$scope.error_message = "Harap masukan username dan password yang benar.";
						SweetAlert.swal({
							title: "Login Gagal",
							text: data.error_message, 
							type: "error",
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
				
				$scope.error_message = "Login Error";
			});
	}
	
	$scope.deleteActiveLogin = function() {
		ApiCallService.deleteActiveLogin($scope.user).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal("Logout dari Tempat Lain Berhasil", "Silahkan mencoba login kembali", "success");
				}
				else {
					
				}
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
			});
	}
	
	$scope.init = function() {
	};
	
	$scope.init();

});

