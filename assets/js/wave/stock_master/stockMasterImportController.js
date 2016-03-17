app.controller('StockMasterImportController', function($scope, $modal, $state, SweetAlert, InventoryService) {
	$scope.validData = [];
	$scope.validInsertData = [];
	$scope.validUpdateData = [];
	$scope.invalidData = [];
	$scope.progress = false;
	$scope.loadingImportStock = false;
	$scope.workbook = null;
	$scope.sheetIndex = -1;
	$scope.columnList = {
		no:"No",
		action:"Baru/Ubah",
		item_code:"ArticleID/SKU",
		item_name:"Nama",
		item_type:"Tipe",
		category:"Kategori",
		extra1:"Extra1",
		extra2:"Extra2",
		remark:"Keterangan",
		item_unit:"UOM Dasar",
		unit_description:"Deskripsi UOM",
		value_currency:"Mata Uang",
		value_amount:"Nilai per UOM Dasar",
		availability:"Stock Tersedia untuk Dibeli",
		sell_price_type:"Harga Jual(Persen/Tambah/Tetap)",
		sell_price_value:"Nilai Harga Jual",
		discount_type:"Diskon(Normal/Persen/Tetap)",
		discount_value:"Nilai Diskon",
		discount_start_date:"Tgl Diskon Mulai",
		discount_end_date:"Tgl Diskon Selesai",
		tag:"Tag",
		attributes:"Attributes"
}
	document.getElementById('importFile').addEventListener('change', function () {
		loadWorkbook();
	});

	function loadWorkbook() {
		var reader = new FileReader(),
			fileData;

		reader.onload = function (e) {
			$scope.workbook = wijmo.xlsx.XlsxConverter.import(reader.result);
			$scope.drawSheet($scope.workbook.activeWorksheet || 0);
			if (!$scope.$root.$$phase) {
				$scope.$apply();
			}
		};
		var file = document.getElementById('importFile').files[0];
		if (file) {
			reader.readAsArrayBuffer(file);
		}
	}

	$scope.drawSheet = function (sheetIndex) {
		var drawRoot = document.getElementById('tableHost');
		drawRoot.textContent = '';
		$scope.sheetIndex = sheetIndex;
		xlsxImport.drawWorksheet($scope.workbook, sheetIndex, drawRoot, 200, 100);
	}

	$scope.checkWorkbook = function (){
		if($scope.workbook != null){
			$scope.loadingImportStock = true;
			$scope.workbook.column_list = $scope.columnList;
			InventoryService.isDataForImportStockValid($scope.workbook).success(function(data){
				if(data.call_status == "success"){
					$scope.progress = true;
					$scope.validData = data.result;
					$scope.validInsertData = data.check.insert_valid;
					$scope.validUpdateData = data.check.update_valid;
					$scope.invalidData = data.check.invalid;
					$scope.loadingImportStock = false;
				}
			});
		}
	}
	$scope.startImportStock = function (){
		InventoryService.startImportStock($scope.validData).success(function(data){
			if(data.call_status == "success"){
				SweetAlert.swal({
						title: "Import Selesai",
						text: "Import data telah selesai",
						type: "success",
						confirmButtonText: "Kembali!",
						closeOnConfirm: true},
					function(){
						$state.go('app.master.stock');
					});
			}
		});
	}
});
