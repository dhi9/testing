app.service('StatsService', function($http, apiUrl) {
	var url = apiUrl + 'statsapi/';
	
	this.countNotCompletedData = function(){
		return $http.get(url + 'count_not_completed_data/');
	}
});