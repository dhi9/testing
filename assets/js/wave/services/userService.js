app.service('UserService', function($http, apiUrl) {
	var url = apiUrl;
	
	this.getUserByReference = function(reference){
		return $http.get(url + 'userapi/get_user_by_reference/' + reference);
	}
	
	this.getUserByUsername = function(username){
		return $http.get(url + 'userapi/get_user_by_username/' + username);
	}
	
	this.getUserList = function(){
		return $http.get(url + 'userapi/get_user_list');
	}
	
	this.getUserHistoryListByUserId = function(userId){
		return $http.get(url + 'userapi/get_user_history_list_by_user_id/' + userId);
	}
	
	this.insertUser = function(data){
		return $http.post(url + 'userapi/insert_user', data);
	}
	
	this.isUsernameAvailable = function(username){
		return $http.post(url + 'userapi/is_username_available', username);
	}
	
	this.updateUser = function(data){
		return $http.post(url + 'userapi/update_user', data);
	}
});