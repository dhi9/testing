app.factory('PurchaseFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'purchaseapi/';
	
	var self = {};
	self.supplier = [];
	self.userList = [];
	self.approve = [];
	self.deliveryRequestList = [];
	self.itemRequestList = [];
	self.edit = {};
	self.edit.itemList = true;
	self.edit.sendEmail = false;
	
	self.getUsersList = function (){
		return $http.get(url + 'get_users_list')
			.success(function(data){
				if (data.call_status === "success") {
					self.userList = data.users_list;
				}
			})
			.error(function(){
					//error messages
			});
	};
	
	self.approver = function(data){
		for(var i = 0; i < self.userList.length; i +=1){
			if( data <= +self.userList[i].max_limit) {
				self.approve.name = self.userList[i].username;
				self.approve.email = self.userList[i].email;
				self.approve.user_id = self.userList[i].user_id;
				return;
			}
		}
	};
	
	self.addItemRequest = function (){
		var AddItem = {
			item_code:'',
			quantity:''
		}
		self.itemRequestList.push(AddItem);
	};
	
	self.totalItemInItemDeliveryRequest = function(itemUnit, itemCode){
		var total = 0;
		var deliveryRequestList = self.deliveryRequestList;
		
		for(var i = 0; i < deliveryRequestList.length; i++){
			var itemDeliveryRequestList = deliveryRequestList[i].item_delivery_request_list;
			
			for(var j = 0; j < itemDeliveryRequestList.length; j++){
				if(itemDeliveryRequestList[j].item_unit == itemUnit && itemDeliveryRequestList[j].item_code == itemCode ){
					quantity = itemDeliveryRequestList[j].quantity || 0;
					total += quantity;
				}
			}
		}
		
		return total;
	};
	
	self.addDeliveryRequest = function(){
		var itemDeliveryRequestList = [];
		var itemRequestList = self.itemRequestList;
		
		for(i = 0; i < itemRequestList.length; i++){
			var itemDeliveryRequest = {
				item_code: itemRequestList[i].item_code,
				requested_quantity: itemRequestList[i].quantity,
				item_name: itemRequestList[i].item_name,
				attributes: itemRequestList[i].attributes,
				remaining: itemRequestList[i].quantity - self.totalItemInItemDeliveryRequest(itemRequestList[i].item_unit, itemRequestList[i].item_code),
				item_unit: itemRequestList[i].item_unit
			};
			
			itemDeliveryRequestList.push(itemDeliveryRequest);
		}
		
		var newDeliveryRequest = {
			date: '',
			warehouse_id: '',
			remark: '',
			item_delivery_request_list: itemDeliveryRequestList,
			editMode: true
		};
		self.deliveryRequestList.push(newDeliveryRequest);
	};
	
	self.checkDeliveryRequest = function(deliveryRequest){
		var index = self.deliveryRequestList.indexOf(deliveryRequest);
		var itemDeliveryRequest = self.deliveryRequestList[index].item_delivery_request_list;
		var valid = true;
		
		for(var i = 0; i < itemDeliveryRequest.length; i++){
			if( itemDeliveryRequest[i].quantity > itemDeliveryRequest[i].remaining) {
				valid = false;
			}
		}
		
		if (valid) {
			self.deliveryRequestList[index].editMode = false;
		}
		else {
			SweetAlert.swal({
				title: "Jumlah Permohonan Pengiriman Tidak Boleh Lebih Besar Dari Jumlah Belum Direncanakan",
				type: "error",
				animation: "slide-from-top"
			});
		}
	};
	
	self.isAllowedToAddNewDeliveryRequest = function() {
		if( self.edit.itemList ){
			return false;
		}
		else {
			for (var i = 0 ; i < self.deliveryRequestList.length ; i++) {
				if (self.deliveryRequestList[i].editMode == true) {
					return false;
				}
			}
		}
		return true;
	};
	
	self.isPurchaseValid = function (supplier){
		var itemRequest = self.itemRequestList;
		var deliveryRequest = self.deliveryRequestList;
		var supplierValid, itemsValid, deliveryValid, approverValid = false;
		
		if(supplier.vendor_id != null){
			supplierValid = true;
		}
		else {
			supplierValid = false;
		}
		
		if(self.approve.user_id !== undefined){
			approverValid = true;
		}
		
		angular.forEach(itemRequest, function(item) {
			if(item.item_code != "" && item.quantity != "" && item.quantity != 0){
				itemsValid = true;
			}
			else {
				itemsValid = false;
			}
		});
		
		angular.forEach(deliveryRequest, function(item) {
			if(item.editMode == false ){
				deliveryValid = true;
			}
			else {
				deliveryValid = false;
			}
		});
		
		if(supplierValid && itemsValid && deliveryValid && approverValid){
			return true;
		}else{
			return false;
		}
	};
	
	self.clearData = function (){
		self.supplier = [];
		self.userList = [];
		self.approve = [];
		self.deliveryRequestList = [];
		self.itemRequestList = [];
		self.edit = {};
		self.edit.itemList = true;
		self.edit.sendEmail = false;
	}
	
	return self;
});