app.controller('UserMasterNewController', function($scope, $state, SweetAlert, UserService) {
	$scope.user = {};
	$scope.usernameAvailable = true;
	$scope.usernameNotNull = true;
	$scope.fullnameNotNull = true;
	$scope.passwordNotNull = true;
	$scope.passwordNotSame = true;
	$scope.isUsernameAvailable = function(){
		UserService.isUsernameAvailable($scope.user.username).success(function(data) {
			$scope.usernameAvailable = data.available;
		});
	}

	$scope.isUsernameNotNull = function(username){
		if(username == "" || username == null || username == undefined ){
			$scope.usernameNotNull = false;
		}else{
			$scope.usernameNotNull = true;
		}
	}

	$scope.isFullnameNotNull = function(fullname){
		if(fullname == "" || fullname == null || fullname == undefined ){
			$scope.fullnameNotNull = false;
		}else{
			$scope.fullnameNotNull = true;
		}
	}

	$scope.isPasswordNotNull = function(password){
		if(password == "" || password == null || password == undefined ){
			$scope.passwordNotNull = false;
		}else{
			$scope.passwordNotNull = true;
		}
	}

	$scope.isPasswordSame = function(user){
		if(user.password != user.repeatedPassword){
			$scope.passwordNotSame = false;
		}else{
			$scope.passwordNotSame = true;
		}
	}

	$scope.insertUser = function() {
		var user = $scope.user;
		$scope.fullnameNotNull = true;
		
		if (user.password != user.repeatedPassword) {
			SweetAlert.swal({
				title: "Create User Failed",
				text: "Repeat Password is not same with Password",
				type: "error",
				animation: "slide-from-top"
			});
			$scope.passwordNotSame = false;
		}else {
			delete user.repeatedPassword;
			
			UserService.insertUser(user).
				success(function(data, status, headers, config) {
					SweetAlert.swal({
						title: data.title,
						text: data.text, 
						type: data.call_status, 
						animation: "slide-from-top"
					});
					
					if (data.call_status === "success") {
						$state.go('app.master.user');
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
});