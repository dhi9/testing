app.controller('UserMasterController', function($scope, $filter, ApiCallService, ngTableParams, SweetAlert, $modal) {
	$scope.table_loading = false;

	$scope.usersList = [];
	$scope.createNewUserPanel = false;
	$scope.newUser = {};
	
	$scope.search = {};
	$scope.search.$ = '';
	
	$scope.displayResetPasswordModal = function(user) {
		var pass_data = {
			user: user
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_reset_password',
			controller: 'ResetPasswordModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			},
			//scope: $scope
		});
	}
	
	$scope.displaySetAccessModal = function(user) {
		var pass_data = {
			user: user
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_set_access',
			controller: 'SetAccessModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}
	
	$scope.displaySetDepartmentModal = function(user) {
		var pass_data = {
			user: user
		};
		
		var modalInstance = $modal.open({
			templateUrl: 'modal_set_department',
			controller: 'SetDepartmentModalCtrl',
			size: 'lg',
			resolve: {
				passed_data: function () {
					return pass_data;
				}
			}
		});
	}
	
	$scope.tableParams = new ngTableParams(
		{
			page: 1, // show first page
			count: 10, // count per page
			sorting: {
				username: 'asc' // initial sorting
			}
		}, 
		{
			total: $scope.usersList.length, // length of data
			getData: function ($defer, params) {
				var filteredData = $filter('filter') ($scope.usersList, $scope.search);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(orderedData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		}
	);
	
	var currentPage = null;
	$scope.$watch("search.$", function () {
		$scope.tableParams.reload();
		
		if ($scope.search.$.length > 0) {
			if (currentPage === null) {
				currentPage = $scope.tableParams.$params.page;
			}
			$scope.tableParams.page(1);
		} else {
			if (currentPage === null) {
				$scope.tableParams.page(1);
			}
			else {
				$scope.tableParams.page(currentPage);
			}
			currentPage = null;
		}
	});
	
	$scope.insertNewUser = function(newUser) {
		if (newUser.password != newUser.repeatedPassword) {
			SweetAlert.swal({
				title: "Buat User Baru Gagal",
				text: "Ulangi Password tidak sama dengan Password.", 
				type: "error", 
				animation: "slide-from-top"
			});
		}
		else {
			ApiCallService.insertUser(newUser).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						SweetAlert.swal({
							title: "Buat User Baru Berhasil",
							text: "User " + $scope.newUser.username + " telah disimpan.", 
							type: "success", 
							animation: "slide-from-top"
						});
						
						$scope.table_loading = true;
						ApiCallService.getUsersList().
							success(function(data, status, headers, config) {
								if (data.call_status === "success") {
									$scope.usersList = data.users_list;
									
									$scope.tableParams.total($scope.usersList.length);
									$scope.tableParams.reload();
								}
								else {
									console.log(data);
								}
								
								$scope.table_loading = false;
							}).
							error(function(data, status, headers, config) {
								console.log(data);
								console.log(status);
								console.log(header);
								console.log(config);
								
								$scope.table_loading = false;
							});
						
						$scope.newUser = {};
					}
					else {
						SweetAlert.swal({
							title: "Buat User Baru Gagal",
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
		$scope.table_loading = true;
	
		ApiCallService.getUsersList().
			success(function(data, status, headers, config) {
			
				if (data.call_status === "success") {
					$scope.usersList = data.users_list;
					
					$scope.tableParams.total($scope.usersList.length);
					$scope.tableParams.reload();
				}
				else {
					console.log(data);
				}
			
				$scope.table_loading = false;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
				console.log(status);
				console.log(header);
				console.log(config);
				
				$scope.table_loading = false;
			});
	
	};
	
	$scope.init();

});

app.controller('ResetPasswordModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService, SweetAlert) {
	
	$scope.user = passed_data.user;
	
	$scope.resetPassword = function(user) {
		if (user.password != user.repeatedPassword) {
			SweetAlert.swal({
				title: "Reset Password Gagal",
				text: "Ulangi Password Baru tidak sama dengan Password Baru.", 
				type: "error", 
				animation: "slide-from-top"
			});
		}
		else {
			ApiCallService.resetPassword(user).
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						SweetAlert.swal({
							title: "Reset Password Berhasil",
							text: "Password berhasil diubah.", 
							type: "success", 
							animation: "slide-from-top"
						});
						
						$scope.user.password = '';
						$scope.user.repeatedPassword = '';
						
						$modalInstance.dismiss('close');
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
		}
	}
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});

app.controller('SetAccessModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService, SweetAlert) {
	
	$scope.user = passed_data.user;
	
	$scope.setAccess = function() {
		ApiCallService.setAccess($scope.user).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Atur Akses Berhasil",
						text: "Akses telah disimpan.", 
						type: "success", 
						animation: "slide-from-top"
					});
					
					$modalInstance.dismiss('close');
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
	}
	
	$scope.init = function(){
		ApiCallService.getAllAccessForUser($scope.user.username).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.user.access = data.access_list;
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
	}
	
	$scope.init();
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});

app.controller('SetDepartmentModalCtrl', function ($scope, $modalInstance, passed_data, ApiCallService, SweetAlert) {
	
	$scope.user = passed_data.user;
	
	$scope.setDepartment = function() {
		ApiCallService.setDepartment($scope.user).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Atur Departemen Berhasil",
						text: "Departemen telah disimpan.", 
						type: "success", 
						animation: "slide-from-top"
					});
					
					$modalInstance.dismiss('close');
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
	}
	
	$scope.init = function(){
		ApiCallService.getAllDepartmentForUser($scope.user.username).
			success(function(data, status, headers, config) {
				if (data.call_status === "success") {
					$scope.user.department = data.department_list;
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
	}
	
	$scope.init();
	
	$scope.closeModal = function () {
		$modalInstance.dismiss('close');
	};

});