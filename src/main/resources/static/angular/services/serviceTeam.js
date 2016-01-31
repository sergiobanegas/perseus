perseus.factory("serviceTeam", serviceTeam);

serviceTeam.$inject = [ "$resource", "$timeout", "$http", "$cookieStore", "serviceParticipate", "serviceRoom", "serviceChatMessage", "servicePrivateMessage", "serviceParticipateRoom", "serviceRoomInvite", "serviceRequestJoinRoom", "serviceRequestJoinTeam"];

function serviceTeam($resource, $timeout, $http, $cookieStore, serviceParticipate, serviceRoom, serviceChatMessage, servicePrivateMessage, serviceParticipateRoom, serviceRoomInvite, serviceRequestJoinRoom, serviceRequestJoinTeam) {

	var TeamResource = $resource('/teams/:id', 
			{ id : '@id'}, 
			{ update : {method : "PUT"}}
		);
 
	var teams = [];
	
	function autoreload(){
		reload();
		$timeout(autoreload, 5000);
	}
	
	autoreload();
	
	return {
		reload : reload,
		getTeams : getTeams,
		getTeam : getTeam,		
		newTeam : newTeam,
		updateTeam : updateTeam,
		deleteTeam : deleteTeam,
		getTeamByName : getTeamByName
	}

	function reload(){
		var promise = TeamResource.query(function(newteams){
			teams.length = 0;
			teams.push.apply(teams, newteams);
		}).$promise;
		return promise;
	}
	
	function getTeams() {
		return teams;
	}
	
	function getTeam(id){
		for (var i=0; i<teams.length;i++){
			if (teams[i].id==id){
				return teams[i];
				break;
			}
		}
	}
	
	function getTeamByName(teamname){
		var team = $resource('/teams/name/:name', { name: teamname});
		return team;
	}

	function newTeam(newTeam) {
		new TeamResource(newTeam).$save(function(team) {
			teams.push(team);
			var user=$cookieStore.get("user");
			var newParticipate={};
			newParticipate.user=user.id;
			newParticipate.team=team.id;
			newParticipate.teamPrivileges=2;
			serviceParticipate.newParticipate(newParticipate);
		});		
	}

	function updateTeam(updatedTeam) {
		updatedTeam.$update();
	}
	

	function deleteTeam(team) {
		for (var i = 0; i<serviceRoom.getRooms().length;i++){
			if (serviceRoom.getRooms()[i].team == team.id){
				serviceRoom.deleteRoom(serviceRoom.getRooms()[i]);
			}		
		}		
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team == team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i = 0; i<serviceChatMessage.getChatMessages().length;i++){
			if (serviceChatMessage.getChatMessages()[i].team == team.id){
				serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
			}
		}	
		for (var i = 0; i<servicePrivateMessage.getPrivateMessages().length;i++){
			if (servicePrivateMessage.getPrivateMessages()[i].team == team.id){
				servicePrivateMessage.deletePrivateMessage(servicePrivateMessage.getPrivateMessages()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].team==team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].team==team.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}		
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].team==team.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		for (var i=0;i<serviceRequestJoinTeam.getRequestJoinTeams().length;i++){
			if (serviceRequestJoinTeam.getRequestJoinTeams()[i].team==team.id){
				serviceRequestJoinTeam.deleteRequestJoinRoom(serviceRequestJoinTeam.getRequestJoinTeams()[i]);
			}
		}
		var team = $resource('/teams/:id', { id: team.id});
		team.delete();
	};
}