/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('adminTeamController', function ($scope, $http, $route, $filter, $routeParams, $mdDialog, $mdToast, serviceNotification, serviceUser, serviceParticipate, serviceRoomInvite, serviceRequestJoinRoom, serviceParticipateRoom, $window) {
	
	$scope.team={};
    $http.get('/teams/'+$routeParams.id)
	  .then(function(result) {
	    $scope.team = result.data;
	});
	$scope.screen="users";
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.password="";
	
	
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(iduser);
	}
	
	$scope.members = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team==$scope.team.id){
				teamUsers.push(serviceParticipate.getParticipates()[i]);
			}
		}
		return teamUsers;
	};	
	
	$scope.membersAdminList = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team==$scope.team.id && serviceParticipate.getParticipates()[i].user!=$scope.user.id){
				teamUsers.push($scope.findUserById(serviceParticipate.getParticipates()[i].user));
			}
		}
		return teamUsers;
	};	
	
	$scope.setModerator = function (member){
		member.teamPrivileges=1;
		serviceParticipate.updateParticipate(member);
		serviceNotification.showNotification("Moderator", $scope.findUserById(member.user).name+" is now a moderator");			
	};
	
	$scope.removeModerator = function (member){
			member.teamPrivileges=0;
			serviceParticipate.updateParticipate(member);
			serviceNotification.showNotification("Normal user", $scope.findUserById(member.user).name+" is now a normal member");			
	}
	
	$scope.kickMember = function(member) {
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user==member.user && serviceParticipate.getParticipates()[i].team==$scope.team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].user==member.user && serviceRoomInvite.getRoomInvites()[i].team==$scope.team.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user==member.user && serviceRequestJoinRoom.getRequestJoinRooms()[i].team==$scope.team.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user==member.user && serviceParticipateRoom.getParticipateRooms()[i].team==$scope.team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		serviceNotification.showNotification("User kicked", "The user"+$scope.findUserById(member.user).name+" has been kicked from the team");					
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
	
	$scope.openLeaveTeamScreen = function(){
		$scope.screen="leaveTeam";
	}
	
	$scope.newAdmin;
	$scope.querySearch = function (query) {
		return $filter('filter')($scope.membersAdminList(), { name: query});
	}	
	
	$scope.leaveTeam = function(){
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user==$scope.newAdmin.id){
				var updateParticipate=serviceParticipate.getParticipates()[i];				
				updateParticipate.teamPrivileges=2;
				serviceParticipate.updateParticipate(updateParticipate);				
			}
		}
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user == $scope.user.id && serviceParticipate.getParticipates()[i].team == $scope.team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user == $scope.user.id && serviceParticipateRoom.getParticipateRooms()[i].team == $scope.team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipate.getParticipateRooms()[i]);
			}
		}
		
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user == $scope.user.id && serviceRequestJoinRoom.getRequestJoinRooms()[i].team == $scope.team.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].transmitter == $scope.user.id && serviceRoomInvite.getRoomInvites()[i].team == $scope.team.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}	
		$window.location.href = '#/';
		serviceNotification.showNotification("Goodbye", "You left the team");					
		
	}
	
	$scope.deleteTeam = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Delete team</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Are you sure you want to delete this team? '+
	        '</div>'+
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:red" ng-click="deleteTeam()" >' +
	        '      Delete' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
	      locals: {
	    	team: $scope.team,
	    	user: $scope.user,
	    	participateUser: $scope.participateUser
	      },
	      controller: exitTeamController
	   })
	};
});