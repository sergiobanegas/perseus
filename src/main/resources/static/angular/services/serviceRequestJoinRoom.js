kurento_room.factory("serviceRequestJoinRoom", serviceRequestJoinRoom);

serviceRequestJoinRoom.$inject = [ "$resource", "$timeout"];

function serviceRequestJoinRoom($resource, $timeout) {

	var RequestJoinRoomResource = $resource('/requestjoinrooms/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var RequestJoinRooms = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getRequestJoinRooms : getRequestJoinRooms,
		getRequestJoinRoom : getRequestJoinRoom,		
		newRequestJoinRoom : newRequestJoinRoom,
		updateRequestJoinRoom : updateRequestJoinRoom,
		deleteRequestJoinRoom : deleteRequestJoinRoom
		}

	function reload(){
		return RequestJoinRoomResource.query(function(newRequestJoinRooms){
			RequestJoinRooms.length = 0;
			RequestJoinRooms.push.apply(RequestJoinRooms, newRequestJoinRooms);
		}).$promise;
	}
	
	function getRequestJoinRooms() {
		return RequestJoinRooms;
	}

	function getRequestJoinRoom(user, room) {
		var request = $resource('/participaterooms/:user/:privileges', { user: user.id, privileges: user.privileges});
		return request;
	}
	
	function newRequestJoinRoom(newRequestJoinRoom) {
		new RequestJoinRoomResource(newRequestJoinRoom).$save(function(RequestJoinRoom) {
			RequestJoinRooms.push(RequestJoinRoom);
			
		});	
	}

	function updateRequestJoinRoom(updatedRequestJoinRoom) {
		updatedRequestJoinRoom.$update();
	}

	function deleteRequestJoinRoom(RequestJoinRoom) {
		var request = $resource('/requestjoinrooms/:id', { id: RequestJoinRoom.id});
		request.delete();
	}	
		
}