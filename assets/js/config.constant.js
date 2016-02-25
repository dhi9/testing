'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
	'desktopXL': 1200,
	'desktop': 992,
	'tablet': 768,
	'mobile': 480
});
app.constant('JS_REQUIRES', {
	//*** Scripts
	scripts: {
		//*** Javascript Plugins
		'modernizr': ['vendor/modernizr/modernizr.js'],
		'moment': ['vendor/moment/moment.min.js'],
		'spin': 'vendor/ladda/spin.min.js',

		//*** jQuery Plugins
		'perfect-scrollbar-plugin': ['vendor/perfect-scrollbar/perfect-scrollbar.min.js', 'vendor/perfect-scrollbar/perfect-scrollbar.min.css'],
		'ladda': ['vendor/ladda/spin.min.js', 'vendor/ladda/ladda.min.js', 'vendor/ladda/ladda-themeless.min.css'],
		'sweet-alert': ['vendor/sweet-alert/sweet-alert.min.js', 'vendor/sweet-alert/sweet-alert.css'],
		'chartjs': 'vendor/chartjs/Chart.min.js',
		'jquery-sparkline': 'vendor/sparkline/jquery.sparkline.min.js',
		'ckeditor-plugin': 'vendor/ckeditor/ckeditor.js',
		'jquery-nestable-plugin': ['vendor/ng-nestable/jquery.nestable.js', 'vendor/ng-nestable/jquery.nestable.css'],
		'touchspin-plugin': 'vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js',

		//*** Controllers
		'dashboardCtrl': 'assets/js/controllers/dashboardCtrl.js',
		'iconsCtrl': 'assets/js/controllers/iconsCtrl.js',
		'vAccordionCtrl': 'assets/js/controllers/vAccordionCtrl.js',
		'ckeditorCtrl': 'assets/js/controllers/ckeditorCtrl.js',
		'laddaCtrl': 'assets/js/controllers/laddaCtrl.js',
		'ngTableCtrl': 'assets/js/controllers/ngTableCtrl.js',
		'cropCtrl': 'assets/js/controllers/cropCtrl.js',
		'asideCtrl': 'assets/js/controllers/asideCtrl.js',
		'toasterCtrl': 'assets/js/controllers/toasterCtrl.js',
		'sweetAlertCtrl': 'assets/js/controllers/sweetAlertCtrl.js',
		'mapsCtrl': 'assets/js/controllers/mapsCtrl.js',
		'chartsCtrl': 'assets/js/controllers/chartsCtrl.js',
		'calendarCtrl': 'assets/js/controllers/calendarCtrl.js',
		'nestableCtrl': 'assets/js/controllers/nestableCtrl.js',
		'validationCtrl': ['assets/js/controllers/validationCtrl.js'],
		'userCtrl': ['assets/js/controllers/userCtrl.js'],
		'selectCtrl': 'assets/js/controllers/selectCtrl.js',
		'wizardCtrl': 'assets/js/controllers/wizardCtrl.js',
		'uploadCtrl': 'assets/js/controllers/uploadCtrl.js',
		'treeCtrl': 'assets/js/controllers/treeCtrl.js',
		'inboxCtrl': 'assets/js/controllers/inboxCtrl.js',

		//*** Wave Controllers
		'activeOrderController': 'assets/js/wave/controllers/activeOrderController.js',
				'deliveryActiveOrdersController': 'assets/js/wave/controllers/deliveryActiveOrdersController.js',
		'orderDetailController': 'assets/js/wave/controllers/orderDetailController.js',
		'orderToDeliverController': 'assets/js/wave/controllers/orderToDeliverController.js',
		'customerListNewCreditBlockController': 'assets/js/wave/controllers/customerListNewCreditBlockController.js',
		'creditBlockListByCustomerController': 'assets/js/wave/controllers/creditBlockListByCustomerController.js',
		'editCreditBlockController': 'assets/js/wave/controllers/editCreditBlockController.js',
		'deliveryConfirmationDetailController': 'assets/js/wave/controllers/deliveryConfirmationDetailController.js',
				'creditBlockListByOrderController': 'assets/js/wave/controllers/creditBlockListByOrderController.js',
				'activeDeliveryController': 'assets/js/wave/controllers/activeDeliveryController.js',
				'customerMasterListController': 'assets/js/wave/customer_master/customerMasterListController.js',
				'customerMasterEditController': 'assets/js/wave/customer_master/customerMasterEditController.js',
				'customerMasterNewController': 'assets/js/wave/customer_master/customerMasterNewController.js',
				'loginController': 'assets/js/wave/controllers/loginController.js',
				'documentFlowController': 'assets/js/wave/controllers/documentFlowController.js',
				'deliveryReportController': 'assets/js/wave/controllers/deliveryReportController.js',
				'travelLetterReportController': 'assets/js/wave/controllers/travelLetterReportController.js',
				'onTimeDeliveryReportController': 'assets/js/wave/controllers/onTimeDeliveryReportController.js',
				'userMasterController': 'assets/js/wave/controllers/userMasterController.js',
				'changePasswordController': 'assets/js/wave/controllers/changePasswordController.js',
				'noAccessController': 'assets/js/wave/controllers/noAccessController.js',
				'itemMasterListController': 'assets/js/wave/controllers/itemMasterListController.js',
				'itemMasterEditController': 'assets/js/wave/controllers/itemMasterEditController.js',
				'newDraftOrderController': 'assets/js/wave/sales_order/newDraftOrderController.js',
				'draftOrderListController': 'assets/js/wave/controllers/draftOrderListController.js',
				'draftOrderDetailController': 'assets/js/wave/controllers/draftOrderDetailController.js',
				'ownDraftOrderDetailController': 'assets/js/wave/controllers/ownDraftOrderDetailController.js',
				'divisionDraftOrderDetailController': 'assets/js/wave/controllers/divisionDraftOrderDetailController.js',
				'ownDraftOrderListController': 'assets/js/wave/controllers/ownDraftOrderListController.js',
				'divisionDraftOrderListController': 'assets/js/wave/controllers/divisionDraftOrderListController.js',
				'ownActiveDraftOrderDetailController': 'assets/js/wave/controllers/ownActiveDraftOrderDetailController.js',
				'draftOrderCartListController': 'assets/js/wave/sales_order/draftOrderCartListController.js',
				'draftOrderCartDetailController': 'assets/js/wave/sales_order/draftOrderCartDetailController.js',
				'newPurchaseRequestController': 'assets/js/wave/purchase_request/newPurchaseRequestController.js',
				'approvePurchaseRequestController': 'assets/js/wave/approve_purchase_request/approvePurchaseRequestController.js',
				'purchaseRequestDetailController': 'assets/js/wave/approve_purchase_request/purchaseRequestDetailController.js',
				'purchaseRequestApprovedDetailController': 'assets/js/wave/approve_purchase_request/purchaseRequestApprovedDetailController.js',
				'changePurchaseRequestDetailController': 'assets/js/wave/approve_purchase_request/changePurchaseRequestDetailController.js',
				'newServiceRequestController': 'assets/js/wave/service_request/newServiceRequestController.js',
				'serviceRequestDetailController': 'assets/js/wave/approve_service_request/serviceRequestDetailController.js',
				'serviceRequestApprovedDetailController': 'assets/js/wave/approve_service_request/serviceRequestApprovedDetailController.js',
				'changeServiceRequestDetailController': 'assets/js/wave/approve_service_request/changeServiceRequestDetailController.js',
				'stockMasterListController': 'assets/js/wave/stock_master/stockMasterListController.js',
				'stockMasterNewController': 'assets/js/wave/stock_master/stockMasterNewController.js',
				'stockMasterEditController': 'assets/js/wave/stock_master/stockMasterEditController.js',
				'stockMasterImportController': 'assets/js/wave/stock_master/stockMasterImportController.js',
				'vendorMasterController': 'assets/js/wave/vendor_master/vendorMasterController.js',
				'vendorMasterNewController': 'assets/js/wave/vendor_master/vendorMasterNewController.js',
				'vendorMasterEditController': 'assets/js/wave/vendor_master/vendorMasterEditController.js',
				'siteMasterController': 'assets/js/wave/site_master/siteMasterController.js',
				'siteMasterNewController': 'assets/js/wave/site_master/siteMasterNewController.js',
				'siteMasterEditController': 'assets/js/wave/site_master/siteMasterEditController.js',
				'siteLocationsController': 'assets/js/wave/site_master/siteLocationsController.js',
				'siteLocationsNewController': 'assets/js/wave/site_master/siteLocationsNewController.js',
				'siteLocationsEditController': 'assets/js/wave/site_master/siteLocationsEditController.js',
				'siteBinController': 'assets/js/wave/site_master/siteBinController.js',
				'siteBinNewController': 'assets/js/wave/site_master/siteBinNewController.js',
				'siteBinEditController': 'assets/js/wave/site_master/siteBinEditController.js',
				'stockMovementController': 'assets/js/wave/inventory_stock_status/stockMovementController.js',
				'stockInfoBatchController': 'assets/js/wave/inventory_stock_status/stockInfoBatchController.js',
				'stockStatusDetailController': 'assets/js/wave/inventory_stock_status/stockStatusDetailController.js',
				'stockStatusController': 'assets/js/wave/inventory_stock_status/stockStatusController.js',
				'stockOpnameListController': 'assets/js/wave/inventory_stock_opname/stockOpnameListController.js',
				'stockOpnameNewController': 'assets/js/wave/inventory_stock_opname/stockOpnameNewController.js',
				'stockOpnameDetailController': 'assets/js/wave/inventory_stock_opname/stockOpnameDetailController.js',
				'tagDisplayController': 'assets/js/wave/inventory_tag_display/tagDisplayController.js',
				'purchaseOrderActiveController': 'assets/js/wave/purchase_order_active/purchaseOrderActiveController.js',
				'activePurchaseDetailController': 'assets/js/wave/purchase_order_active/activePurchaseDetailController.js',
				'purchaseDeliveryRequestListController': 'assets/js/wave/purchase_order_active/purchaseDeliveryRequestListController.js',
				'purchaseDeliveryRequestDetailController': 'assets/js/wave/purchase_order_active/purchaseDeliveryRequestDetailController.js',
				'activeServiceDetailController': 'assets/js/wave/purchase_order_active/activeServiceDetailController.js',
				'serviceExecutionDetailController': 'assets/js/wave/purchase_order_active/serviceExecutionDetailController.js',
				'manualSettingStockListController': 'assets/js/wave/inventory_manual_setting_stock/manualSettingStockListController.js',
				'vehicleMasterController': 'assets/js/wave/vehicle_master/vehicleMasterController.js',
				'vehicleMasterNewController': 'assets/js/wave/vehicle_master/vehicleMasterNewController.js',
				'vehicleMasterEditController': 'assets/js/wave/vehicle_master/vehicleMasterEditController.js',
				'stockSettingController': 'assets/js/wave/manual_stock_setting/stockSettingController.js',
				'stockSettingNewController': 'assets/js/wave/manual_stock_setting/stockSettingNewController.js',
				'stockSettingDetailController': 'assets/js/wave/manual_stock_setting/stockSettingDetailController.js',
				'companyMasterController': 'assets/js/wave/company_master/companyMasterController.js',
				'attributeMasterListController': 'assets/js/wave/attribute_master/attributeMasterListController.js',
				'attributeMasterNewController': 'assets/js/wave/attribute_master/attributeMasterNewController.js',
				'attributeMasterEditController': 'assets/js/wave/attribute_master/attributeMasterEditController.js',
				'userMasterListController': 'assets/js/wave/user_master/userMasterListController.js',
				'userMasterNewController': 'assets/js/wave/user_master/userMasterNewController.js',
				'userMasterEditController': 'assets/js/wave/user_master/userMasterEditController.js',
				'bankMasterListController': 'assets/js/wave/bank_master/bankMasterListController.js',
				'bankMasterNewController': 'assets/js/wave/bank_master/bankMasterNewController.js',
				'bankMasterEditController': 'assets/js/wave/bank_master/bankMasterEditController.js',
				'categoryMasterListController': 'assets/js/wave/category_master/categoryMasterListController.js',
				'categoryMasterNewController': 'assets/js/wave/category_master/categoryMasterNewController.js',
				'categoryMasterEditController': 'assets/js/wave/category_master/categoryMasterEditController.js',
				'stockDisplayListController': 'assets/js/wave/stock_display/stockDisplayListController.js',
				'stockDisplayDetailController': 'assets/js/wave/stock_display/stockDisplayDetailController.js',
				'newDeliveryListController': 'assets/js/wave/delivery/newDeliveryListController.js',
				'newDeliveryController': 'assets/js/wave/delivery/newDeliveryController.js',
				'stockReportController': 'assets/js/wave/stock_report/stockReportController.js',
				'stockReportDetailController': 'assets/js/wave/stock_report/stockReportDetailController.js',
				'inventoryReportController': 'assets/js/wave/inventory_report/inventoryReportController.js',
				'purchaseDiscussionListController': 'assets/js/wave/purchase_request/purchaseDiscussionListController.js',
				'purchaseItemDiscussionDetailController': 'assets/js/wave/purchase_request/purchaseItemDiscussionDetailController.js',
				'purchaseServiceDiscussionDetailController': 'assets/js/wave/purchase_request/purchaseServiceDiscussionDetailController.js',
				
				//*** Wave Test Area
				'qrCodeScannerController': 'assets/js/wave/tools/qrCodeScannerController.js',
				'qrCodeGeneratorController': 'assets/js/wave/tools/qrCodeGeneratorController.js',
				'qrCodeDetailController': 'assets/js/wave/tools/qrCodeDetailController.js',
				'barcodeGeneratorController': 'assets/js/wave/tools/barcodeGeneratorController.js',
				'barcodeScannerController': 'assets/js/wave/tools/barcodeScannerController.js',

				//*** Wave Services
				//'apiCallService': 'assets/js/wave/services/apiCallService.js',
				'deliveryService': 'assets/js/wave/services/deliveryService.js',
				'itemLookupService': 'assets/js/wave/services/itemLookupService.js',
				//'authService': 'assets/js/wave/services/authService.js',
				'warehouseService': 'assets/js/wave/services/warehouseService.js',
				'supplierService': 'assets/js/wave/services/supplierService.js',
				'purchaseService': 'assets/js/wave/services/purchaseService.js',
				'itemService': 'assets/js/wave/services/itemService.js',
				'vendorService': 'assets/js/wave/services/vendorService.js',
				'siteService': 'assets/js/wave/services/siteService.js',
				'customerService': 'assets/js/wave/services/customerService.js',
				'inventoryService': 'assets/js/wave/services/inventoryService.js',
				'vehicleService': 'assets/js/wave/services/vehicleService.js',
				'userService': 'assets/js/wave/services/userService.js',
				'dataService': 'vendor/wijmo/scripts/services/dataService.js',

				//*** Wave Modals
				'customerModalDirective': 'assets/js/wave/customer_master/customerModalDirective.js',
				'customerModalController': 'assets/js/wave/customer_master/customerModalController.js',

				//*** Wave Factories
				'customerFactory': 'assets/js/wave/factories/customerFactory.js',
				'companyFactory': 'assets/js/wave/factories/companyFactory.js',
				'vendorFactory': 'assets/js/wave/factories/vendorFactory.js',
				'purchaseFactory': 'assets/js/wave/factories/purchaseFactory.js',
				'itemFactory': 'assets/js/wave/factories/itemFactory.js',
				'attributeFactory': 'assets/js/wave/factories/attributeFactory.js',
				'bankFactory': 'assets/js/wave/factories/bankFactory.js',
				'categoryFactory': 'assets/js/wave/factories/categoryFactory.js',

				//*** Filters
				'htmlToPlaintext': 'assets/js/filters/htmlToPlaintext.js'
	},
	//*** angularJS Modules
	modules: [{
		name: 'perfect_scrollbar',
		files: ['vendor/perfect-scrollbar/angular-perfect-scrollbar.js']
	}, {
		name: 'toaster',
		files: ['vendor/toaster/toaster.js', 'vendor/toaster/toaster.css']
	}, {
		name: 'angularBootstrapNavTree',
		files: ['vendor/angular-bootstrap-nav-tree/abn_tree_directive.js', 'vendor/angular-bootstrap-nav-tree/abn_tree.css']
	}, {
		name: 'angular-ladda',
		files: ['vendor/ladda/angular-ladda.min.js']
	}, {
		name: 'ngTable',
		files: ['vendor/ng-table/ng-table.min.js', 'vendor/ng-table/ng-table.min.css']
	}, {
		name: 'ngTableExport',
		files: ['vendor/ng-table-export/ng-table-export.js']
	}, {
		name: 'ui.select',
		files: ['vendor/ui-select/select.min.js', 'vendor/ui-select/select.min.css', 'vendor/ui-select/select2.css', 'vendor/ui-select/select2-bootstrap.css', 'vendor/ui-select/selectize.bootstrap3.css']
	}, {
		name: 'ui.mask',
		files: ['vendor/ui-utils/mask/mask.js']
	}, {
		name: 'angular-bootstrap-touchspin',
		files: ['vendor/bootstrap-touchspin/angular.bootstrap-touchspin.js', 'vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css']
	}, {
		name: 'ngImgCrop',
		files: ['vendor/ngImgCrop/ng-img-crop.js', 'vendor/ngImgCrop/ng-img-crop.css']
	}, {
		name: 'angularFileUpload',
		files: ['vendor/angular-file-upload/angular-file-upload.min.js', 'vendor/angular-file-upload/directives.js']
	}, {
		name: 'ngAside',
		files: ['vendor/angular-aside/angular-aside.min.js', 'vendor/angular-aside/angular-aside.min.css']
	}, {
		name: 'truncate',
		files: ['vendor/angular-truncate/truncate.js']
	}, {
		name: 'oitozero.ngSweetAlert',
		files: ['vendor/sweet-alert/ngSweetAlert.min.js']
	}, {
		name: 'monospaced.elastic',
		files: ['vendor/angular-elastic/elastic.js']
	}, {
		name: 'ngMap',
		files: ['vendor/angular-google-maps/ng-map.min.js']
	}, {
		name: 'tc.chartjs',
		files: ['vendor/chartjs/tc-angular-chartjs.min.js']
	}, {
		name: 'sparkline',
		files: ['vendor/sparkline/angular-sparkline.js']
	}, {
		name: 'flow',
		files: ['vendor/ng-flow/ng-flow-standalone.min.js']
	}, {
		name: 'uiSwitch',
		files: ['vendor/angular-ui-switch/angular-ui-switch.min.js', 'vendor/angular-ui-switch/angular-ui-switch.min.css']
	}, {
		name: 'ckeditor',
		files: ['vendor/ckeditor/angular-ckeditor.min.js']
	}, {
		name: 'mwl.calendar',
		files: ['vendor/angular-bootstrap-calendar/angular-bootstrap-calendar.js', 'vendor/angular-bootstrap-calendar/angular-bootstrap-calendar-tpls.js', 'vendor/angular-bootstrap-calendar/angular-bootstrap-calendar.min.css']
	}, {
		name: 'ng-nestable',
		files: ['vendor/ng-nestable/angular-nestable.js']
	}, {
		name: 'vAccordion',
		files: ['vendor/v-accordion/v-accordion.min.js', 'vendor/v-accordion/v-accordion.min.css']
	}, {
		name: 'treeGrid',
		files: ['vendor/tree-grid-directive-master/src/tree-grid-directive.js', 'vendor/tree-grid-directive-master/src/treeGrid.css']
	}, {
		name: 'qrScanner',
		files: ['vendor/angular-qr-scanner/qr-scanner.js', 'vendor/angular-qr-scanner/src/jsqrcode-combined.min.js']
	}, {
		name: 'qrGenerator',
		files: ['vendor/angular-qr-code/angular-qrcode.js', 'vendor/angular-qr-code/qrcode.js']
	}, {
		name: 'barcodeGenerator',
		files: ['vendor/angular-barcode-generator/barcodeGenerator.js', 'vendor/angular-barcode-generator/barcode.css']
	}/*, {
		name: 'barcodeScanner',
		files: ['vendor/angular-barcode-scanner/dist/quagga.js', 'vendor/angular-barcode-scanner/example/live_w_locator.js']
	}*/, {
		name: 'barcodeScanner',
		files: ['vendor/angular-barcode-scanner/zbar-processor.js']
	}, {
		name: 'wj',
		files: []
			//'vendor/wijmo/scripts/vendor/jszip.min.js',
			//'vendor/wijmo/scripts/vendor/wijmo.min.css',
			//'vendor/wijmo/scripts/vendor/wijmo.min.js',
			//'vendor/wijmo/scripts/vendor/wijmo.xlsx.min.js',
			//'vendor/wijmo/scripts/vendor/wijmo.angular.min.js',
			//'vendor/wijmo/scripts/xlsxImport/drawWorkbook.js',
			//'vendor/wijmo/styles/app.css'
			//'vendor/wijmo/scripts/vendor/bootstrap.min.js',
		//]

			//'vendor/wijmo/scripts/vendor/wijmo.grid.min.js',
			//'vendor/wijmo/scripts/vendor/wijmo.grid.detail.min.js',
			//'vendor/wijmo/scripts/vendor/wijmo.grid.xlsx.min.js',
			//'vendor/wijmo/scripts/vendor/bootstrap.min.js',
			//'vendor/wijmo/scripts/vendor/xlsx.js']
	}]
});

