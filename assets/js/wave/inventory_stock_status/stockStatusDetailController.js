app.controller('stockStatusDetailController', function($http ,$scope, $filter, $modal, $state, $window, $stateParams, SiteService, ItemService, ngTableParams, SweetAlert, $timeout, $q) {
	$scope.tree_data = [];
	$scope.inventoryList = [];
	var itemCode = $stateParams.item_code;
    var siteReference = $stateParams.site_reference;
    var storage_name = $stateParams.storage_name;
    var attributes = $stateParams.attributes;
    var tag = $stateParams.tag;
    var getInvent = {
        item_code: itemCode,
        site_reference: siteReference,
        storage_name: storage_name,
        attributes: attributes,
        tag: tag
    };
	$scope.items;
    $scope.movementCodeList = [];
	
	$scope.openStockCard = function(){
		var data = "Kuning";
		SiteService.stockCardPDF(data).success(function(){});
	};
	ItemService.getItemByItemCode(itemCode).success(function(data){
		if (data.call_status == 'success') {
			$scope.item = data.item_details;
		}
		$scope.items = data.item_details;
	});
    SiteService.getMovementCodeList().success(function(data){
        if (data.call_status == 'success') {
            $scope.movementCodeList = data.movement_code_list;
        }
    });
	$scope.col_defs = [
		{
			field: "quantity",
			displayName: "Tersedia",
			sortable : true,										
			sortingType : "number",	
		},
		{
			field: "quality",
			displayName: "Quality",
			sortable : true,										
			sortingType : "number",
			filterable: true
		},
		{
			field: "block_status",
			displayName: "Block",
			sortable : true,										
			sortingType : "string"
		},
		{
			field: "konsinyasi",
			displayName: "Konsinyasi"
		},
		{
			field: "proses",
			displayName: "Proses Pengadaan"
		},
		{
			field: "so",
			displayName: "Sales Order"
		},
		{
            field: "batch_reference",
            is: "is",
			displayName: "Action",
			cellTemplate: 
			"	<div class=\"btn-group\" dropdown ng-controller=\"stockStatusDetailController\">\n"+
			"		<button type=\"button\" class=\"btn btn-wide btn-primary dropdown-toggle\" dropdown-toggle ng-disabled=\"disabled\">\n" +
			"			Opsi <span class=\"caret\"></span>\n" +
			"		</button>\n" +
			"		<ul class=\"dropdown-menu\" role=\"menu\">\n" +
			"			<li>\n" +
			"				<a ui-sref=\"app.inventory.stock_movement({item_code: '{{ row.branch[col.field] }}'})\">Pergerakan</a>\n" +
			"			</li>\n" +
			"			<li>\n" +
			"				<a ng-if=\"row.level===4 ||  row.branch[col.is] == 'batch' \" ui-sref=\"app.inventory.stock_info_batch({batch_reference: '{{ row.branch[col.field] }}'})\">Info Batch</a>\n" +
			"			</li>\n" +
			"			<li>\n" +
			"				<a ng-if=\"row.level===$last ||  row.branch[col.is] == 'batch' \" ng-click=\"openStockCard()\">Stock Card</a>\n" +
			"			</li>\n" +
			"		</ul>\n" +
			"	</div>",
		}
	];
        //ItemService.getInventoryList().success(function(data){
        ItemService.getInventoryList(getInvent).success(function(data){
			if (data.call_status == 'success') {
				console.log(data);
				var tree;
                var rawTreeData = data.inventList;
				var myTreeData = getTree(rawTreeData, 'selfId', 'parentId');
				$scope.tree_data = myTreeData;
				$scope.my_tree = tree = {};
				$scope.expanding_property = {
					field: "name",
					displayName: "Site/Lokasi/Bin/Batch/Attributes",
					sortable : true,
                    filterable: true,
				};
				function getTree(data, primaryIdName, parentIdName) {
					if (!data || data.length == 0 || !primaryIdName || !parentIdName)
						return [];
					var tree = [],
						rootIds = [],
						item = data[0],
						primaryKey = item[primaryIdName],
						treeObjs = {},
						parentId,
						parent,
						len = data.length,
						i = 0;
					while (i < len) {
						item = data[i++];
						primaryKey = item[primaryIdName];
						treeObjs[primaryKey] = item;
						parentId = item[parentIdName];
						if (parentId) {
							parent = treeObjs[parentId];
							if (parent.children) {
								parent.children.push(item);
							} else {
								parent.children = [item];
							}
						} else {
							rootIds.push(primaryKey);
						}
					}
					for (var i = 0; i < rootIds.length; i++) {
						tree.push(treeObjs[rootIds[i]]);
					};
					return tree;
				}
			}
		});
});
