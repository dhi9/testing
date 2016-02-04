app.controller('StockMasterEditController', function($scope, $modal, $state, $stateParams, ItemService, ItemFactory, SweetAlert, PurchaseService, CategoryFactory) {
	var itemCode = $stateParams.item_code;
	
	$scope.conversionList = [];
	$scope.historyList = [];
	$scope.item = {};
	$scope.item.sell_price_type = "F";
	$scope.item.discount_type = "N";
	$scope.categoryActiveList = [];
	CategoryFactory.getCategoryActiveList().then(function(){
		$scope.categoryActiveList = CategoryFactory.categoryActiveList;
	});
	$scope.tagList = ItemFactory.tagList;
	ItemFactory.getTagList().then(function(){
		$scope.tagList = ItemFactory.tagList;
	});
	$scope.itemTagList = ItemFactory.itemTagList;
	ItemFactory.getItemTagList(itemCode).then(function(){
		$scope.itemTagList = ItemFactory.itemTagList;
	});
	$scope.addItemTag = function(add_tag_input){
		ItemFactory.insertItemTag(add_tag_input, itemCode).then(function(){
			ItemFactory.getItemTagList(itemCode).then(function(){
				$scope.itemTagList = ItemFactory.itemTagList;
			});
		});
	};
	$scope.removeItemTag = function(tag){
		SweetAlert.swal({
				title: "Perhatian!",
				text: "Anda yakin akan menghapus tag ini?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: " Yes ",
				closeOnConfirm: false,
				closeOnCancel: true,
                animation: "slide-from-top"
			}, function(isConfirm){
				if (isConfirm) {
					ItemFactory.removeItemTag(tag);
					ItemFactory.getItemTagList(itemCode).then(function(){
						$scope.itemTagList = ItemFactory.itemTagList;
					});
				}
			});
	};
	ItemService.getItemByItemCode(itemCode).success(function(data){
		if (data.call_status == 'success') {
			$scope.item = data.item_details;
			if ($scope.item.availability == '1') {
				$scope.item.availability = true;
			}
			$scope.item.value_amount = parseFloat($scope.item.value_amount);
			
			$scope.item.sell_price_perc_last_buy_price = parseFloat($scope.item.sell_price_perc_last_buy_price);
			$scope.item.sell_price_markup_last_buy_price = parseFloat($scope.item.sell_price_markup_last_buy_price);
			$scope.item.sell_price_fix = parseFloat($scope.item.sell_price_fix);
			$scope.item.discount_perc = parseFloat($scope.item.discount_perc);
			$scope.item.discount_special_price = parseFloat($scope.item.discount_special_price);
			
			$scope.item.discount_perc_start_date = new Date(moment($scope.item.discount_perc_start_date));
			$scope.item.discount_perc_end_date = new Date(moment($scope.item.discount_perc_end_date));
			$scope.item.discount_special_price_start_date = new Date(moment($scope.item.discount_special_price_start_date));
			$scope.item.discount_special_price_end_date = new Date(moment($scope.item.discount_special_price_end_date));
			
		}
	});
	
	PurchaseService.getSiteList().success(function(data){
		if(data.call_status == "success"){
			$scope.siteList = data.site_list;
		}
	});
	
	PurchaseService.getStorageList().success(function(data){
		if(data.call_status == "success"){
			$scope.storageList = data.storage_list;
		}
	});
	
	PurchaseService.getBinList().success(function(data){
		if(data.call_status == "success"){
			$scope.binList = data.bin_list;
		}
	});
	
	ItemService.getItemAlternateListByItemCode(itemCode).success(function(data){
		if(data.call_status == "success"){
			$scope.itemAlternateList = data.item_alternate_list;
		}
	});
	
	$scope.loadConversionList = function () {
		ItemService.getItemUomConversionListByItemCode(itemCode).success(function(data){
			if (data.call_status == 'success') {
				$scope.conversionList = data.conversion_list;
			}
		});
	}
	$scope.loadConversionList();
	
	$scope.updateItem = function () {
		ItemService.updateItem($scope.item).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Item berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
			}
		});
	};
		
	$scope.updateItemBaseUom = function () {
		ItemService.updateItemBaseUom($scope.item).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "UOM Dasar berhasil diubah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$scope.loadConversionList();
			}
		});
	};
	
	$scope.deleteConversion = function (index) {
		var conversion = $scope.conversionList[index];
		
		SweetAlert.swal({
			title: "Hapus Konversi?",
			text: "Anda akan menghapus konversi " + conversion.alternative_uom + " - " + conversion.alternative_uom_description + ".",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#D43F3A",
			confirmButtonText: "Hapus",
			cancelButtonText: "Batal",
			closeOnConfirm: false,
			animation: "slide-from-top"
		},
		function(isConfirm) {
			if (isConfirm) {
				ItemService.deleteItemUomConversion(conversion).success(function(data){
					$scope.conversionList.splice(index, 1);
					SweetAlert.swal("Sukses", "Konversi berhasil dihapus.", "success");
				});
			}
			else {
			
			}
		});
	}
	
	$scope.newConversionModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'new_conversion_modal',
			controller: 'NewConversionModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
	
	$scope.editConversionModal = function (index) {
		var modalInstance = $modal.open({
			templateUrl: 'edit_conversion_modal',
			controller: 'EditConversionModalCtrl',
			size: 'lg',
			resolve: {
				index: function () {
					return index;
				}
			},
			scope: $scope
		});
	};
	
	$scope.removeItemLocation = function (index) {
		$scope.item.location_list[index].status = 'X';
	};
	$scope.removeItemAlternate = function (index) {
		$scope.itemAlternateList[index].status = 'X';
	};
	
	$scope.updateItemLocation = function () {
		ItemService.updateItemLocation($scope.item.location_list).success(function(data){
			SweetAlert.swal({
				title: data.title,
				text: data.text,
				type: data.call_status,
				animation: "slide-from-top"
			});
		});
	};
	
	$scope.updateItemAlternate = function () {
		ItemService.updateItem($scope.item);
		ItemService.updateItemAlternate($scope.itemAlternateList).success(function(data){
			SweetAlert.swal({
				title: data.title,
				text: data.text,
				type: data.call_status,
				animation: "slide-from-top"
			});
		});
	};
	$scope.historyModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'history_modal',
			controller: 'HistoryModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
	
	$scope.itemLocationModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'item_location_modal',
			controller: 'ItemLocationModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
	
	$scope.itemAlternateModal = function () {
		var modalInstance = $modal.open({
			templateUrl: 'item_alternate_modal',
			controller: 'ItemAlternateModalCtrl',
			size: 'lg',
			scope: $scope
		});
	};
});

app.controller('NewConversionModalCtrl', function ($scope, $modalInstance, ItemService, SweetAlert) {
	$scope.uom = {};
	var insertData = {};
	
	$scope.submitUomConversion = function () {
		$scope.uom.item_code = $scope.item.item_code;
		$scope.uom.base_uom = $scope.item.item_unit;
		$scope.uom.base_uom_description = $scope.item.unit_description;
		$scope.uom.alternative_amount = 1;
		
		ItemService.insertItemUomConversion($scope.uom).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Konversi berhasil ditambah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$scope.conversionList.push($scope.uom);
				$modalInstance.close();
			}
		});
	};
	
	$scope.closeModal = function () {
		$modalInstance.close();
	};
});

app.controller('EditConversionModalCtrl', function ($scope, $modalInstance, index, ItemService, SweetAlert) {
	var conversion = $scope.conversionList[index];
	conversion.base_amount = parseFloat(conversion.base_amount);
	$scope.uom = conversion;
	
	$scope.updateUomConversion = function () {
		ItemService.updateItemUomConversion($scope.uom).success(function(data){
			SweetAlert.swal({
				title: "Berhasil",
				text: "Konversi berhasil diubah.",
				type: "success",
				animation: "slide-from-top"
			});
			
			$scope.conversionList[index] = $scope.uom;
			$modalInstance.close();
		});
	};
	
	$scope.closeModal = function () {
		$modalInstance.close();
	};
});

app.controller('HistoryModalCtrl', function ($scope, $modalInstance, ItemService) {
	ItemService.getItemUomHistoryListByItemCode($scope.item.item_code).success(function(data){
		if (data.call_status == 'success') {
			$scope.historyList = data.history_list;
			
			for(var i = 0; i < $scope.historyList.length; i++)
			{
				$scope.historyList[i].datetime = new Date($scope.historyList[i].datetime);
			}
		}
	});
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});

app.controller('ItemLocationModalCtrl', function ($scope, $modalInstance, $filter, ItemService) {
	$scope.location = {
		'item_code': $scope.item.item_code,
		'site_id': null,
		'site_reference': '',
		'storage_id': null,
		'storage_name': '',
		'bin_id': null,
		'bin_name': '',
		'status': 'A',
	};
	
	$scope.addItemLocation = function (location) {
		if (location.site_id != null) {
			location.site_reference = $filter('filter')($scope.siteList, { site_id: location.site_id })[0]['site_reference'];
		}
		if (location.storage_id != null) {
			location.storage_name = $filter('filter')($scope.storageList, { storage_id: location.storage_id })[0]['storage_name'];
		}
		if (location.bin_id != null) {
			location.bin_name = $filter('filter')($scope.binList, { bin_id: location.bin_id })[0]['bin_name'];
		}
		
		$scope.item.location_list.push(location);
		$scope.closeModal();
	};
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});


app.controller('ItemAlternateModalCtrl', function ($scope, $modalInstance, $filter, ItemService) {
	$scope.alternate = {
		'item_code': $scope.item.item_code,
		'alternate_code': null,
		'alternate_name': '',
		'status': 'A',
	};
	
	$scope.addItemAlternate = function (alternate) {
				console.log(alternate);
		$scope.itemAlternateList.push(alternate);
		$scope.closeModal();
	};
	
	$scope.closeModal = function () {
		$modalInstance.dismiss();
	};
});



app.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        if (!ngModel) return;

        ngModel.$render = function() {}

        element.bind('change', function(e) {
          var element = e.target;
          if(!element.value) return;

          element.disabled = true;
          $q.all(slice.call(element.files, 0).map(readFile))
            .then(function(values) {
              if (element.multiple) ngModel.$setViewValue(values);
              else ngModel.$setViewValue(values.length ? values[0] : null);
              element.value = null;
              element.disabled = false;
            });

          function readFile(file) {
            var deferred = $q.defer();

            var reader = new FileReader()
            reader.onload = function(e) {
              deferred.resolve(e.target.result);
            }
            reader.onerror = function(e) {
              deferred.reject(e);
            }
            reader.readAsDataURL(file);

            return deferred.promise;
          }

        }); //change

      } //link

    }; //return

  }) //appFilereader
;
