/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('adminController', function ($http, $scope, $route, $routeParams, $window, serviceUser, serviceParticipate, serviceTeam, serviceRoom, serviceChatMessage, LxNotificationService, LxDialogService) {
  
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.teams=serviceTeam.getTeams();
	$scope.rooms=serviceRoom.getRooms();
	$scope.chatMessages=serviceChatMessage.getChatMessages();
	$scope.participates=serviceParticipate.getParticipates();
	
	
	$scope.userToDelete={};
	$scope.openDeleteUser = function(user){
		$scope.userToDelete=user;
		$scope.opendDialog('deleteUser');
	};
		
	$scope.deleteUser = function(){
		serviceUser.deleteUser($scope.userToDelete);
		for (var i=0;i<$scope.participates.length;i++){
			if ($scope.participates[i].iduser==$scope.userToDelete.id){
				serviceParticipate.deleteParticipate($scope.participates[i]);
			}
		}
		LxNotificationService.success("User"+$scope.userToDelete.name+" removed");
		$scope.userToDelete={};
	};
	
	
	$scope.teamToDelete={};
	$scope.openDeleteTeam = function(team){
		$scope.teamToDelete=team;
		$scope.opendDialog('deleteTeam');
	};
	
	$scope.deleteTeam = function(){
		for (var i = 0; i<$scope.rooms.length;i++){
			if ($scope.rooms[i].team == $scope.teamToDelete.id){
				serviceRoom.deleteRoom($scope.rooms[i]);
			}		
		}		
		for (var i = 0; i<$scope.chatMessages.length;i++){
			if ($scope.chatMessages[i].team == $scope.teamToDelete.id){
				serviceChatMessage.deleteChatMessage($scope.chatMessages[i]);
			}
		}				
		for (var i = 0; i<$scope.participates.length;i++){
			if ($scope.participates[i].idteam == $scope.teamToDelete.id){
				serviceParticipate.deleteParticipate($scope.participates[i]);
			}
		}
		serviceTeam.deleteTeam($scope.teamToDelete);
		LxNotificationService.success("Team"+$scope.teamToDelete.name+" deleted!");
		$scope.teamToDelete={};
	}
	
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
	};
	
	$scope.exit = function(){
		$window.location.href = '#/';
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		LxNotificationService.success("Goodbye!");
	};
});