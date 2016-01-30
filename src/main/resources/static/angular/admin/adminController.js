/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('adminController', function ($mdDialog, $mdMedia, $scope, $route, $routeParams, $window, serviceUser, serviceTeam) {
  
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.teams=serviceTeam.getTeams();	

	$scope.deleteUser = function(user, $event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Delete user</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Are you sure you want to delete the user <b>'+user.name+'</b>?'+
	        '</div>'+
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:red" ng-click="deleteUser()" >' +
	        '      Delete' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
	      locals: {
	        user: user,
	        team: {}
	      },
	      controller: adminActionsController
	   })
	}
	
	$scope.deleteTeam = function(team, $event){
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
	        'Are you sure you want to delete the team <b>'+team.name+'</b>?'+
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
	        user: {},
	        team: team
	      },
	      controller: adminActionsController
	   })
	}
		
	$scope.exit = function(){
		$window.location.href = '#/';
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		LxNotificationService.success("Goodbye!");
	};
});
function adminActionsController($scope, $mdDialog, $mdToast, serviceUser, serviceRoom, $window, serviceChatMessage, serviceParticipate, serviceRoom, serviceTeam, serviceRoomInvite, serviceRequestJoinRoom, serviceRequestJoinTeam, serviceParticipateRoom, user, team) {

	$scope.deleteUser = function(){
		serviceUser.deleteUser(user);
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].iduser==user.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
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
				serviceRequestJoinTeam.deleteRequestJoinRoom(serviceRequestJoinTeam.getRequestJoinTeams()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user==user.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
			}
		}
		$mdDialog.hide();
		$scope.notification("User "+user.name+" removed");
	};
	
	$scope.deleteTeam = function(){
		for (var i = 0; i<serviceRoom.getRooms().length;i++){
			if (serviceRoom.getRooms()[i].team == team.id){
				serviceRoom.deleteRoom(serviceRoom.getRooms()[i]);
			}		
		}		
		for (var i = 0; i<serviceChatMessage.getChatMessages().length;i++){
			if (serviceChatMessage.getChatMessages()[i].team == team.id){
				serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
			}
		}				
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].idteam == team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
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
		serviceTeam.deleteTeam(team);
		$mdDialog.hide();
		$scope.notification("Team "+team.name+" deleted");
	}	
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};
	
}