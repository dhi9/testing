app.factory('ItemFactory', function ($http, apiUrl, SweetAlert) {
	var url = apiUrl + 'itemapi/';

	var self = {};
		self.itemList = [];
		self.itemRequestList = [];
		self.tagList = [];
		self.tagListWithStock = [];
		self.itemTagList = [];

	self.getRawItemList = function (){
		return $http.get(url + 'get_raw_item_list')
			.success(function(data){
				if (data.call_status === "success") {
					self.itemList = data.item_list;
				}
			})
			.error(function(){
				//error messages
			});
	};
	self.getTagList = function (){
		return $http.get(url + 'get_tag_list')
			.success(function(data){
				if (data.call_status === "success") {
					self.tagList = data.tag_list;
				}
			})
			.error(function(){
				//error messages
			});
	};
	self.getTagListWithStock = function (){
		return $http.get(url + 'get_tag_list_with_stock')
			.success(function(data){
				if (data.call_status === "success") {
					self.tagListWithStock = data.tag_list;
				}
			})
			.error(function(){
				//error messages
			});
	};
	self.getItemTagList = function (item_code){
		return $http.get(url + 'get_item_tag_list/' + item_code)
			.success(function(data){
				if (data.call_status === "success") {
					self.itemTagList = data.tag_list;
				}
			})
			.error(function(){
				//error messages
			});
	};

	self.getItemUomConversionListByItemCode = function(index, itemCode){
		return $http.get(url + 'get_item_uom_conversion_list_by_item_code/' + itemCode)
			.success(function(data){
				if (data.call_status === "success") {
					self.itemRequestList[index].uom_list = data.conversion_list;
				}
			})
			.error(function(){

			});
	}
	self.isItemTagDuplicate = function(tag){
		var duplicate = false;
		for (var i = self.itemTagList.length - 1; i >= 0; i--) {
			//if(angular.lowercase(self.itemTagList[i].item_name) == angular.lowercase(tag.tag_name)){
			if(angular.lowercase(self.itemTagList[i].tag_name) == angular.lowercase(tag.tag_name)){
				duplicate = true;
				return duplicate;
			}
		};
		return duplicate;
	}
	self.insertItemTag = function(item_tag, item){
		var insertTag = {
			'tag_name':item_tag,
			'item_code':item
		};
		return $http.post(url + 'insert_item_tag', insertTag)
			.success(function(data){
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Sussess",
						text: "Tag berhasil ditambah",
						type: "success",
						animation: "slide-from-top"
					});
				}else{
					SweetAlert.swal({
						title: "Perhatian",
						text: "Tag sudah dipilih",
						type: "warning",
						animation: "slide-from-top"
					});
				}
			})
			.error(function(){

			});
	}

	self.insertTag = function(tag){
		return $http.post(url + 'get_tag', tag.tag_name)
			.success(function(data){
				if (data.call_status === "success") {
					console.log(data.tag);
					if (data.tag !== null) {
						if(data.tag.status == "X"){
							var activetag = {
								tag_id : data.tag.tag_id,
								tag_name : tag.tag_name,
								status : "A"
							};
							$http.post(url + 'update_tag', activetag).success(function(){
								SweetAlert.swal({
									title: "Sussess",
									text: "Tag berhasil ditambah",
									type: "success",
									animation: "slide-from-top"
								});
							});
						}else{
							SweetAlert.swal({
								title: "Error",
								text: "Tag sudah ada",
								type: "error",
								animation: "slide-from-top"
							});
						}
					}else{
						$http.post(url + 'insert_tag', tag.tag_name).success(function(){
							SweetAlert.swal({
								title: "Sussess",
								text: "Tag berhasil ditambah",
								type: "success",
								animation: "slide-from-top"
							});
						});
					}
				}
			})
			.error(function(){

			});
	}

	self.removeItemTag = function(tag){
		var item_tag_id = tag.item_tag_id;
		return $http.post(url + 'remove_item_tag', item_tag_id)
			.success(function(data){
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Sussess",
						text: "Tag berhasil dihapus",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function(){
				//error messages
			});
	};

	self.updateTag = function(tag){
		return $http.post(url + 'update_tag', tag)
			.success(function(data){
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Tag berhasil diubah",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function(){
				//error messages
			});
	};

	self.removeTag = function(tag){
		return $http.post(url + 'update_tag', tag)
			.success(function(data){
				if (data.call_status === "success") {
					SweetAlert.swal({
						title: "Success",
						text: "Tag dihapus",
						type: "success",
						animation: "slide-from-top"
					});
				}
			})
			.error(function(){
				//error messages
			});
	};

	return self;
});