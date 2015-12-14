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
	
	
	$scope.deleteUser = function(user){
		serviceUser.deleteUser(user);
		for (var i=0;i<$scope.participates.length;i++){
			if ($scope.participates[i].iduser==user.id){
				serviceParticipate.deleteParticipate($scope.participates[i]);
			}
		}
		LxNotificationService.success("User"+user.name+" removed");
	};
	
	
	$scope.deleteTeam = function(team){
		for (var i = 0; i<$scope.rooms.length;i++){
			if ($scope.rooms[i].team == team.id){
				serviceRoom.deleteRoom($scope.rooms[i]);
			}		
		}
		
		for (var i = 0; i<$scope.chatMessages.length;i++){
			if ($scope.chatMessages[i].team == team.id){
				serviceChatMessage.deleteChatMessage($scope.chatMessages[i]);
			}
		}				
		for (var i = 0; i<$scope.participates.length;i++){
			if ($scope.participates[i].idteam == team.id){
				serviceParticipate.deleteParticipate($scope.participates[i]);
			}
		}
		serviceTeam.deleteTeam(team);
		LxNotificationService.success("Team deleted!");
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