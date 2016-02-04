app.run(function ($rootScope, $state, $location, AuthService, ApiCallService) {

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
		
		var needLoginCheck = toState.data !== undefined && toState.data.logged_on_only;
		
		if(needLoginCheck) {
			AuthService.isLoggedOn().
				success(function(data, status, headers, config) {
					if (data.call_status === "success") {
						if (data.is_logged_on == 1) {
							//console.log("user is logged on");
							$rootScope.username = JSON.parse(localStorage.getItem('vontisUsername'));
							
							if (toState.data.role == "") {
								return;
							}
							else {
								ApiCallService.checkUserHasAccess(toState.data.role).
									success(function(data1, status1, headers1, config1) {
										if(data1.call_status === "success") {
											if(data1.has_access == 1) {
												//console.log("has access");
												return;
											}
											else {
												//console.log("no access");
												$state.go('app.noaccess');
												event.preventDefault();
												return;
											}
										}
										else {
											$state.go('app.noaccess');
											event.preventDefault();
											return;
										}
										
									}).
									error(function(data1, status1, headers1, config1) {
										//ADD ERROR MESSAGE;
										event.preventDefault();
										return;
									});
								
							}
						}
						else {
							$state.go('login');
							event.preventDefault();
							return;
						}
					}
				}).
				error(function(data, status, headers, config) {
					$state.go('login');
					event.preventDefault();
					return;
				});
			
		}
		else {
			if (toState.name == 'logout') {
				if (AuthService.isLoggedOn) {
					ApiCallService.logout()
						.success(function() {
							$state.go('login');
							event.preventDefault();
							return;
						})
						.error(function() {
							$state.go('login');
							event.preventDefault();
							return;
						}) //kalau error tetep logout
				}
				else {
					$state.go('login')
					event.preventDefault();
					return;
				}
			}
		}
	
		ApiCallService.deletePageLock().
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
	});
});

