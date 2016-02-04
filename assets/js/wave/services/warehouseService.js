app.service('WarehouseService', function($http, apiUrl) {
	var url = apiUrl + "warehouseapi/";
	
	this.getAddressList = function(){
		return $http.get(url + 'get_address_list');
	}
});