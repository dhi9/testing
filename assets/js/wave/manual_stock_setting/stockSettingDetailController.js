app.controller('StockSettingDetailController', function($scope, $modal, $state, $stateParams, InventoryService, SiteService, SweetAlert, AttributeFactory ) {
	var stockSettingReference = $stateParams.reference;
	
	$scope.attributeList = AttributeFactory.attributeList;
	AttributeFactory.getAttributeList().then(function(){
		$scope.attributeList = AttributeFactory.attributeList;
	});
	SiteService.getSiteList().success(function(data){
		$scope.siteList = data.site_list;
	});
	
	$scope.getBinById = function(index, binId){
		SiteService.getBinById(binId).success(function(data){
			if (data.bin !== null) {
				$scope.itemSettingList[index].bin_name = data.bin.bin_name;
			}else{
				$scope.itemSettingList[index].bin_name = "";
			}
		});
	};
	
	SiteService.getStorageList().success(function(data){
		$scope.storageList = data.storage_list;
	});
	
	InventoryService.getStockSettingByReference(stockSettingReference).success(function(data){
		$scope.stockSetting = data.stock_setting;
		$scope.stockSetting.posting_date = new Date(moment($scope.stockSetting.posting_date));
		
		$scope.itemSettingList = data.stock_setting_items;
		
		for (var i = 0; i < $scope.itemSettingList.length ; i += 1) {
			$scope.itemSettingList[i].attributes = JSON.parse($scope.itemSettingList[i].attributes);
		}
		
		console.log($scope.itemSettingList);
		
		for(var i = 0; i < $scope.itemSettingList.length; i++){
			$scope.getBinById(i, $scope.itemSettingList[i].bin_id);
		}
	});

	$scope.reject = function (){
		InventoryService.rejectStockSettingByReference(stockSettingReference).success(function(data){
			if (data.call_status == 'success') {
						SweetAlert.swal({
							title: "Dihapus",
							text: "Manual Stock " + stockSettingReference +" Berhasil Ditolak/ Dihapus",
							type: "success",
							animation: "slide-from-top"
						});
						$state.go("app.inventory.manual_stock_setting");
					}
		})
	}
});