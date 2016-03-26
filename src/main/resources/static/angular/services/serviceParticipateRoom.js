perseus.factory("serviceParticipateRoom", serviceParticipateRoom);

serviceParticipateRoom.$inject = [ "$resource", "$timeout", "$http"];

function serviceParticipateRoom($resource, $timeout, $http) {

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
		getParticipateByUser : getParticipateByUser,
		getRoomParticipates : getRoomParticipates,
		isMember : isMember,
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
	
	function getParticipateByUser(id){
		for (var i=0;i<ParticipateRooms.length;i++){
    		if (ParticipateRooms[i].user==id){
    			return ParticipateRooms[i];
    		}
    	}
	}
	
	function getRoomParticipates(room){
		var promise = $http.get('/participaterooms/room/'+room).
	    success(function (result) {
	        var participates = result.data;
	        return participates;
	    });
	    return promise;
	}
	
	function isMember(id){
		for (var i=0;i<ParticipateRooms.length;i++){
    		if (ParticipateRooms[i].user==id){
    			return true;
    		}
    	}
		return false;
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