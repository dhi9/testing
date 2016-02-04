app.factory('AttributeFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'attributeapi/';
	var self = {};

	self.attribute = {};
	self.attribute_items = [];
	self.newAttribute = {};
	self.attributeList = [];
	self.attributeActiveList = [];
	
	self.getAttributeList = function(){
		return $http.get(url + 'get_attribute_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.attributeList = data.attribute_list;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	self.getAttributeActiveList = function(){
		return $http.get(url + 'get_attribute_active_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.attributeActiveList = data.attribute_list;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	
	self.getAttributeById = function(id){
		return $http.get(url + 'get_attribute_by_id/' + id)
			.success(function(data){
				if(data.call_status == "success"){
					self.attribute = data.attribute;
					self.attribute_items = data.attribute_items;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	
	self.insertAttribute =  function (){
		var attribute = self.newAttribute;
		return $http.post(url + 'insert_attribute', attribute)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Attribute "+ attribute.attribute_name +" berhasil disimpan ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.attribute = {};
				}
				else{
					SweetAlert.swal({
						title: "Tambah Attribute Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			})
	}
	
	self.updateAttribute =  function (){
		var attribute = self.attribute;
		return $http.post(url + 'update_attribute', attribute)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Attribute "+ attribute.attribute_name +" berhasil diubah ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.attribute = {};
				}
			})
	}

	self.insertNewAttributeItem =  function (newAttributeItem){
		var attributeItem = {
			attribute_id : self.attribute.attribute_id,
			attribute_item : newAttributeItem
		}
		return $http.post(url + 'insert_attribute_item', attributeItem)
			.success(function(data){
				if(data.call_status == "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Value "+ newAttributeItem +" berhasil disimpan ",
						type: "success",
						animation: "slide-from-top"
					});
					var attrib = {
						attribute_item : newAttributeItem
					}
					self.attribute_items.push(attrib);
				}
				else{
					SweetAlert.swal({
						title: "Tambah Value Gagal",
						text: data.error_message,
						type: "error",
						animation: "slide-from-top"
					});
				}
			})
	}

	return self;
});