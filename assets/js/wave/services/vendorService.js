app.service('VendorService', function($http, apiUrl) {
	var url = apiUrl;
	
	this.getVendorById = function(id){
		return $http.get(url + 'vendorapi/get_vendor_by_id/' + id);
	}
	
  this.getVendorByReference = function(reference){
		return $http.get(url + 'vendorapi/get_vendor_by_reference/' + reference);
	}

	this.getVendorList = function(){
		return $http.get(url + 'vendorapi/get_vendor_list');
	}

	this.getActiveVendorList = function(){
		return $http.get(url + 'vendorapi/get_active_vendor_list');
	}

	this.getVendorHistoryListByVendorId = function(vendorId){
		return $http.get(url + 'vendorapi/get_vendor_history_list_by_vendor_id/' + vendorId);
	}
	
	this.insertVendor = function(data){
		return $http.post(url + 'vendorapi/insert_vendor', data);
	}
	
	this.updateVendor = function(data){
		return $http.post(url + 'vendorapi/update_vendor', data);
	}
});