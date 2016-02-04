app.service('DeliveryService', function($http, apiUrl) {
	//var url = apiUrl + "customerapi/";
	
	this.getDeliveryRequestList = function() {
		return $http.get(apiUrl + 'deliveryapi/get_delivery_request_list');
	};
	
	this.getDeliveryRequestById = function(deliveryRequestId) {
		return $http.get(apiUrl + 'deliveryapi/get_delivery_request_by_id/' + deliveryRequestId);
	};
});
