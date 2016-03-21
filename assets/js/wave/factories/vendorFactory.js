app.factory('VendorFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'vendorapi/';
	var self = {};
	
	self.vendor = {};
	self.newVendor = {};
	self.vendorList = [];
	
	self.getVendorList = function(){
		return $http.get(url + 'get_vendor_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.vendorList = data.vendor_list;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.getActiveVendorList = function(){
		return $http.get(url + 'get_active_vendor_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.activeVendorList = data.vendor_list;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	}
	
	self.getVendorById = function(id){
		return $http.get(url + 'get_vendor_by_id/' + id)
			.success(function(data){
				if(data.call_status == "success"){
					self.vendor = data.vendor;
					
					self.vendor.payment_term_value = parseFloat(self.vendor.payment_term_value);
					self.vendor.penalty_percent = parseFloat(self.vendor.penalty_percent);
				}
			})
		;
	}
	
	self.getVendorByReference = function(reference){
		return $http.get(url + 'get_vendor_by_reference/' + reference)
			.success(function(data){
				if(data.call_status == "success"){
					self.vendor = data.vendor;
					
					self.vendor.payment_term_value = parseFloat(self.vendor.payment_term_value);
					self.vendor.penalty_percent = parseFloat(self.vendor.penalty_percent);
				}
			});
	}

	self.getVendorCombinedItemList = function (vendorId) {
		return $http.get(url + 'get_vendor_combined_item_list/' + vendorId)
			.success(function (data) {
				if (data.call_status == 'success') {
					self.vendorCombinedItemList = data.vendor_combined_item_list;
				}
			})
			.error(function () {
				//NotificationFactory.showError();
			});
	};
	
	self.insertVendor =  function (){
		var insertData = self.newVendor;
		return $http.post(url + 'insert_vendor', insertData)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Vendor "+ insertData.vendor_name +" berhasil disimpan ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.vendor = {};
				}
				else{
					SweetAlert.swal({
						title: "Tambah Vendor Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			})
	}
	
	self.updateVendor =  function (){
		return $http.post(url + 'update_vendor', self.vendor)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Ubah Vendor Berhasil",
						text: "Vendor "+ self.vendor.vendor_name +" berhasil diubah ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.vendor = {};
				}
				else{
					SweetAlert.swal({
						title: "Ubah Vendor Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			});
	}
	
	return self;
});