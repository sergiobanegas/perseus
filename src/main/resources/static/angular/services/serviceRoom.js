kurento_room.factory("serviceRoom", serviceRoom);

serviceRoom.$inject = [ "$resource", "$timeout", "serviceParticipateRoom", "serviceRequestJoinRoom", "serviceChatMessage"];

function serviceRoom($resource, $timeout, serviceParticipateRoom, serviceRequestJoinRoom, serviceChatMessage) {

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
			if (room.privateRoom==1){
				var newParticipate={};
				newParticipate.user=room.creator;
				newParticipate.room=room.id;
				newParticipate.team=room.team;
				newParticipate.roomPrivileges=2;
				serviceParticipateRoom.newParticipateRoom(newParticipate);
			}
		});
			
	}

	function updateRoom(updatedRoom) {
		updatedRoom.$update();
	}

	function deleteRoom(room) {
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].team==room.team && serviceParticipateRoom.getParticipateRooms()[i].room==room.id){					
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		
		if (room.privateRoom==1){
			for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
				if (serviceRequestJoinRoom.getRequestJoinRooms()[i].room==room.id){
					serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
				}
			}
		}
		for (var i=0;i<serviceChatMessage.getChatMessages().length;i++){
			if (serviceChatMessage.getChatMessages()[i].team==room.team && serviceChatMessage.getChatMessages()[i].room==room.id){
				serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
			}
		}
		var room = $resource('/rooms/:id', { id: room.id});
		room.delete();
	};

}