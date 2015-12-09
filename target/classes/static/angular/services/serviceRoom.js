kurento_room.factory("serviceRoom", serviceRoom);

serviceRoom.$inject = [ "$resource", "$timeout"];

function serviceRoom($resource, $timeout) {

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

	function getRoom(id) {
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].id.toString() === id.toString()) {
				return rooms[i];
			}
		}
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