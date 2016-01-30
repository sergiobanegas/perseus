/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('adminTeamController', function ($scope, $http, $route, $routeParams, $mdDialog, $mdToast, serviceUser, serviceParticipate, serviceRoomInvite, serviceRequestJoinRoom, serviceParticipateRoom, $window) {
	
	$scope.hola="hola";
	$scope.team={};
    $http.get('/teams/'+$routeParams.id)
	  .then(function(result) {
	    $scope.team = result.data;
	});
	
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.password="";
	
	$scope.findUserById = function(iduser){
		for (var i=0; i< serviceUser.getUsers().length;i++){
			if (serviceUser.getUsers()[i].id==iduser){
				return serviceUser.getUsers()[i];
				break;
			}
		}
	}
	
	$scope.members = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].idteam==$scope.team.id){
				teamUsers.push(serviceParticipate.getParticipates()[i]);
			}
		}
		return teamUsers;
	};	
	
	$scope.setModerator = function (member){
			member.teamPrivileges=1;
			serviceParticipate.updateParticipate(member);
			$scope.notification(member.userName+" is now a moderator");
	};
	
	$scope.removeModerator = function (member){
			member.teamPrivileges=0;
			serviceParticipate.updateParticipate(member);
			$scope.notification(member.userName+" is now a normal member");
	}
	
	$scope.kickMember = function(member) {
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].iduser==member.iduser && serviceParticipate.getParticipates()[i].idteam==$scope.team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].user==member.iduser && serviceRoomInvite.getRoomInvites()[i].team==$scope.team.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user==member.iduser && serviceRequestJoinRoom.getRequestJoinRooms()[i].team==$scope.team.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user==member.iduser && serviceParticipateRoom.getParticipateRooms()[i].team==$scope.team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		$scope.notification("User kicked from the team");		
	}	
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	  };
	
	
	$scope.exit = function(){
		$window.location.href = '#/';
	}
});