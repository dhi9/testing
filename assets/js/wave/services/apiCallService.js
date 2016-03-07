app.service('ApiCallService', function ($http, apiUrl, $window) {

		this.hostname = apiUrl;
		
this.httpPostConfig = {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };  

    this.getItemLookup = function() {
        return $http.get(this.hostname+'itemapi/get_all_items');
    };

    this.getCustomerLookup = function() {
        return $http.get(this.hostname+'customerapi/get_customer_indexes');
    };
		
		this.getBlockedCustomers = function() {
        return $http.get(this.hostname+'customerapi/get_blocked_customers');
    };
		
		this.getAllCustomers = function() {
        return $http.get(this.hostname+'customerapi/get_all_customers');
    };
		
		this.getOrderUpdateHistory = function(order_id) {
        return $http.get(this.hostname+'updatehistoryapi/get_order_update_history/' + order_id);
    };
		
		this.getDeliveryUpdateHistory = function(delivery_id) {
        return $http.get(this.hostname+'updatehistoryapi/get_delivery_update_history/' + delivery_id);
    };
    
    this.getOrderDetail = function(order_id) {
        return $http.get(this.hostname+'orderapi/get_order_detail/' + order_id);
    };
    
    this.getGoodIssueItems = function(order_id) {
        return $http.get(this.hostname+'orderapi/get_good_issue_items/' + order_id);
    };
    
    this.getActiveOrders = function() {
         return $http.get(this.hostname+'orderapi/get_active_orders');
    };
		
		this.getCompletedOrders = function(filter) {
			var filterString = JSON.stringify(filter);
			return $http.post(this.hostname+'orderapi/get_completed_orders', {filterdata: filterString}, this.httpPostConfig);
		}
		
		this.getRejectedOrders = function(filter) {
			var filterString = JSON.stringify(filter);
			return $http.post(this.hostname+'orderapi/get_rejected_orders', {filterdata: filterString}, this.httpPostConfig);
		}
		
		this.getOrdersToDeliver = function() {
			return $http.get(this.hostname+'orderapi/get_orders_to_deliver');
		};

    this.submitNewOrder = function(order) {
        var orderDataString = JSON.stringify(order);
        return $http.post(this.hostname+'orderapi/create_new_order', {orderdata: orderDataString}, this.httpPostConfig);
    }

    this.updateOrder = function(order) {
        var orderDataString = JSON.stringify(order);
        return $http.post(this.hostname+'orderapi/update_order', {orderdata: orderDataString}, this.httpPostConfig);
    }

    this.updateGoodIssue = function(order) {
        var orderDataString = JSON.stringify(order);
        return $http.post(this.hostname+'orderapi/update_good_issue', {orderdata: orderDataString}, this.httpPostConfig);
    }
		this.saveOrderNotes = function(order) {
			var orderDataString = JSON.stringify(order);
			return $http.post(this.hostname+'orderapi/save_order_notes', {orderdata: orderDataString}, this.httpPostConfig);
		}
		
		this.forceCloseOrder = function(order) {
			var orderDataString = JSON.stringify(order);
			return $http.post(this.hostname+'orderapi/force_close_order', {orderdata: orderDataString}, this.httpPostConfig);
		}
		
		this.updateDelivery = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/update_delivery', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }
		
		this.addCreditBlock = function(creditBlock) {
        var creditBlockDataString = JSON.stringify(creditBlock);
        return $http.post(this.hostname+'customerapi/add_credit_block', {creditblockdata: creditBlockDataString}, this.httpPostConfig);
    }
		
		this.removeCreditBlock = function(creditBlock) {
        var creditBlockDataString = JSON.stringify(creditBlock);
        return $http.post(this.hostname+'customerapi/remove_credit_block', {creditblockdata: creditBlockDataString}, this.httpPostConfig);
    }
    
    this.submitNewDelivery = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/create_new_delivery', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }

    this.submitOrderDelivery = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/create_order_delivery', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }

    this.getDeliveryDetail = function(delivery_id) {
        return $http.get(this.hostname+'deliveryapi/get_delivery_detail/' + delivery_id);
    }
    this.getDeliveryDetailByReference = function(reference) {
        return $http.get(this.hostname+'deliveryapi/get_delivery_detail_by_reference/' + reference);
    }
		
		this.getBlockedOrders = function() {
        return $http.get(this.hostname+'orderapi/get_blocked_orders');
}

this.getDeliveryItemsByDeliveryId = function(delivery_id) {
        return $http.get(this.hostname+'deliveryapi/get_delivery_items_by_delivery_id/' + delivery_id);
    }
		this.cancelDeliveryRequest = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/cancel_delivery_request', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }
		
		this.createNewDeliveryRequest = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/insert_delivery_request', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }
		
		this.cancelDelivery = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/cancel_delivery', {deliverydata: deliveryDataString}, this.httpPostConfig);
		}
		
		this.login = function(user) {
        var userDataString = JSON.stringify(user);
        return $http.post(this.hostname+'userapi/login', {userdata: userDataString}, this.httpPostConfig);
    }
		
		this.deleteActiveLogin = function(user) {
        var userDataString = JSON.stringify(user);
        return $http.post(this.hostname+'userapi/delete_active_login', {userdata: userDataString}, this.httpPostConfig);
    }
		
		this.isLoggedOn = function() {
        return $http.get(this.hostname+'userapi/check_is_logged_on');
    }
		
		this.logout = function() {
        return $http.get(this.hostname+'userapi/logout');
    }

    this.submitNewDelivery = function(delivery) {
        var deliveryDataString = JSON.stringify(delivery);
        return $http.post(this.hostname+'deliveryapi/create_new_delivery', {deliverydata: deliveryDataString}, this.httpPostConfig);
    }
    
    this.getDeliveryDetail = function(delivery_id) {
        return $http.get(this.hostname+'deliveryapi/get_delivery_detail/' + delivery_id);
    }
		
		this.getDocumentFlow = function(orderReference) {
        return $http.get(this.hostname+'documentflowapi/get_document_flow/' + orderReference);
    }
		
		this.getMonthlyStats = function() {
        return $http.get(this.hostname+'statsapi/get_monthly_stats');
    }
		
		this.getTodayDeliveryStats = function() {
        return $http.get(this.hostname+'statsapi/get_today_delivery_stats');
    }
		
		this.getTodayDeliveries = function() {
        return $http.get(this.hostname+'statsapi/get_today_deliveries');
    }
		
		this.getNotReturnedDeliveries = function() {
        return $http.get(this.hostname+'statsapi/get_not_returned_deliveries');
    }
		
		this.deletePageLock = function() {
			return $http.get(this.hostname+'pagelockapi/delete_page_lock');
		}
		
		this.checkPageLock = function(pageLock) {
			var pageLockString = JSON.stringify(pageLock);
			return $http.post(this.hostname+'pagelockapi/check_page_lock', {pagelockdata: pageLockString}, this.httpPostConfig);
		}
		
	this.getDeliveryReport = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'reportapi/get_delivery_report', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getTravelLetterReport = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'reportapi/get_travel_letter_report', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getOnTimeDeliveryReport = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'reportapi/get_on_time_delivery_report', {filterdata: filterString}, this.httpPostConfig);
	}
		
	this.getAllCustomersByPhone = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'customerapi/get_all_customers_by_phone', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getActiveDeliveries = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'deliveryapi/get_active_deliveries', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getNotCompletedDeliveries = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'deliveryapi/get_not_completed_deliveries', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getCompletedDeliveries = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'deliveryapi/get_completed_deliveries', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.checkUserHasAccess = function(accessName) {
		return $http.get(this.hostname+'userapi/check_user_has_access/' + accessName);
	}
	
	this.checkUserHasAccessForSpecialRequest = function() {
		return $http.get(this.hostname+'userapi/check_user_has_access_for_special_request');
	}
	
	this.getUsersList = function() {
		return $http.get(this.hostname+'userapi/get_users_list');
	}
	
	this.insertUser = function(newUser) {
		var newUserString = JSON.stringify(newUser);
		return $http.post(this.hostname+'userapi/insert_user', {userdata: newUserString}, this.httpPostConfig);
	}
	
	this.resetPassword = function(user) {
		var userString = JSON.stringify(user);
		return $http.post(this.hostname+'userapi/reset_password', {userdata: userString}, this.httpPostConfig);
	}
	
	this.changePassword = function(password) {
		var passwordString = JSON.stringify(password);
		return $http.post(this.hostname+'userapi/change_password', {passworddata: passwordString}, this.httpPostConfig);
	}
	
	this.setAccess = function(access) {
		var accessString = JSON.stringify(access);
		return $http.post(this.hostname+'userapi/set_access', {accessdata: accessString}, this.httpPostConfig);
	}
	
	this.getAllAccessForUser = function(username) {
		return $http.get(this.hostname+'userapi/get_all_access_for_user/' + username);
	}

	this.getAllItems = function() {
		return $http.get(this.hostname+'itemapi/get_all_items');
	};
	
	this.insertItem = function(item) {
		var itemString = JSON.stringify(item);
		return $http.post(this.hostname+'itemapi/insert_item', {itemdata: itemString}, this.httpPostConfig);
	}
	
	this.getItemByItemCode = function(itemCode) {
		return $http.get(this.hostname+'itemapi/get_item_by_item_code/' + itemCode);
	}
	
	this.updateItem = function(item) {
		var itemString = JSON.stringify(item);
		return $http.post(this.hostname+'itemapi/update_item', {itemdata: itemString}, this.httpPostConfig);
	}
	
	this.insertDraftOrder = function(order) {
		var orderDataString = JSON.stringify(order);
		return $http.post(this.hostname+'orderapi/insert_draft_order', {orderdata: orderDataString}, this.httpPostConfig);
	}
	
	this.insertDraftOrderCart = function(order) {
		var orderDataString = JSON.stringify(order);
		return $http.post(this.hostname+'orderapi/insert_draft_order_cart', {orderdata: orderDataString}, this.httpPostConfig);
	}
	this.updateDraftOrderCart = function(order) {
		return $http.post(this.hostname+'orderapi/update_draft_order_cart', order);
	}
	this.finishCart = function(order) {
		return $http.post(this.hostname+'orderapi/finish_draft_order_cart', order);
	}
	
	this.getDraftOrderCartList = function() {
		return $http.get(this.hostname+'orderapi/get_draft_order_cart_list');
	}
	
	this.getDraftOrderCartByDraftId = function(draftId) {
		return $http.get(this.hostname+'orderapi/get_draft_order_cart_by_draft_id/'+draftId);
	}
	
	this.getDraftOrderList = function() {
		return $http.get(this.hostname+'orderapi/get_draft_order_list');
	}
	
	this.getDraftOrderByDraftId = function(draftId) {
		return $http.get(this.hostname+'orderapi/get_draft_order_by_draft_id/'+draftId);
	}
	
	this.approveDraftOrder = function(draft) {
		var draftDataString = JSON.stringify(draft);
		return $http.post(this.hostname+'orderapi/approve_draft_order', {draftdata: draftDataString}, this.httpPostConfig);
	}
	
	this.updateDraftOrder = function(draft) {
		var draftDataString = JSON.stringify(draft);
		return $http.post(this.hostname+'orderapi/update_draft_order', {draftdata: draftDataString}, this.httpPostConfig);
	}
	
	this.needChangedDraftOrder = function(draft) {
		var draftDataString = JSON.stringify(draft);
		return $http.post(this.hostname+'orderapi/need_changed_draft_order', {draftdata: draftDataString}, this.httpPostConfig);
	}
	
	this.deleteDraftOrder = function(draft) {
		var draftDataString = JSON.stringify(draft);
		return $http.post(this.hostname+'orderapi/delete_draft_order', {draftdata: draftDataString}, this.httpPostConfig);
	}
	
	this.getAllDepartmentForUser = function(username) {
		return $http.get(this.hostname+'userapi/get_all_department_for_user/' + username);
	}
	
	this.setDepartment = function(department) {
		var departmentString = JSON.stringify(department);
		return $http.post(this.hostname+'userapi/set_department', {departmentdata: departmentString}, this.httpPostConfig);
	}
	
	this.getOwnDraftOrderList = function() {
		return $http.get(this.hostname+'orderapi/get_own_draft_order_list');
	}
	
	this.getOwnActiveDraftOrderList = function() {
		return $http.get(this.hostname+'orderapi/get_own_active_draft_order_list');
	}
	
	this.getOwnChangedDraftOrderList = function() {
		return $http.get(this.hostname+'orderapi/get_own_changed_draft_order_list');
	}
	
	this.getDepartmentDraftOrderList = function() {
		return $http.get(this.hostname+'orderapi/get_department_draft_order_list');
	}
	
	this.getAllOrders = function(filter) {
		var filterString = JSON.stringify(filter);
		return $http.post(this.hostname+'orderapi/get_all_orders', {filterdata: filterString}, this.httpPostConfig);
	}
	
	this.getActiveDeliveriesForStat = function() {
		return $http.get(this.hostname+'deliveryapi/get_active_deliveries_for_stat');
	}
    this.getInventory = function() {
		return $http.get(this.hostname+'itemapi/get_all_inventory');
	}
  
	this.getDraftApproverByDraftId = function(draftId) {
		return $http.get(this.hostname+'orderapi/get_draft_approver_by_draft_id/' + draftId);
	};

	this.payOrder = function(order) {
		return $http.post(this.hostname+'orderapi/pay_order', order);
	}

	this.getStockReport = function(search) {
		return $http.post(this.hostname+'reportapi/get_stock_report', search);
	}

	this.getInventoryReport = function(data) {
		return $http.post(this.hostname+'reportapi/get_inventory_report', data);
	}

	this.checkData = function(data) {
		return $http.get(this.hostname+'kioskapi/check_data/'+ data);
	}


	this.exportStockReport = function(json){
		//return $http.post(url + 'create_pdf' , requestReference);

		var reportForm = document.createElement("form");
		reportForm.target = "Map";
		reportForm.method = "POST"; // or "post" if appropriate
		reportForm.action = this.hostname + "reportapi/export_stock_report";

		var reportInput = document.createElement("input");
		reportInput.type = "text";
		reportInput.name = "json";
		var string_json = JSON.stringify(json);
		reportInput.value = string_json;
		reportForm.appendChild(reportInput);

		document.body.appendChild(reportForm);

		reportForm.submit();

		//var download = $window.open(this.hostname + 'export_stock_report/',"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		//download.history.pushState("blank", "blank", "blank");
		//							( STRING, TITLE, URL)
	}
});
