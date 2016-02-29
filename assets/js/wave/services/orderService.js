app.service('OrderService', function($http, apiUrl) {
	var url = apiUrl + 'orderapi/';
	
	this.getLast10Week = function(){
		return $http.get(url + 'get_last_10_week/');
	}
	
	this.totalSalesPerWeek = function(){
		return $http.get(url + 'total_sales_per_week/');
	}
});