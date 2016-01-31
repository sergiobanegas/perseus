perseus.factory("serviceUser", serviceUser);

serviceUser.$inject = [ "$resource", "$timeout", "$cookieStore", "serviceParticipate", "serviceParticipateRoom", "serviceRoomInvite", "serviceRequestJoinRoom", "serviceRequestJoinTeam", "serviceChatMessage", "servicePrivateMessage"];

function serviceUser($resource, $timeout, $cookieStore, serviceParticipate, serviceParticipateRoom, serviceRoomInvite, serviceRequestJoinRoom, serviceRequestJoinTeam, serviceChatMessage, servicePrivateMessage) {
	
	
	var UserResource = $resource('/users/:id', 
		{ id : '@id'}, 
		{ update : {method : 'PUT'}}
	);

	var users = [];
	
	var session = $cookieStore.get("user"); //nota: he usado $cookieStore porque $cookies no almacenaba la clase user
	
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getSession : getSession,
		loginUser : loginUser,
		logout : logout,
		getUsers : getUsers,
		getUser : getUser,
		newUser : newUser,
		updateUser : updateUser,
		deleteUser : deleteUser
	}

	function reload(){
		return UserResource.query(function(newusers){
			users.length = 0;
			users.push.apply(users, newusers);
		}).$promise;
	}
	
	function getUsers() {
		return users;
	}
	
	function getSession(){
		return session;
	}

	function getUser(id) {
		for (var i=0; i< users.length;i++){
			if (users[i].id==id){
				return users[i];
				break;
			}
		}
	};
	
	function newUser(newUser) {
		new UserResource(newUser).$save(function(user) {
			users.push(user);
		});	
	}
	
	function loginUser(user) {
		$cookieStore.put("user", user);
		session=user;
	}
	
	function logout() {
		$cookieStore.remove("user");
		session={};
	}

	function updateUser(updatedUser) {
		UserResource.update({id: updatedUser.id}, updatedUser);
	}

	function deleteUser(user) {
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user==user.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user==user.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].user==user.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user==user.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		
		for (var i=0;i<serviceRequestJoinTeam.getRequestJoinTeams().length;i++){
			if (serviceRequestJoinTeam.getRequestJoinTeams()[i].user==user.id){
				serviceRequestJoinTeam.deleteRequestJoinTeam(serviceRequestJoinTeam.getRequestJoinTeams()[i]);
			}
		}
		for (var i=0;i<serviceChatMessage.getChatMessages().length;i++){
			if (serviceChatMessage.getChatMessages()[i].user==user.id){
				serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
			}
		}
		for (var i=0;i<servicePrivateMessage.getPrivateMessages().length;i++){
			if (servicePrivateMessage.getPrivateMessages()[i].transmitter==user.id || servicePrivateMessage.getPrivateMessages()[i].receiver==user.id){
				servicePrivateMessage.deletePrivateMessage(servicePrivateMessage.getPrivateMessages()[i]);
			}
		}
		var user = $resource('/users/:id', { id: user.id});
		user.delete();
	}	
}