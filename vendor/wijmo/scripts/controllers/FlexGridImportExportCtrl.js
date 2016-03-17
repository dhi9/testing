'use strict';

angular.module('app').controller('FlexGridImportExportCtrl', ['$scope', 'dataService', function ($scope, dataService) {
	$scope.ctx = {
		flexGrid: null,
		data: dataService.getProductOrders(500),
		includeColumnHeader: true
	}

	// export 
	$scope.exportExcel = function () {
		var result = wijmo.grid.xlsx.FlexGridXlsxConverter.export($scope.ctx.flexGrid, { includeColumnHeader: $scope.ctx.includeColumnHeader, needGetCellStyle: false });

		if (navigator.msSaveBlob) {
			// Saving the xlsx file using Blob and msSaveBlob in IE.
			var blob = new Blob([result.base64Array]);

			navigator.msSaveBlob(blob, $('#export').attr("download"));
		} else {
			$('#export')[0].href = result.href();
		}
	};

	// import
	$scope.importExcel = function () {
		if ($scope.ctx.flexGrid) {
			var reader = new FileReader(),
				fileData;

			reader.onload = function (e) {
				wijmo.grid.xlsx.FlexGridXlsxConverter.import(reader.result, $scope.ctx.flexGrid, { includeColumnHeader: $scope.ctx.includeColumnHeader });
			};
			if ($('#importFile')[0].files[0]) {
				reader.readAsArrayBuffer($('#importFile')[0].files[0]);
			}
		}
	}

	// update group setting
	$scope.$watch('ctx.flexGrid', function () {
		updateGroup();
	});

	// update group setting for the flex grid
	function updateGroup() {
		var flex = $scope.ctx.flexGrid,
			groupNames = ['Product', 'Country', 'Amount'],
			cv,
			propName,
			groupDesc;

		if (flex) {
			// get the collection view, start update
			cv = flex.collectionView;
			cv.beginUpdate();

			// clear existing groups
			cv.groupDescriptions.clear();

			// add new groups
			for (var i = 0; i < groupNames.length; i++) {
				propName = groupNames[i].toLowerCase();
				if (propName == 'amount') {

					// group amounts in ranges
					// (could use the mapping function to group countries into continents, 
					// names into initials, etc)
					groupDesc = new wijmo.collections.PropertyGroupDescription(propName, function (item, prop) {
						var value = item[prop];
						if (value > 1000) return 'Large Amounts';
						if (value > 100) return 'Medium Amounts';
						if (value > 0) return 'Small Amounts';
						return 'Negative';
					});
					cv.groupDescriptions.push(groupDesc);
				} else if (propName) {

					// group other properties by their specific values
					groupDesc = new wijmo.collections.PropertyGroupDescription(propName);
					cv.groupDescriptions.push(groupDesc);
				}
			}

			// done updating
			cv.endUpdate();
		}
	}
}]);