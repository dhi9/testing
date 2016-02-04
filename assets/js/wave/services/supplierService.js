app.service('SupplierService', function($http) {
  var url = "http://localhost/waveerp/backend/index.php/supplierapi/";
	
	this.getSupplierById = function(id){
		return $http.get(url + 'get_supplier_by_id/' + id);
	}
	
	this.getSupplierList = function(){
		return $http.get(url + 'get_supplier_list');
	}
});