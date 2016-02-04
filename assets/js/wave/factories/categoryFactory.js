app.factory('CategoryFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'categoryapi/';
	var self = {};
	
	self.category = {};
	self.newCategory = {};
	self.categoryList = [];
	self.categoryActiveList = [];
	
	self.getCategoryList = function(){
		return $http.get(url + 'get_category_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.categoryList = data.category_list;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	self.getCategoryActiveList = function(){
		return $http.get(url + 'get_category_active_list')
			.success(function(data){
				if(data.call_status == "success"){
					self.categoryActiveList = data.category_list;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	
	self.getCategoryById = function(id){
		return $http.get(url + 'get_category_by_id/' + id)
			.success(function(data){
				if(data.call_status == "success"){
					self.category = data.category;
				}
			})
			.error(function () {
					//NotificationFactory.showError();
			});
	}
	
	self.insertCategory =  function (){
		var category = self.newCategory;
		return $http.post(url + 'insert_category', category)
			.success(function(data){
				if(data.call_status = "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Category "+ category.category_name +" berhasil disimpan ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.category = {};
				}
			})
	}
	
	self.updateCategory = function (){
		var category = self.category;
		return $http.post(url + 'update_category', category)
			.success(function(data){
				if(data.call_status = "success"){
					SweetAlert.swal({
						title: "Success",
						text: "Category "+ category.category_name +" berhasil diubah ",
						type: "success",
						animation: "slide-from-top"
					});
					
					self.category = {};
				}
			})
	}
	
	self.clear = function (){
		self.newCategory = {};
	}
	return self;
});