app.service('PurchaseService', function($http, apiUrl, $window) {
	var url = apiUrl + "purchaseapi/";

	this.createPDF = function(requestReference){
		//return $http.post(url + 'create_pdf' , requestReference);
		
		var download = $window.open(url + 'create_pdf/' + requestReference,"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
		download.history.pushState("blank", "blank", "blank");
		//							( STRING, TITLE, URL)
	}
    this.createServicePDF = function(requestReference){
        //return $http.post(url + 'create_pdf' , requestReference);

        var download = $window.open(url + 'create_pdf_service/' + requestReference,"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
        download.history.pushState("blank", "blank", "blank");
        //							( STRING, TITLE, URL)
    }


    this.createStockCard = function(requests_delivery_request_id){
        //return $http.post(url + 'create_pdf' , requestReference);

        var download = $window.open(url + 'create_stock_card/' + requests_delivery_request_id,"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
        download.history.pushState("blank", "blank", "blank");
        //							( STRING, TITLE, URL)
    }

    this.createGRReport = function(){
        //return $http.post(url + 'create_pdf' , requestReference);

        var download = $window.open(url + 'create_gr_report/',"location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes");
        download.history.pushState("blank", "blank", "blank");
        //							( STRING, TITLE, URL)
    }

    this.getUsersList = function() {
		return $http.get(url + 'get_users_list');
	}

	this.getSiteList = function() {
		return $http.get(url + 'get_site_list');
	}
	this.getStorageList = function() {
		return $http.get(url + 'get_storage_list');
	}
    this.getBinList = function() {
        return $http.get(url + 'get_bin_list');
    }
    this.getBatchList = function() {
        return $http.get(url + 'get_batch_list');
    }
	
	this.getDraftById = function(id){
		return $http.get(url + 'get_draft_by_id/' + id);
	}
	this.getDraftByDraftReference = function(draftReference){
		return $http.get(url + 'get_draft_purchase_by_draft_reference/' + draftReference);
	}
	
	this.getRequestsByDraftReference = function(draftReference){
		return $http.get(url + 'get_purchase_by_draft_reference/' + draftReference);
	}
	
	this.getActiveRequestsByDraftReference = function(requestsReference){
		return $http.get(url + 'get_active_requests_by_requests_reference/' + requestsReference);
	}
	
	this.getActiveItemRequestsByRequestsId = function(requestsId){
		return $http.get(url + 'get_active_item_requests_by_requests_id/' + requestsId);
	}
	
	this.getActiveDeliveryRequestsByRequestsId = function(requestsId){
		return $http.get(url + 'get_active_delivery_requests_by_requests_id/' + requestsId);
	}

	this.getActiveDeliveryRequestsItemsByRequestsId = function(requestsDeliveryRequestId){
		return $http.get(url + 'get_active_delivery_requests_items_by_requests_delivery_request_id/' + requestsDeliveryRequestId);
	}

	this.getDeliveredItemsListByDeliveryRequestsId = function(requestsDeliveryRequestId){
		return $http.get(url + 'get_delivered_items_list_by_requests_delivery_request_id/' + requestsDeliveryRequestId);
	}

	this.getActiveItemServiceRequestsByRequestsId = function(requestsId){
		return $http.get(url + 'get_active_item_service_requests_by_requests_id/' + requestsId);
	}
	
	this.getActiveDeliveryRequestsByDeliveryRequestsId = function(deliveryRequestsId){
		return $http.get(url + 'get_active_delivery_requests_by_delivery_requests_id/' + deliveryRequestsId);
	}
	
	this.insertPurchaseRequest = function(data){
		return $http.post(url + 'insert_purchase_request', data);
	}
	
	this.insertDraftPurchase = function(data){
		return $http.post(url + 'insert_draft_purchase', data);
	}

	this.insertDraftService = function(data){
		return $http.post(url + 'insert_draft_service', data);
	}

	this.insertDeliveredItems = function(data){
		return $http.post(url + 'insert_delivered_items', data);
	}

	this.insertCompletedService = function(data){
		return $http.post(url + 'insert_completed_service', data);
	}
	
	this.isUserApprover = function(data){
		return $http.post(url + 'is_user_approver', data);
	}
	
	this.getRequestList = function(){
		return $http.get(url + 'get_request');
	}
	
	this.getRequestListByApproverId = function(){
		return $http.get(url + 'get_request_by_approver_id');
	}
	
	this.getApprovedRequestListByApproverId = function(){
		return $http.get(url + 'get_approved_request_by_approver_id');
	}

    this.getPurchaseRequestById = function(id){
        return $http.get(url + 'get_purchase_request_by_id/' + id);
    }

    this.getApprover = function(amount, currency, type){
        return $http.get(url + 'get_approver/' + amount +"/"+ currency +"/"+ type);
    }

    this.approveDraftOrder = function(data) {
		return $http.post(url + 'approve_draft_order', data);
	}

	this.approveDraftServiceOrder = function(data) {
		return $http.post(url + 'approve_draft_service_order', data);
	}
	
	this.updateDraftPurchase = function(data) {
		return $http.post(url + 'update_draft_order', data);
	}

	this.updateCompletedDeliveryRequest = function(data) {
		return $http.post(url + 'update_completed_delivery_request', data);
	}

    this.updateLocationsDeliveredRequestItem = function(data) {
        return $http.post(url + 'update_locations_delivered_request_item', data);
    }

    this.updateBatchDeliveredRequestItem = function(data) {
        return $http.post(url + 'update_batch_delivered_request_item', data);
    }

	this.updateRemarkDeliveredRequestItem = function(data) {
		return $http.post(url + 'update_remark_delivered_request_item', data);
	}

	this.updateServiceRequestToCompleteServiceRequest = function(data) {
		return $http.post(url + 'update_service_request_to_complete_service_request', data);
	}

	this.needChangedDraftOrder = function(data) {
		return $http.post(url + 'need_changed_draft_order', data);
	}
	
	this.deleteDraftPurchaseOrder = function(data) {
		return $http.post(url + 'delete_draft_order', data);
	}
	this.getActiveRequestsList  = function(){
		return $http.get(url + 'get_active_requests_list');
	}
	this.getCompletedPurchaseList = function(){
		return $http.get(url + 'get_completed_requests_list');
	}
    this.getCompletedServiceByDeliveryRequestId = function(deliveryRequestId){
        return $http.get(url + 'get_completed_service_by_requests_delivery_request_id/' + deliveryRequestId);
    }
		
    this.isPurchaseRequestsComplete = function(requestId){
        return $http.get(url + 'is_purchase_requests_complete/' + requestId);
    }
		
	this.getPurchaseDiscussionList = function(){
		return $http.get(url + 'get_purchase_discussion_list');
	}
});
