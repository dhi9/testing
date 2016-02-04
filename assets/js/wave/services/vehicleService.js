app.service('VehicleService', function($http, apiUrl) {
	var url = apiUrl;
	
  this.getVehicleServiceListByVehicleId = function(vehicleId){
		return $http.get(url + 'vehicleapi/get_service_by_vehicle_id/' + vehicleId);
	}
	
	this.getVehicleList = function(){
		return $http.get(url + 'vehicleapi/get_vehicle_list');
	}
	this.getVehicleListByVehicleId = function(vehicleId){
		return $http.get(url + 'vehicleapi/get_vehicle_by_vehicle_id/' + vehicleId);
	}
	this.getVehicleTypeList = function(){
		return $http.get(url + 'vehicleapi/get_vehicle_type_list');
	}
	this.insertNewVehicle = function(data){
		//var accessString = JSON.stringify(capabilities);
		//return $http.post(url + 'vehicleapi/insert_vehicle, {accessdata: accessString});
		return $http.post(url + 'vehicleapi/insert_vehicle', data );
	}
	this.insertVehicleService = function(data){
		//var accessString = JSON.stringify(access);
		//return $http.post(this.hostname+'userapi/set_access', {accessdata: accessString}, this.httpPostConfig);
		return $http.post(url + 'vehicleapi/insert_vehicle_service', data);
	}
	
	this.updateVehicle = function(data){
		return $http.post(url + 'vehicleapi/update_vehicle', data);
	}
	this.updateVehicleService = function(data){
		return $http.post(url + 'vehicleapi/update_service', data);
	}
});