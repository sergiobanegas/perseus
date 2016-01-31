perseus.factory("serviceParticipateRoom", serviceParticipateRoom);

serviceParticipateRoom.$inject = [ "$resource", "$timeout"];

function serviceParticipateRoom($resource, $timeout) {

	var ParticipateRoomResource = $resource('/participaterooms/:id', 
		{ id : '@id'}, 
		{ update : {method : "PUT"}}
	);

	var ParticipateRooms = [];
		
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getParticipateRooms : getParticipateRooms,
		getParticipateRoom : getParticipateRoom,		
		newParticipateRoom : newParticipateRoom,
		updateParticipateRoom : updateParticipateRoom,
		deleteParticipateRoom : deleteParticipateRoom
		}

	function reload(){
		return ParticipateRoomResource.query(function(newParticipateRooms){
			ParticipateRooms.length = 0;
			ParticipateRooms.push.apply(ParticipateRooms, newParticipateRooms);
		}).$promise;
	}
	
	function getParticipateRooms() {
		return ParticipateRooms;
	}

	function getParticipateRoom(user, room) {
		var request = $resource('/participaterooms/:user/:room', { user: user, room: room.id});
		return request;
	}
	
	function newParticipateRoom(newParticipateRoom) {
		new ParticipateRoomResource(newParticipateRoom).$save(function(ParticipateRoom) {
			ParticipateRooms.push(ParticipateRoom);
		});
			
	}

	function updateParticipateRoom(updatedParticipateRoom) {
		ParticipateRoomResource.update({id: updatedParticipateRoom.id}, updatedParticipateRoom);
	}

	function deleteParticipateRoom(ParticipateRoom) {
		var participate = $resource('/participaterooms/:id', { id: ParticipateRoom.id});
		participate.delete();
	}	
	
}