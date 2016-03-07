var XlsxExport;
(function (XlsxExport) {
	function exportExpenseReport(employees) {
		// Namespace and XlsxConverter shortcuts.
		var xcNs = wijmo.xlsx, xc = xcNs.XlsxConverter;
		var book = { sheets: [] };
		var dateFormat = xc.xlsxDateFormat('d'), stdNumWidth = 85, simpleCaptionStyle = { hAlign: 3 /* Right */ }, accentCaptionStyle = { font: { color: '#808097' } }, totalCaptionStyle = {
			basedOn: simpleCaptionStyle,
			font: { bold: true },
			hAlign: 3 /* Right */
		}, valueStyle = { font: { family: 'Arial' } }, highlightedValueStyle = { basedOn: valueStyle, fill: { color: '#ffffff' } }, tableHeaderStyle = { font: { bold: true }, border: { size: '1px' }, fill: { color: '#ffffff' } }, tableFooterCurrencyStyle = { basedOn: tableHeaderStyle, format: xc.xlsxNumberFormat('c2'), hAlign: 3 /* Right */ }, tableValueStyle = { fill: { color: '#ffffff' } }, tableDateStyle = { basedOn: tableValueStyle }, tableCurrencyStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('c2') }, tableIntegerStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('00') };
		for (var emplIdx = 0; emplIdx < employees.length; emplIdx++) {
			var empl = employees[emplIdx], sheet = { rows: [] }, rows = sheet.rows;

			book.sheets.push(sheet);
			sheet.name = empl.Name;
			sheet.cols = [
				{ width: 50 },
				{ width: 100 },
				{ width: 200 },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: 100 },
				{ width: 72 },
				{ width: 200 },
				{ width: 200 },
				{ width: 230 },
				{ width: 200 },
				{ width: 125 },
				{ width: 125 },
				{ width: 200 }];

			//sheet.cols = [{ width: '1ch', style: { fill: { color: '#00ff00' } } }, { width: 100 }, { width: 230 }, {}, { width: 95 }, { width: 130 }, {}, {}, { width: 105 }];

			//================ Expense items table ==========================
			// Table header
			rows[0] = {
				style: { hAlign: 2 /* Center */ },
				cells: [
					{ value: 'No' },
					{ value: 'ArticleID/SKU' },
					{ value: 'Nama' },
					{ value: 'Kategori' },
					{ value: 'Extra1' },
					{ value: 'Extra2' },
					{ value: 'Keterangan' },
					{ value: 'UOM Dasar' },
					{ value: 'Deskripsi UOM' },
					{ value: 'Mata Uang' },
					{ value: 'Nilai per UOM Dasar' },
					{ value: 'Stock Tersedia untuk Dibeli' },
					{ value: 'Harga Jual(Persen/Tambah/Tetap)' },
					{ value: 'Diskon(Normal/Persen/Tetap)' },
					{ value: 'Tgl Diskon Mulai' },
					{ value: 'Tgl Diskon Selesai' },
					{ value: 'Tag' },
				]
			};

			// Table items
			var expenses = empl.Expenses, firstIdx = 1, totalIdx = firstIdx + expenses.length;
			for (var i = 0; i < expenses.length; i++) {
				var curExpense = expenses[i], rowIdx = firstIdx + i;
				rows[rowIdx] = {
					cells: [
						{ value: rowIdx },
						{ value: curExpense.item_code },
						{ value: curExpense.item_name },
						{ value: curExpense.category_name },
						{ value: curExpense.extra1 },
						{ value: curExpense.extra2 },
						{ value: curExpense.remark },
						{ value: curExpense.item_unit },
						{ value: curExpense.unit_description },
						{ value: curExpense.value_currency },
						{ value: curExpense.value_amount },
						{ value: curExpense.availability },
						{ value: curExpense.sell_price_type },
						{ value: curExpense.discount_type },
						{ value: curExpense.discount_start_date },
						{ value: curExpense.discount_end_date },
						{ value: curExpense.tag }//,
						/*
						{
							formula: 'SUM(' + xc.xlsxIndex(rowIdx, 3) + ':' + xc.xlsxIndex(rowIdx, 7) + ')+' + xc.xlsxIndex(rowIdx, 8) + '*' + xc.xlsxIndex(rowIdx, 9),
							style: tableCurrencyStyle
						}
						*/
					]
				};
			}

		}

		return book;
	}
	function downloadTemplate() {
		var template = [{
			Advance: 1000,
			Attachment: true,
			Department: "Sales",
			Expenses:[],
			Id: "E892659",
			Manager: "Andrew Fuller",
			Name: "Stock",
			Position: "Sales Representative",
			Purpose: "On business",
			SSN: "A37830"
		}];
		// Namespace and XlsxConverter shortcuts.
		var xcNs = wijmo.xlsx, xc = xcNs.XlsxConverter;
		var book = { sheets: [] };
		var dateFormat = xc.xlsxDateFormat('d'), stdNumWidth = 85, simpleCaptionStyle = { hAlign: 3 /* Right */ }, accentCaptionStyle = { font: { color: '#808097' } }, totalCaptionStyle = {
			basedOn: simpleCaptionStyle,
			font: { bold: true },
			hAlign: 3 /* Right */
		}, valueStyle = { font: { family: 'Arial' } }, highlightedValueStyle = { basedOn: valueStyle, fill: { color: '#ffffff' } }, tableHeaderStyle = { font: { bold: true }, border: { size: '1px' }, fill: { color: '#ffffff' } }, tableFooterCurrencyStyle = { basedOn: tableHeaderStyle, format: xc.xlsxNumberFormat('c2'), hAlign: 3 /* Right */ }, tableValueStyle = { fill: { color: '#ffffff' } }, tableDateStyle = { basedOn: tableValueStyle }, tableCurrencyStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('c2') }, tableIntegerStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('00') };
		for (var emplIdx = 0; emplIdx < template.length; emplIdx++) {
			var empl = template[emplIdx], sheet = { rows: [] }, rows = sheet.rows;

			book.sheets.push(sheet);
			sheet.name = empl.Name;
			sheet.cols = [
				{ width: 50 },
				{ width: 100 },
				{ width: 100 },
				{ width: 200 },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: 100 },
				{ width: 72 },
				{ width: 200 },
				{ width: 200 },
				{ width: 230 },
				{ width: 200 },
				{ width: 125 },
				{ width: 125 },
				{ width: 200 }];

			//sheet.cols = [{ width: '1ch', style: { fill: { color: '#00ff00' } } }, { width: 100 }, { width: 230 }, {}, { width: 95 }, { width: 130 }, {}, {}, { width: 105 }];

			//================ Expense items table ==========================
			// Table header
			rows[0] = {
				style: { hAlign: 2 /* Center */ },
				cells: [
					{ value: 'No' },
					{ value: 'Baru/Ubah' },
					{ value: 'ArticleID/SKU' },
					{ value: 'Nama' },
					{ value: 'Kategori' },
					{ value: 'Extra1' },
					{ value: 'Extra2' },
					{ value: 'Keterangan' },
					{ value: 'UOM Dasar' },
					{ value: 'Deskripsi UOM' },
					{ value: 'Mata Uang' },
					{ value: 'Nilai per UOM Dasar' },
					{ value: 'Stock Tersedia untuk Dibeli' },
					{ value: 'Harga Jual(Persen/Tambah/Tetap)' },
					{ value: 'Diskon(Normal/Persen/Tetap)' },
					{ value: 'Tgl Diskon Mulai' },
					{ value: 'Tgl Diskon Selesai' },
					{ value: 'Tag' }
				]
			};

			// Table items


		}

		return book;
	}

	function exportStockDisplay(employees) {
		// Namespace and XlsxConverter shortcuts.
		var xcNs = wijmo.xlsx, xc = xcNs.XlsxConverter;
		var book = { sheets: [] };
		var dateFormat = xc.xlsxDateFormat('d'), stdNumWidth = 85, simpleCaptionStyle = { hAlign: 3 /* Right */ }, accentCaptionStyle = { font: { color: '#808097' } }, totalCaptionStyle = {
			basedOn: simpleCaptionStyle,
			font: { bold: true },
			hAlign: 3 /* Right */
		}, valueStyle = { font: { family: 'Arial' } }, highlightedValueStyle = { basedOn: valueStyle, fill: { color: '#ffffff' } }, tableHeaderStyle = { font: { bold: true }, border: { size: '1px' }, fill: { color: '#ffffff' } }, tableFooterCurrencyStyle = { basedOn: tableHeaderStyle, format: xc.xlsxNumberFormat('c2'), hAlign: 3 /* Right */ }, tableValueStyle = { fill: { color: '#ffffff' } }, tableDateStyle = { basedOn: tableValueStyle }, tableCurrencyStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('c2') }, tableIntegerStyle = { basedOn: tableValueStyle, format: xc.xlsxNumberFormat('00') };
		for (var emplIdx = 0; emplIdx < employees.length; emplIdx++) {
			var empl = employees[emplIdx], sheet = { rows: [] }, rows = sheet.rows;

			book.sheets.push(sheet);
			sheet.name = empl.Name;
			sheet.cols = [
				{ width: 50 },
				{ width: 100 },
				{ width: 200 },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: stdNumWidth },
				{ width: 100 },
				{ width: 72 },
				{ width: 200 },
				{ width: 200 },
				{ width: 230 },
				{ width: 200 },
				{ width: 125 },
				{ width: 125 },
				{ width: 200 }];

			//sheet.cols = [{ width: '1ch', style: { fill: { color: '#00ff00' } } }, { width: 100 }, { width: 230 }, {}, { width: 95 }, { width: 130 }, {}, {}, { width: 105 }];

			//================ Expense items table ==========================
			// Table header
			rows[0] = {
				style: { hAlign: 2 /* Center */ },
				cells: [
					{ value: 'No' },
					{ value: 'Site' },
					{ value: 'ArticleID/SKU' },
					{ value: 'Nama' },
					{ value: 'Attributes' },
					{ value: 'Tag' },
					{ value: 'UOM Dasar' },
					{ value: 'Tersedia' },
					{ value: 'Quality' },
					{ value: 'Block' },
					{ value: 'Konsinyasi' },
					{ value: 'Proses Pengadaan' },
					{ value: 'Sales Order' }
				]
			};

			// Table items
			var expenses = empl.Expenses, firstIdx = 1, totalIdx = firstIdx + expenses.length;
			for (var i = 0; i < expenses.length; i++) {
				var curExpense = expenses[i], rowIdx = firstIdx + i;
				rows[rowIdx] = {
					cells: [
						{ value: rowIdx },
						{ value: curExpense.site_name },
						{ value: curExpense.item_code },
						{ value: curExpense.item_name },
						{ value: curExpense.attributes.string },
						{ value: curExpense.tag },
						{ value: curExpense.item_unit },
						{ value: curExpense.quantity },
						{ value: curExpense.quality },
						{ value: curExpense.value_currency },
						{ value: curExpense.value_amount },
						{ value: curExpense.availability },
						{ value: curExpense.sell_price_type }
						/*
						 {
						 formula: 'SUM(' + xc.xlsxIndex(rowIdx, 3) + ':' + xc.xlsxIndex(rowIdx, 7) + ')+' + xc.xlsxIndex(rowIdx, 8) + '*' + xc.xlsxIndex(rowIdx, 9),
						 style: tableCurrencyStyle
						 }
						 */
					]
				};
			}

		}

		return book;
	}

	XlsxExport.exportExpenseReport = exportExpenseReport;
	XlsxExport.exportStockDisplay = exportStockDisplay;
	XlsxExport.downloadTemplate = downloadTemplate;
})(XlsxExport || (XlsxExport = {}));
//# sourceMappingURL=expenseReportExport.js.map
