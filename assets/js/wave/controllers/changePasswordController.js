app.controller('ChangePasswordController', function($scope, ApiCallService, SweetAlert) {
  
	$scope.password = {};
	
	$scope.changePassword = function(password) {
		if (password.newPassword != password.repeatedNewPassword) {
			SweetAlert.swal({
				title: "Reset Password Gagal",
				text: "Ulangi Password Baru tidak sama dengan Password Baru.", 
				type: "error", 
				animation: "slide-from-top"
			});
		}
		else
		{
			ApiCallService.changePassword(password).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						SweetAlert.swal({
							title: "Ganti Password Berhasil",
							text: "Password telah diganti", 
							type: "success", 
							animation: "slide-from-top"
						});
						
						$scope.password = {};
					}
					else {
						SweetAlert.swal({
							title: "Ganti Password Gagal",
							text: data.error_message, 
							type: "error", 
							animation: "slide-from-top"
						});
					}
				}).
				error(function(data, status, headers, config) {
					console.log(data);
					console.log(status);
					console.log(header);
					console.log(config);
				});
		}
		
	}
	
	$scope.init = function() {
						
	};
	
	$scope.init();
    
});