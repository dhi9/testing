'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES', '$httpProvider',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, $httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	app.controller = $controllerProvider.register;
	app.directive = $compileProvider.directive;
	app.filter = $filterProvider.register;
	app.factory = $provide.factory;
	app.service = $provide.service;
	app.constant = $provide.constant;
	app.value = $provide.value;

	// LAZY MODULES

	$ocLazyLoadProvider.config({
		debug: false,
		events: true,
		modules: jsRequires.modules
	});

	// APPLICATION ROUTES
	// -----------------------------------
	// For any unmatched url, redirect to /app/dashboard
	$urlRouterProvider.otherwise("/app/dashboard");
	//
	// Set up the states
	$stateProvider.state('app', {
		url: "/app",
		templateUrl: "assets/views/app.html",
		resolve: loadSequence('modernizr', 'moment', 'uiSwitch', 'perfect-scrollbar-plugin',
							  'perfect_scrollbar', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert',
							  'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'itemLookupService', 'ladda', 'angular-ladda'),
		abstract: true
	})

	/*.state('app.dashboard', {
		url:'/dashboard',
		templateUrl: "assets/views/overall_view.html",
		resolve: loadSequence('overallController'),
		title: "Overall",
				data : { logged_on_only: true, role: 'login' },
		ncyBreadcrumb: {
			label: 'OVERALL'
		}
	})*/
	.state('app.dashboard', {
		url: "/dashboard",
		templateUrl: "assets/views/dashboard.html",
		resolve: loadSequence('jquery-sparkline', 'sparkline', 'dashboardCtrl'),
		title: 'Dashboard',
		data : { logged_on_only: true, role: 'DASHBOARD' },
		ncyBreadcrumb: {
			label: 'Dashboard'
		}
	})

	.state('app.order', {
		url: '/order',
		template: '<div ui-view class="fade-in-up"></div>',
		title: 'Pages',
		ncyBreadcrumb: {
			label: 'ORDER'
		}
	})
		.state('app.order.new_draft_order', {
			url:'/buatdraftorder',
			templateUrl: "assets/js/wave/sales_order/new_draft_order.html",
			resolve: loadSequence('ngTable', 'newDraftOrderController', 'customerService', 'customerFactory', 'attributeFactory', 'companyFactory', 'itemService'),
			title: "Buat Draft Order",
			data : { logged_on_only: true, role: 'BUATSALESORDER' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.order.draft_order_cart_list', {
			url:'/ordercart',
			templateUrl: "assets/js/wave/sales_order/draft_order_cart_list.html",
			resolve: loadSequence('ngTable', 'draftOrderCartListController', 'customerService', 'customerFactory', 'attributeFactory'),
			title: "Sales Order Troli",
			data : { logged_on_only: true, role: 'SALESORDERTROLI' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.order.draft_order_cart_detail', {
			url:'/ordercartdetail/:draft_id',
			templateUrl: "assets/js/wave/sales_order/draft_order_cart_detail.html",
			resolve: loadSequence('ngTable', 'draftOrderCartDetailController', 'customerService', 'customerFactory', 'attributeFactory'),
			title: "Buat Draft Order",
			data : { logged_on_only: true, role: 'SALESORDERTROLI' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.order.draft_order_list', {
			url:'/daftardraftorder',
			templateUrl: "assets/views/draft_order_list.html",
			resolve: loadSequence('ngTable', 'draftOrderListController'),
			title: "Daftar Draft Order",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DAFTAR'
			}
		})
		.state('app.order.own_draft_order_list', {
			url:'/daftardraftordersendiri',
			templateUrl: "assets/views/own_draft_order_list.html",
			resolve: loadSequence('ngTable', 'ownDraftOrderListController'),
			title: "Daftar Draft Order Sendiri",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DAFTAR'
			}
		})
		.state('app.order.division_draft_order_list', {
			url:'/daftardraftorderdivisi',
			templateUrl: "assets/views/division_draft_order_list.html",
			resolve: loadSequence('ngTable', 'divisionDraftOrderListController'),
			title: "Daftar Draft Order Divisi",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DAFTAR'
			}
		})
		.state('app.order.draft_order_detail', {
			url:'/detaildraftorder/:draft_id',
			templateUrl: "assets/views/draft_order_detail.html",
			resolve: loadSequence('ngTable', 'draftOrderDetailController', 'customerService'),
			title: "Detail Draft Order",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.order.own_draft_order_detail', {
			url:'/detaildraftordersendiri/:draft_id',
			templateUrl: "assets/views/own_draft_order_detail.html",
			resolve: loadSequence('ngTable', 'ownDraftOrderDetailController', 'customerService', 'customerFactory'),
			title: "Detail Draft Order Sendiri",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.order.own_active_draft_order_detail', {
			url:'/detaildraftorderaktifsendiri/:draft_id',
			templateUrl: "assets/views/own_active_draft_order_detail.html",
			resolve: loadSequence('ngTable', 'ownActiveDraftOrderDetailController', 'customerService'),
			title: "Detail Draft Order Aktif Sendiri",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.order.division_draft_order_detail', {
			url:'/detaildraftorderdivisi/:draft_id',
			templateUrl: "assets/views/division_draft_order_detail.html",
			resolve: loadSequence('ngTable', 'divisionDraftOrderDetailController', 'customerService'),
			title: "Detail Draft Order Divisi",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.order.active_order', {
			url:'/orderaktif',
			templateUrl: "assets/views/sales_order_aktif.html",
			resolve: loadSequence('ngTable', 'activeOrderController'),
			title: "Sales Order Aktif",
					data : { logged_on_only: true, role: 'SALESORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'AKTIF'
			}
		})
		.state('app.order.order_detail', {
			url:'/orderdetail/:order_id',
			templateUrl: "assets/views/order_detail.html",
			resolve: loadSequence('orderDetailController', 'customerService', 'attributeFactory', 'purchaseService', 'itemService'),
			title: "Order Detail",
					data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})

		.state('app.purchase', {
			url: '/purchase',
			template: '<div ui-view class="fade-in-up"></div>',
			title: 'Pages',
			ncyBreadcrumb: {
				label: 'PURCHASE'
			}
		})
		.state('app.purchase.purchase_discussion', {
			url:'/purchasediscussion',
			templateUrl: "assets/js/wave/purchase_request/purchase_discussion_list.html",
			resolve: loadSequence('ngTable', 'purchaseDiscussionListController', 'purchaseService'),
			title: "Purchase Discussion",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.purchase_item_discussion_detail', {
			url:'/purchaseitemdiscussiondetail/:reference',
			templateUrl: "assets/js/wave/purchase_request/purchase_item_discussion_detail.html",
			resolve: loadSequence('ngTable', 'purchaseItemDiscussionDetailController', 'purchaseService', 'warehouseService', 'supplierService', 'vendorService', 'itemService', 'purchaseFactory', 'vendorFactory',
            'itemFactory', 'attributeFactory', 'siteService'),
			title: "Purchase Discussion",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.purchase_service_discussion_detail', {
			url:'/purchaseservicediscussiondetail/:reference',
			templateUrl: "assets/js/wave/purchase_request/purchase_service_discussion_detail.html",
			resolve: loadSequence('ngTable', 'purchaseServiceDiscussionDetailController', 'purchaseService', 'warehouseService', 'supplierService', 'vendorService', 'itemService', 'purchaseFactory', 'vendorFactory', 'itemFactory', 'attributeFactory', 'siteService'),
			title: "Purchase Discussion",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.new_purchase_request', {
			url:'/buatpurchaserequest',
			templateUrl: "assets/js/wave/purchase_request/new_purchase_request.html",
			resolve: loadSequence('ngTable', 'newPurchaseRequestController', 'warehouseService', 'supplierService', 'purchaseService', 'vendorService', 'itemService', 'purchaseFactory', 'vendorFactory',
			'itemFactory', 'attributeFactory', 'siteService'),
			title: "Buat Purchase Request",
			data : { logged_on_only: true, role: 'BUATPURCHASEREQUEST' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.approve_purchase_request', {
			url:'/approvepurchaserequest',
			templateUrl: "assets/js/wave/approve_purchase_request/approve_purchase_request.html",
			resolve: loadSequence('ngTable', 'approvePurchaseRequestController', 'purchaseService', 'attributeFactory'),
			title: "Approve Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'LIST'
			}
		})
		.state('app.purchase.approve_purchase_detail', {
			url:'/purchaserequestdetail/:reference',
			templateUrl: "assets/js/wave/approve_purchase_request/purchase_request_detail.html",
			resolve: loadSequence('ngTable', 'purchaseRequestDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'attributeFactory', 'siteService'),
			title: "Approve Purchase Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.purchase.approve_purchase_approved_detail', {
			url:'/purchaserequestapproveddetail/:reference',
			templateUrl: "assets/js/wave/approve_purchase_request/purchase_request_approved_detail.html",
			resolve: loadSequence('ngTable', 'purchaseRequestApprovedDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'attributeFactory', 'siteService'),
			title: "Approve Purchase Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.purchase.change_purchase_request_detail', {
			url:'/purchaserequestchangedetail/:reference',
			templateUrl: "assets/js/wave/approve_purchase_request/change_purchase_request.html",
			resolve: loadSequence('ngTable', 'changePurchaseRequestDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'itemService', 'attributeFactory', 'siteService'),
			title: "Change Purchase Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'CHANGE'
			}
		})

		.state('app.service', {
			url: '/service',
			template: '<div ui-view class="fade-in-up"></div>',
			title: 'Pages',
			ncyBreadcrumb: {
				label: 'SERVICE'
			}
		})
		.state('app.service.new_service_request', {
			url:'/buatservicerequest',
			templateUrl: "assets/js/wave/service_request/new_service_request.html",
			resolve: loadSequence('ngTable', 'newServiceRequestController', 'warehouseService', 'supplierService', 'purchaseService', 'vendorService', 'itemService', 'siteService'),
			title: "Buat Service Request",
			data : { logged_on_only: true, role: 'BUATSERVICEREQUEST' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.service.approve_service_detail', {
			url:'/servicerequestdetail/:reference',
			templateUrl: "assets/js/wave/approve_service_request/service_request_detail.html",
			resolve: loadSequence('ngTable', 'serviceRequestDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'siteService'),
			title: "Detail Service Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.service.approve_service_approved_detail', {
			url:'/servicerequestapproveddetail/:reference',
			templateUrl: "assets/js/wave/approve_service_request/service_request_approved_detail.html",
			resolve: loadSequence('ngTable', 'serviceRequestApprovedDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'siteService'),
			title: "Detail Service Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'DETAIL'
			}
		})
		.state('app.service.change_service_request_detail', {
			url:'/servicerequestchangedetail/:reference',
			templateUrl: "assets/js/wave/approve_service_request/change_service_request.html",
			resolve: loadSequence('ngTable', 'changeServiceRequestDetailController', 'purchaseService', 'vendorService', 'warehouseService', 'itemService', 'siteService'),
			title: "Change Service Request",
			data : { logged_on_only: true, role: 'APPROVEREQUEST' },
			ncyBreadcrumb: {
				label: 'CHANGE'
			}
		})
		.state('app.purchase.purchase_order_active', {
			url:'/purchaseorderactive',
			templateUrl: "assets/js/wave/purchase_order_active/purchase_order_active.html",
			resolve: loadSequence('ngTable', 'purchaseOrderActiveController', 'purchaseService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.active_purchase_detail', {
			url:'/activepurchasedetail/:requests_reference',
			templateUrl: "assets/js/wave/purchase_order_active/active_purchase_detail.html",
			resolve: loadSequence('ngTable', 'activePurchaseDetailController', 'purchaseService', 'vendorService', 'itemLookupService', 'warehouseService', 'attributeFactory', 'siteService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.purchase_delivery_request_list', {
			url:'/purchasedeliveryrequestlist/:requests_reference',
			templateUrl: "assets/js/wave/purchase_order_active/purchase_delivery_request_list.html",
			resolve: loadSequence('ngTable', 'purchaseDeliveryRequestListController', 'purchaseService', 'warehouseService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.purchase_delivery_request_detail', {
			url:'/purchasedeliveryrequestdetail/:requests_delivery_requests_id',
			templateUrl: "assets/js/wave/purchase_order_active/purchase_delivery_request_detail.html",
			resolve: loadSequence('ngTable', 'purchaseDeliveryRequestDetailController', 'purchaseService', 'warehouseService', 'itemService', 'itemFactory', 'attributeFactory'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.active_service_detail', {
			url:'/activeservicedetail/:requests_reference',
			templateUrl: "assets/js/wave/purchase_order_active/active_service_detail.html",
			resolve: loadSequence('ngTable', 'activeServiceDetailController', 'purchaseService', 'vendorService', 'itemLookupService', 'warehouseService', 'siteService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.purchase.service_execution_detail', {
			url:'/serviceexecutiondetail/:requests_reference',
			templateUrl: "assets/js/wave/purchase_order_active/service_execution_detail.html",
			resolve: loadSequence('ngTable', 'serviceExecutionDetailController', 'purchaseService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})

		.state('app.inventory', {
			url: '/inventory',
			template: '<div ui-view class="fade-in-up"></div>',
			title: 'Pages',
			ncyBreadcrumb: {
				label: 'PURCHASE'
			}
		})
		.state('app.inventory.stock_opname', {
			url:'/stockopname',
			templateUrl: "assets/js/wave/inventory_stock_opname/stock_opname_list.html",
			resolve: loadSequence('ngTable', 'stockOpnameListController', 'inventoryService', 'siteService', 'itemFactory', 'purchaseService', 'attributeFactory'),
			title: "Stock Opname",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})

		.state('app.inventory.stock_opname_new', {
			url:'/stockopnamenew',
			templateUrl: "assets/js/wave/inventory_stock_opname/stock_opname_new.html",
			resolve: loadSequence('ngTable', 'stockOpnameNewController', 'siteService', 'inventoryService'),
			title: "Stock Opname",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.inventory.stock_opname_detail', {
			url:'/stockopnamedetail/:stock_opname_id',
			templateUrl: "assets/js/wave/inventory_stock_opname/stock_opname_detail.html",
			resolve: loadSequence('ngTable', 'stockOpnameDetailController', 'itemService', 'siteService', 'itemFactory', 'inventoryService', 'vendorFactory', 'purchaseService', 'attributeFactory'),
			title: "Stock Opname",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.inventory.stock_status', {
			url:'/stockstatus',
			templateUrl: "assets/js/wave/inventory_stock_status/stock_status.html",
			resolve: loadSequence('ngTable', 'stockStatusController', 'itemService', 'siteService', 'itemFactory', 'attributeFactory', 'inventoryService'),
			title: "Stock Status",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.inventory.stock_movement', {
			url:'/stockmovement/:item_code',
			templateUrl: "assets/js/wave/inventory_stock_status/stock_movement.html",
			resolve: loadSequence('ngTable','stockMovementController','itemService', 'siteService'),
			title: "Pergerakan Stock",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'STOCK MOVEMENT'
			}
		})
		.state('app.inventory.stock_info_batch', {
			url:'/stockinfobatch/:batch_reference',
			templateUrl: "assets/js/wave/inventory_stock_status/stock_info_batch.html",
			resolve: loadSequence('ngTable','stockInfoBatchController','itemService'),
			title: "Info Batch",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'INFO BATCH'
			}
		})
		.state('app.inventory.stock_status_detail', {
			url:'/stockstatusdetail/:item_code',
			params: {
				attributes: null,
				site_reference: null,
				storage_name: null,
				tag: null
			},
			/*params: ['attributes', 'site_reference', 'storage_name', 'tag'],*/
			templateUrl: "assets/js/wave/inventory_stock_status/stock_status_detail.html",
			controller: function($scope, $stateParams) {
				$scope.attributes = $stateParams.attributes;
				$scope.site_reference = $stateParams.site_reference;
				$scope.storage_name = $stateParams.storage_name;
				$scope.tag = $stateParams.tag;
			},
			resolve: loadSequence('ngTable','stockStatusDetailController', 'itemService','treeGrid', 'siteService'),
			title: "Stock Status",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'STOCK STATUS'
			}
		})
		.state('app.inventory.manual_stock_setting', {
			url:'/pengaturanstockmanual',
			templateUrl: "assets/js/wave/manual_stock_setting/stock_setting.html",
			resolve: loadSequence('ngTable','stockSettingController', 'itemService'),
			title: "Stock Status",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'STOCK STATUS'
			}
		})
		.state('app.inventory.manual_stock_setting_new', {
			url:'/pengaturanstockmanualbaru',
			templateUrl: "assets/js/wave/manual_stock_setting/stock_setting_new.html",
			resolve: loadSequence('ngTable','stockSettingNewController', 'itemLookupService', 'itemService', 'siteService', 'inventoryService', 'attributeFactory'),
			title: "Stock Status",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'STOCK STATUS'
			}
		})
		.state('app.inventory.manual_stock_setting_detail', {
			url:'/pengaturanstockmanualdetail/:reference',
			templateUrl: "assets/js/wave/manual_stock_setting/stock_setting_detail.html",
			resolve: loadSequence('ngTable','stockSettingDetailController', 'inventoryService', 'siteService', 'attributeFactory'),
			title: "Stock Status",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'STOCK STATUS'
			}
		})
		.state('app.inventory.order_active', {
			url:'/inventoryorderactive',
			templateUrl: "assets/js/wave/purchase_order_active/purchase_order_active.html",
			resolve: loadSequence('ngTable', 'purchaseOrderActiveController', 'purchaseService'),
			title: "Order Active",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})

			.state('app.inventory.tag_display', {
			url:'/tagdisplay',
			templateUrl: "assets/js/wave/inventory_tag_display/tag_display.html",
			resolve: loadSequence('ngTable','tagDisplayController', 'itemFactory'),
			title: "Tag Display",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'TAG DISPLAY'
			}
		})

		.state('app.inventory.stock_display', {
			url:'/stockdisplay',
			params: {
				tag: null
			},
			templateUrl: "assets/js/wave/stock_display/stock_display_list.html",
			resolve: loadSequence('ngTable', 'stockDisplayListController', 'inventoryService', 'categoryFactory', 'itemService', 'itemFactory', 'siteService'),
			title: "Stock Display",
			data : { logged_on_only: true, role: 'ORDERAKTIF' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.inventory.stock_display_detail', {
			url:'/stockdisplaydetail/:inventory_stock_id',
			templateUrl: "assets/js/wave/inventory_stock_status/stock_status.html",
			resolve: loadSequence('ngTable', 'stockOpnameDetailController', 'itemService', 'siteService', 'itemFactory', 'inventoryService', 'vendorFactory', 'purchaseService', 'attributeFactory'),
			title: "Detail Stock Display",
			data : { logged_on_only: true, role: 'STOCKSTATUS' },
			ncyBreadcrumb: {
				label: 'BARU'
			}
		})
		.state('app.report.stock_display', {
			url:'/deliveryreport',
			templateUrl: "assets/js/wave/stock_display/stock_display_list.html",
			resolve: loadSequence('ngTable', 'ngTableExport', 'deliveryReportController'),
			title: "Laporan Pengiriman",
			data : { logged_on_only: true, role: 'REPORT' },
			ncyBreadcrumb: {
				label: 'PENGIRIMAN'
			}
		})


	.state('app.delivery', {
		url: '/delivery',
		template: '<div ui-view class="fade-in-up"></div>',
		title: 'delivery',
		ncyBreadcrumb: {
			label:'PENGIRIMAN'
		}
	})
		.state('app.delivery.active_orders', {
		url:'/orderaktif',
		templateUrl: "assets/views/delivery_active_orders.html",
		resolve: loadSequence('ngTable', 'deliveryActiveOrdersController'),
		title: "Sales Order Aktif",
				data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'AKTIF'
		}
	})
		.state('app.delivery.document_flow', {
		url:'/alurdokumen/:order_reference',
		templateUrl: "assets/views/document_flow.html",
		resolve: loadSequence('documentFlowController'),
		title: "Alur Dokumen",
				data : { logged_on_only: true, role: '' },
        ncyBreadcrumb: {
            label: 'ALUR_DOKUMEN'
        }
    })
	.state('app.delivery.order_to_deliver', {
		url:'/orderuntukdikirim',
		templateUrl: "assets/js/wave/delivery/new_delivery_list.html",
		resolve: loadSequence('ngTable', 'newDeliveryListController', 'deliveryService'),
		title: "Pengiriman Baru",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'ORDER_UNTUK_DIKIRIM'
		}
	})
	.state('app.delivery.new_delivery', {
		url:'/buatpengiriman/:delivery_request_id',
		templateUrl: "assets/js/wave/delivery/new_delivery.html",
		resolve: loadSequence('newDeliveryController', 'vendorService', 'vehicleService', 'customerFactory', 'deliveryService'),
		title: "Buat Pengiriman",
		data : { logged_on_only: true, role: 'PENGIRIMANBARU' },
		ncyBreadcrumb: {
			label: 'BARU'
		}
	})
    .state('app.delivery.confirm_delivery', {
        url:'/konfirmasipengiriman/:delivery_id',
        templateUrl: "assets/views/konfirmasi_pengiriman.html",
        resolve: loadSequence('deliveryConfirmationDetailController', 'vendorService', 'vehicleService', 'attributeFactory', 'itemService'),
        title: "Konfirmasi Pengiriman",
				data : { logged_on_only: true, role: 'PENGIRIMANAKTIF' },
		ncyBreadcrumb: {
			label: 'KONFIRMASI'
		}
	})
	.state('app.delivery.active_delivery', {
		url:'/pengirimanaktif',
		templateUrl: "assets/views/pengiriman_aktif.html",
		resolve: loadSequence('ngTable', 'activeDeliveryController'),
		title: "Pengiriman Aktif",
				data : { logged_on_only: true, role: 'PENGIRIMANAKTIF' },
		ncyBreadcrumb: {
			label: 'AKTIF'
		}
	})

	.state('app.creditblock', {
		url: '/creditblock',
		template: '<div ui-view class="fade-in-up"></div>',
		title: 'delivery',
		ncyBreadcrumb: {
			label:'CREDIT_BLOCK'
		}
	})
	.state('app.creditblock.customer_list_new_credit_block', {
		url:'/customerlistaddcreditblock',
		templateUrl: "assets/views/customer_list_new_credit_block.html",
		resolve: loadSequence('ngTable', 'customerListNewCreditBlockController'),
		title: "Buat Credit Block",
				data : { logged_on_only: true, role: 'CREDITBLOCK' },
		ncyBreadcrumb: {
			label: 'BARU'
		}
	})
	.state('app.creditblock.customers_with_credit_block', {
		url:'/customerswithcreditblock',
		templateUrl: "assets/views/credit_blocked_customers.html",
		resolve: loadSequence('ngTable', 'creditBlockListByCustomerController'),
		title: "Customer Dengan Credit Block",
				data : { logged_on_only: true, role: 'CREDITBLOCK' },
		ncyBreadcrumb: {
			label: 'CUSTOMER'
		}
	})
	.state('app.creditblock.edit_credit_block', {
		url:'/editcreditblock/:customer_id',
		templateUrl: "assets/views/ubah_credit_block.html",
		resolve: loadSequence('editCreditBlockController', 'customerService'),
		title: "Ubah Credit Block",
				data : { logged_on_only: true, role: 'CREDITBLOCK' },
		ncyBreadcrumb: {
			label: 'UBAH'
		}
	})
		.state('app.creditblock.orders_with_credit_block', {
		url:'/orderswithcreditblock',
		templateUrl: "assets/views/credit_blocked_orders.html",
		resolve: loadSequence('ngTable', 'creditBlockListByOrderController'),
		title: "Order Dengan Credit Block",
				data : { logged_on_only: true, role: 'CREDITBLOCK' },
		ncyBreadcrumb: {
			label: 'ORDER'
		}
	})

	.state('app.master', {
		url: '/master',
		template: '<div ui-view class="fade-in-up"></div>',
		title: 'master',
		ncyBreadcrumb: {
			label:'MASTER'
		}
	})
	.state('app.master.customer_list', {
		url:'/customerlist',
		templateUrl: "assets/js/wave/customer_master/customer_master_list.html",
		resolve: loadSequence('ngTable', 'customerMasterListController', 'customerService', 'customerFactory', 'siteService'),
		title: "Daftar Customer",
				data : { logged_on_only: true, role: 'CUSTOMERMASTER' },
		ncyBreadcrumb: {
			label: 'CUSTOMER'
		}
	})
	.state('app.master.customer_new', {
		url:'/customernew',
		templateUrl: "assets/js/wave/customer_master/customer_master_new.html",
		resolve: loadSequence('ngTable', 'customerMasterNewController', 'customerService', 'customerFactory', 'customerModalController', 'customerModalDirective'),
		title: "Daftar Customer",
		data : { logged_on_only: true, role: 'CUSTOMERMASTER' },
		ncyBreadcrumb: {
			label: 'CUSTOMER'
		}
	})
		.state('app.master.customer_edit', {
		url:'/customeredit/:customer_id',
		templateUrl: "assets/js/wave/customer_master/customer_master_edit.html",
		resolve: loadSequence('customerMasterEditController', 'customerService', 'customerFactory', 'customerModalController', 'customerModalDirective'),
		title: "Ubah Customer",
				data : { logged_on_only: true, role: 'CUSTOMERMASTER' },
		ncyBreadcrumb: {
			label: 'UBAH'
		}
	})
		.state('app.master.user', {
			url:'/user',
			templateUrl: "assets/js/wave/user_master/user_master_list.html",
			resolve: loadSequence('ngTable', 'userMasterListController', 'userService'),
			title: "Daftar User",
			data : { logged_on_only: true, role: 'USERMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.user_new', {
			url:'/usernew',
			templateUrl: "assets/js/wave/user_master/user_master_new.html",
			resolve: loadSequence('ngTable', 'userMasterNewController', 'userService'),
			title: "New User",
			data : { logged_on_only: true, role: 'USERMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.user_edit', {
			url:'/useredit/:user/t/:tab',
			templateUrl: "assets/js/wave/user_master/user_master_edit.html",
			resolve: loadSequence('userMasterEditController', 'userService'),
			title: "Modify User",
			data : { logged_on_only: true, role: 'USERMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.item_list', {
			url:'/itemlist',
			templateUrl: "assets/views/item_master_list.html",
			resolve: loadSequence('ngTable', 'itemMasterListController'),
			title: "Daftar Item",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'ITEM'
			}
		})
		.state('app.master.item_edit', {
			url:'/itemedit/:item_code',
			templateUrl: "assets/views/item_master_edit.html",
			resolve: loadSequence('itemMasterEditController'),
			title: "Ubah Item",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'UBAH'
			}
		})
		.state('app.master.stock', {
			url:'/stock',
			templateUrl: "assets/js/wave/stock_master/stock_master_list.html",
			resolve: loadSequence('ngTable', 'stockMasterListController', 'itemService', 'categoryFactory'),
			title: "Daftar Stock",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.stock_new', {
			url:'/stockbaru',
			templateUrl: "assets/js/wave/stock_master/stock_master_new.html",
			resolve: loadSequence('ngTable', 'stockMasterNewController', 'itemService', 'categoryFactory'),
			title: "Stock Baru",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.stock_edit', {
			url:'/stockedit/:item_code',
			templateUrl: "assets/js/wave/stock_master/stock_master_edit.html",
			resolve: loadSequence('ngTable', 'stockMasterEditController', 'itemService', 'purchaseService', 'itemFactory', 'categoryFactory'),
			title: "Ubah Stock",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.stock_import', {
			url:'/stockimport',
			templateUrl: "assets/js/wave/stock_master/stock_master_import.html",
			resolve: loadSequence('ngTable', 'stockMasterImportController', 'inventoryService'),
			title: "Import Stock",
			data : { logged_on_only: true, role: 'STOCKMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.vendor', {
			url:'/vendor',
			templateUrl: "assets/js/wave/vendor_master/vendor_master.html",
			resolve: loadSequence('ngTable', 'vendorMasterController', 'vendorService', 'vendorFactory'),
			title: "Daftar Vendor",
			data : { logged_on_only: true, role: 'VENDORMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.vendor_new', {
			url:'/vendorbaru',
			templateUrl: "assets/js/wave/vendor_master/vendor_master_new.html",
			resolve: loadSequence('ngTable', 'vendorMasterNewController', 'vendorService', 'vendorFactory'),
			title: "Vendor Baru",
			data : { logged_on_only: true, role: 'VENDORMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.vendor_edit', {
			url:'/vendoredit/:reference',
			templateUrl: "assets/js/wave/vendor_master/vendor_master_edit.html",
			resolve: loadSequence('ngTable', 'vendorMasterEditController', 'vendorService', 'vendorFactory'),
			title: "Ubah Vendor",
			data : { logged_on_only: true, role: 'VENDORMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site', {
			url:'/site',
			templateUrl: "assets/js/wave/site_master/site_master.html",
			resolve: loadSequence('ngTable', 'siteMasterController', 'siteService'),
			title: "Daftar Site",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_new', {
			url:'/sitebaru',
			templateUrl: "assets/js/wave/site_master/site_master_new.html",
			resolve: loadSequence('ngTable', 'siteMasterNewController', 'siteService'),
			title: "Site Baru",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.site_edit', {
			url:'/siteedit/:reference',
			templateUrl: "assets/js/wave/site_master/site_master_edit.html",
			resolve: loadSequence('ngTable', 'siteMasterEditController', 'siteService', 'customerFactory'),
			title: "Ubah Site",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_locations', {
			url:'/sitelocations/:reference',
			templateUrl: "assets/js/wave/site_master/site_locations.html",
			resolve: loadSequence('ngTable', 'siteLocationsController', 'siteService'),
			title: "Daftar Lokasi",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_location_new', {
			url:'/sitelocationnew/:site_id',
			templateUrl: "assets/js/wave/site_master/site_locations_new.html",
			resolve: loadSequence('ngTable', 'siteLocationsNewController', 'siteService'),
			title: "Daftar Lokasi",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_location_edit', {
			url:'/sitelocationedit/:storage_id',
			templateUrl: "assets/js/wave/site_master/site_locations_edit.html",
			resolve: loadSequence('ngTable', 'siteLocationsEditController', 'siteService'),
			title: "Daftar Lokasi",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_bin', {
			url:'/sitebin/:storage_id',
			templateUrl: "assets/js/wave/site_master/site_bin.html",
			resolve: loadSequence('ngTable', 'siteBinController', 'siteService'),
			title: "Daftar Bin",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_bin_new', {
			url:'/sitebinnew/:storage_id',
			templateUrl: "assets/js/wave/site_master/site_bin_new.html",
			resolve: loadSequence('ngTable', 'siteBinNewController', 'siteService'),
			title: "Buat Bin",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.site_bin_edit', {
			url:'/sitebinedit/:bin_id',
			templateUrl: "assets/js/wave/site_master/site_bin_edit.html",
			resolve: loadSequence('ngTable', 'siteBinEditController', 'siteService'),
			title: "Ubah Bin",
			data : { logged_on_only: true, role: 'SITEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.attribute', {
			url:'/attribute',
			templateUrl: "assets/js/wave/attribute_master/attribute_master_list.html",
			resolve: loadSequence('ngTable', 'attributeMasterListController', 'attributeFactory'),
			title: "Daftar Attribute",
			data : { logged_on_only: true, role: 'ATTRIBUTEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.attribute_new', {
			url:'/attributebaru',
			templateUrl: "assets/js/wave/attribute_master/attribute_master_new.html",
			resolve: loadSequence('ngTable', 'attributeMasterNewController', 'attributeFactory'),
			title: "Attribute Baru",
			data : { logged_on_only: true, role: 'ATTRIBUTEMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.attribute_edit', {
			url:'/attributeedit/:attribute_id',
			templateUrl: "assets/js/wave/attribute_master/attribute_master_edit.html",
			resolve: loadSequence('ngTable', 'attributeMasterEditController', 'attributeFactory'),
			title: "Ubah Attribute",
			data : { logged_on_only: true, role: 'ATTRIBUTEMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.bank', {
			url:'/bank',
			templateUrl: "assets/js/wave/bank_master/bank_master_list.html",
			resolve: loadSequence('ngTable', 'bankMasterListController', 'bankFactory'),
			title: "Daftar Bank",
			data : { logged_on_only: true, role: 'BANKMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.bank_new', {
			url:'/bankbaru',
			templateUrl: "assets/js/wave/bank_master/bank_master_new.html",
			resolve: loadSequence('ngTable', 'bankMasterNewController', 'bankFactory'),
			title: "Bank Baru",
			data : { logged_on_only: true, role: 'BANKMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.bank_edit', {
			url:'/bankedit/:bank_id',
			templateUrl: "assets/js/wave/bank_master/bank_master_edit.html",
			resolve: loadSequence('ngTable', 'bankMasterEditController', 'bankFactory'),
			title: "Ubah Bank",
			data : { logged_on_only: true, role: 'BANKMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.category', {
			url:'/category',
			templateUrl: "assets/js/wave/category_master/category_master_list.html",
			resolve: loadSequence('ngTable', 'categoryMasterListController', 'categoryFactory'),
			title: "Daftar Category",
			data : { logged_on_only: true, role: 'CATEGORYMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.category_new', {
			url:'/categorybaru',
			templateUrl: "assets/js/wave/category_master/category_master_new.html",
			resolve: loadSequence('ngTable', 'categoryMasterNewController', 'categoryFactory'),
			title: "Category Baru",
			data : { logged_on_only: true, role: 'CATEGORYMASTER' },
			ncyBreadcrumb: {
				label: 'STOCK'
			}
		})
		.state('app.master.category_edit', {
			url:'/categoryedit/:category_id',
			templateUrl: "assets/js/wave/category_master/category_master_edit.html",
			resolve: loadSequence('ngTable', 'categoryMasterEditController', 'categoryFactory'),
			title: "Ubah Category",
			data : { logged_on_only: true, role: 'CATEGORYMASTER' },
			ncyBreadcrumb: {
				label: 'USER'
			}
		})
		.state('app.master.vehicle', {
			url:'/vehicle',
			templateUrl: "assets/js/wave/vehicle_master/vehicle_master.html",
			resolve: loadSequence('ngTable', 'vehicleMasterController', 'vehicleService'),
			title: "Vehicle",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'VEHICLE'
			}
		})

		.state('app.master.vehicle_new', {
			url:'/vehiclenew',
			templateUrl: "assets/js/wave/vehicle_master/vehicle_master_new.html",
			resolve: loadSequence('ngTable', 'vehicleMasterNewController', 'angularFileUpload', 'vehicleService' , 'vendorService'),
			title: "Vehicle",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'VEHICLE'
			}
		})

		.state('app.master.vehicle_edit', {
			url:'/vehicleedit/:vehicle_id',
			templateUrl: "assets/js/wave/vehicle_master/vehicle_master_edit.html",
			resolve: loadSequence('ngTable', 'vehicleMasterEditController', 'vehicleService','angularFileUpload','vendorService'),
			title: "Vehicle",
			data : { logged_on_only: true, role: 'ADMIN' },
			ncyBreadcrumb: {
				label: 'VEHICLE'
			}
		})
		.state('app.master.company', {
			url:'/company',
			templateUrl: "assets/js/wave/company_master/company_master.html",
			resolve: loadSequence('ngTable', 'companyMasterController', 'siteService', 'ckeditor-plugin', 'ckeditor', 'companyFactory'),
			title: "Daftar Company",
			data : { logged_on_only: true, role: 'COMPANYMASTER' },
			ncyBreadcrumb: {
				label: 'COMPANY'
			}
		})

		.state('app.report', {
			url: '/report',
			template: '<div ui-view class="fade-in-up"></div>',
			title: 'report',
			ncyBreadcrumb: {
				label:'REPORT'
			}
		})
		.state('app.report.delivery', {
			url:'/deliveryreport',
			templateUrl: "assets/views/delivery_report.html",
			resolve: loadSequence('ngTable', 'ngTableExport', 'deliveryReportController'),
			title: "Laporan Pengiriman",
			data : { logged_on_only: true, role: 'REPORT' },
			ncyBreadcrumb: {
				label: 'PENGIRIMAN'
			}
		})
		.state('app.report.travel_letter', {
			url:'/suratjalan',
			templateUrl: "assets/views/travel_letter_report.html",
			resolve: loadSequence('ngTable', 'ngTableExport', 'travelLetterReportController'),
			title: "Laporan Surat Jalan",
			data : { logged_on_only: true, role: 'REPORT' },
			ncyBreadcrumb: {
				label: 'SURAT JALAN'
			}
		})
		.state('app.report.on_time_delivery', {
			url:'/ontimedelivery',
			templateUrl: "assets/views/on_time_delivery_report.html",
			resolve: loadSequence('ngTable', 'ngTableExport', 'onTimeDeliveryReportController'),
			title: "Laporan On Time Delivery",
			data : { logged_on_only: true, role: 'REPORT' },
			ncyBreadcrumb: {
				label: 'ON TIME DELIVERY'
			}
		})

		.state('app.report.document_flow', {
			url:'/alurdokumenorder/:order_reference',
			templateUrl: "assets/views/document_flow.html",
			resolve: loadSequence('documentFlowController'),
			title: "Alur Dokumen",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'ALUR_DOKUMEN'
			}
		})
		.state('app.report.stock_report', {
			url:'/stock_report',
			templateUrl: "assets/js/wave/stock_report/stock_report.html",
			resolve: loadSequence('stockReportController', 'ngTable', 'itemService', 'siteService'),
			title: "Laporan Stock",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'LAPORAN STOCK'
			}
		})
		.state('app.report.inventory_report', {
			url:'/inventory_report/:order_reference',
			templateUrl: "assets/js/wave/inventory_report/inventory_report.html",
			resolve: loadSequence('inventoryReportController', 'ngTable', 'itemService', 'siteService', 'inventoryService', 'categoryFactory', 'itemFactory'),
			title: "Laporan Stock",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'LAPORAN INVENTORY'
			}
		})
		.state('app.report.stock_report_detail', {
			url:'/stock_report_detail/:site_id',
			params: {
				date_from: null,
				date_to: null,
				items: null
			},
			templateUrl: "assets/js/wave/stock_report/stock_report_detail.html",
			controller: function($scope, $stateParams) {
				$scope.date_from = $stateParams.date_from;
				$scope.date_to = $stateParams.date_to;
				$scope.items = $stateParams.items;
			},
			resolve: loadSequence('stockReportDetailController', 'ngTable', 'itemService', 'siteService'),
			title: "Laporan Stock",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'LAPORAN STOCK'
			}
		})

	.state('app.overall', {
		url:'/overall',
		templateUrl: "assets/views/overall_view.html",
		resolve: loadSequence('overallController'),
		title: "Overall",
				data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'OVERALL'
		}
	})

		.state('app.change_password', {
			url:'/gantipassword',
			templateUrl: "assets/views/change_password.html",
			resolve: loadSequence('changePasswordController'),
			title: "Ganti Password",
			data : { logged_on_only: true, role: '' },
			ncyBreadcrumb: {
				label: 'OVERALL'
			}
	})

	.state('app.noaccess', {
		url:'/noaccess',
		templateUrl: "assets/views/no_access.html",
		resolve: loadSequence('noAccessController'),
		title: "No Access",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'NOACCESS'
		}
	})

	.state('login', {
		url: '/login',
		templateUrl: "assets/views/login.html",
		resolve: loadSequence('loginController', 'sweet-alert', 'oitozero.ngSweetAlert', 'itemLookupService'),
		title: 'Login',
		ncyBreadcrumb: {
			label:'LOGIN'
		}
	})

	.state('logout', {
		url: '/logout'
	})

	.state('app.tools', {
			url: '/tools',
			template: '<div ui-view class="fade-in-up"></div>',
			title: 'report',
			ncyBreadcrumb: {
				label:'TOOL'
			}
		})

	.state('app.tools.qrscanner', {
		url:'/qrcodescanner',
		templateUrl: "assets/js/wave/tools/qr_code_scanner.html",
		resolve: loadSequence('ngTable', 'qrCodeScannerController', 'qrScanner'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'QR SCANNER'
		}
	})
	.state('app.tools.qrdetail', {
		url:'/qrcodedetail/:delivery_reference',
		templateUrl: "assets/js/wave/tools/qr_code_detail.html",
		resolve: loadSequence('ngTable', 'qrCodeDetailController', 'qrGenerator'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'Delivery Detail'
		}
	})

	// TEST  Breadcrumb berdasarkan stateparam
	/*
	.state('app.tools.qrdetail', {
		url:'/qrcodedetail/:delivery_reference',
		templateUrl: "assets/js/wave/tools/qr_code_detail.html",
		resolve: loadSequence('ngTable', 'qrCodeDetailController', 'qrGenerator'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		controller: function($stateParams, $scope) {
			$scope.foo=$stateParams.delivery_reference;
		},
		ncyBreadcrumb: {
			label: '{{foo}}'
		}
	})
	*/
	.state('app.tools.qrgenerator', {
		url:'/qrcodegenerator',
		templateUrl: "assets/js/wave/tools/qr_code_generator.html",
		resolve: loadSequence('ngTable', 'qrCodeGeneratorController', 'qrGenerator'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'QR GENERATOR'
		}
	})
	.state('app.tools.barcodegenerator', {
		url:'/barcodegenerator',
		templateUrl: "assets/js/wave/tools/barcode_generator.html",
		resolve: loadSequence('ngTable', 'barcodeGeneratorController', 'barcodeGenerator'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'QR GENERATOR'
		}
	})

	.state('app.tools.barcodescanner', {
		url:'/barcodescanner',
		templateUrl: "assets/js/wave/tools/barcode_scanner.html",
		//resolve: loadSequence('ngTable', 'barcodeScannerController', 'barcodeScanner'),
		title: "Test Page",
		data : { logged_on_only: true, role: '' },
		ncyBreadcrumb: {
			label: 'QR GENERATOR'
		}
	})
	// Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
	function loadSequence() {
		var _args = arguments;
		return {
			deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
				var promise = $q.when(1);
				for (var i = 0, len = _args.length; i < len; i++) {
					promise = promiseThen(_args[i]);
				}
				return promise;

				function promiseThen(_arg) {
					if (typeof _arg == 'function')
						return promise.then(_arg);
					else
						return promise.then(function () {
							var nowLoad = requiredData(_arg);
							if (!nowLoad)
								return $.error('Route resolve: Bad resource name [' + _arg + ']');
							return $ocLL.load(nowLoad);
						});
				}

				function requiredData(name) {
					if (jsRequires.modules)
						for (var m in jsRequires.modules)
							if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
								return jsRequires.modules[m];
					return jsRequires.scripts && jsRequires.scripts[name];
				}
			}]
		};
	}
}]);




