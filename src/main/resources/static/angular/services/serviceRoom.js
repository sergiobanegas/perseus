perseus.factory("serviceRoom", serviceRoom);

serviceRoom.$inject = [ "$resource", "$timeout", "$http"];

function serviceRoom($resource, $timeout, $http) {

	var RoomResource = $resource('/rooms/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var rooms = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getRooms : getRooms,
		getRoom : getRoom,		
		getRoomHttp : getRoomHttp,
		newRoom : newRoom,
		updateRoom : updateRoom,
		deleteRoom : deleteRoom
	}

	function reload(){
		return RoomResource.query(function(newrooms){
			rooms.length = 0;
			rooms.push.apply(rooms, newrooms);
		}).$promise;
	}
	
	function getRooms() {
		return rooms;
	}
	//has to be fixed
	function getRoom(id) {
		for (var i=0;i<rooms.length;i++){
    		if (rooms[i].id==id){
    			return rooms[i];
    		}
    	}
	}
	
	function getRoomHttp(id){
		var promise = $http.get('/rooms/'+id).
	    success(function (result) {
	        var room = result.data;
	        return room;
	    });
	    return promise;
	}
	
	function newRoom(newRoom) {
		new RoomResource(newRoom).$save(function(room) {
			rooms.push(room);
		});
			
	}

	function updateRoom(updatedRoom) {
		updatedRoom.$update();
	}

	function deleteRoom(room) {
		var room = $resource('/rooms/:id', { id: room.id});
		room.delete();
	};

}