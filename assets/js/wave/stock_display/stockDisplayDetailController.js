app.controller('StockDisplayDetailController', function($scope, $modal, $state, ItemService, SweetAlert, CategoryFactory) {
	$scope.item = {};
	$scope.categoryActiveList = [];
	CategoryFactory.getCategoryActiveList().then(function(){
		$scope.categoryActiveList = CategoryFactory.categoryActiveList;
	});
	$scope.detailStock = function () {
		ItemService.detailStock($scope.item).success(function(data){
			if (data.call_status == 'success') {
				SweetAlert.swal({
					title: "Berhasil",
					text: "Item berhasil ditambah.",
					type: "success",
					animation: "slide-from-top"
				});
				
				$state.go('app.master.stock');
			}else if (data.call_status == 'duplicate') {
				SweetAlert.swal({
					title: "Perhatian",
					text: "Item dengan ItemID/SKU sudah ada.",
					type: "warning",
					animation: "slide-from-top"
				});
			}
		});
	};
});