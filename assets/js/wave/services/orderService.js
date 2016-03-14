app.service('OrderService', function($http, apiUrl, $window) {
	var url = apiUrl + 'orderapi/';
	
	this.getLast10Week = function(){
		return $http.get(url + 'get_last_10_week/');
	}

	this.totalSalesPerWeek = function(){
		return $http.get(url + 'total_sales_per_week/');
	}

	this.getSalesInvoice = function(order_id){
		var download = $window.open(url + 'sales_invoice/' + order_id,"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		download.history.pushState("blank", "blank", "blank");
	}

});