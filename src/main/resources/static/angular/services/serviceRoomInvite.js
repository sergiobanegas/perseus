kurento_room.factory("serviceRoomInvite", serviceRoomInvite);

serviceRoomInvite.$inject = [ "$resource", "$timeout"];

function serviceRoomInvite($resource, $timeout) {

	var RoomInviteResource = $resource('/roominvites/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var RoomInvites = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getRoomInvites : getRoomInvites,
		getRoomInvite : getRoomInvite,		
		newRoomInvite : newRoomInvite,
		updateRoomInvite : updateRoomInvite,
		deleteRoomInvite : deleteRoomInvite
		}

	function reload(){
		return RoomInviteResource.query(function(newRoomInvites){
			RoomInvites.length = 0;
			RoomInvites.push.apply(RoomInvites, newRoomInvites);
		}).$promise;
	}
	
	function getRoomInvites() {
		return RoomInvites;
	}

	function getRoomInvite(id) {
		for (var i = 0; i < RoomInvites.length; i++) {
			if (RoomInvites[i].id.toString() === id.toString()) {
				return RoomInvites[i];
			}
		}
	}
	
	function newRoomInvite(newRoomInvite) {
		new RoomInviteResource(newRoomInvite).$save(function(RoomInvite) {
			RoomInvites.push(RoomInvite);
		});
			
	}

	function updateRoomInvite(updatedRoomInvite) {
		updatedRoomInvite.$update();
	}

	function deleteRoomInvite(RoomInvite) {
		var request = $resource('/roominvites/:id', { id: RoomInvite.id});
		request.delete();
	}	
	
}