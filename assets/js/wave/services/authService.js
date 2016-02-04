app.service('AuthService', function ($state, ApiCallService) {
    
    
    this.isLoggedOn = function() {
			return ApiCallService.isLoggedOn();
    }
    
    this.isPermitted = function(roleName) {
        return true;
    };

});
