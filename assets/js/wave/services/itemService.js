app.service('ItemService', function($http, apiUrl) {
	var url = apiUrl;
	
  this.getItemList = function(){
		return $http.get(url + 'itemapi/get_all_items');
	}
	
	this.getRawItemList = function(){
		return $http.get(url + 'itemapi/get_raw_item_list');
	}
	
	this.getItemByItemCode = function(itemCode){
		return $http.get(url + 'itemapi/get_item_by_item_code/' + itemCode);
	}
	
	this.getItemWithUomByItemCode = function(itemCode){
		return $http.get(url + 'itemapi/get_item_with_uom_by_item_code/' + itemCode);
	}
	
	this.insertItem = function(data){
		return $http.post(url + 'itemapi/insert_item', data);
	}
	
	this.updateItem = function(data){
		return $http.post(url + 'itemapi/update_item', data);
	}
	
	this.updateItemBaseUom = function(data){
		return $http.post(url + 'itemapi/update_item_base_uom', data);
	}
	
	this.getItemUomConversionListByItemCode = function(itemCode){
		return $http.get(url + 'itemapi/get_item_uom_conversion_list_by_item_code/' + itemCode);
	}
	
	this.getItemUomHistoryListByItemCode = function(itemCode){
		return $http.get(url + 'itemapi/get_item_uom_history_list_by_item_code/' + itemCode);
	}
	
	this.insertItemUomConversion = function(data){
		return $http.post(url + 'itemapi/insert_item_uom_conversion', data);
	}
	
	this.updateItemUomConversion = function(data){
		return $http.post(url + 'itemapi/update_item_uom_conversion', data);
	}
	
	this.deleteItemUomConversion = function(data){
		return $http.post(url + 'itemapi/delete_item_uom_conversion', data);
	}
	
	this.getItemName = function(itemCode) {
		this.itemList = JSON.parse(localStorage.getItem('vontisItemList'));
		if (itemCode !== null) {
			for (var i = 0 ; i < this.itemList.length ; i++) {
				if (this.itemList[i].item_code == itemCode) {
					return this.itemList[i].item_name;
				}
			}
				
			return "";
		}
		else {
			return "";
		}
			
	}

    this.getItemDeliveryByDeliveryItemId = function(id){
        return $http.get(url + 'itemapi/get_item_delivery_by_delivery_item_id/' + id);
    }

    this.getInventoryStockListByItemCode = function(itemCode){
        return $http.get(url + 'itemapi/get_inventory_stock_by_item_code/' + itemCode);
    }

    this.getInventoryList = function(data){
        return $http.post(url + 'itemapi/get_all_inventory', data);
    }

    this.getInventoryListByItemCode = function(itemCode){
        return $http.get(url + 'itemapi/get_all_inventory_by_item_code/' + itemCode);
    }

	this.getInventoryBySiteReference = function(siteReference, itemCode){
		return $http.get(url + 'itemapi/get_all_inventory_by_site_reference/' + siteReference + '/' + itemCode);
	}

    this.getBatchListByItemCode = function(itemCode){
        return $http.get(url + 'itemapi/get_all_batch_by_item_code/' + itemCode);
    }

	this.getBatchByBatchReference = function(batchId){
		return $http.get(url + 'itemapi/get_batch_by_batch_reference/' + batchId);
	}
	
	this.getManualStockSettingList = function(){
		return $http.get(url + 'itemapi/get_manual_stock_setting_list');
	}
	
	this.updateItemLocation = function(data){
		return $http.post(url + 'itemapi/update_item_location', data);
	}
	
	this.updateItemAlternate = function(data){
		return $http.post(url + 'itemapi/update_item_alternate', data);
	}
	
	this.getItemAlternateListByItemCode = function(itemCode){
		return $http.get(url + 'itemapi/get_item_alternate_list/' + itemCode);
	}
});