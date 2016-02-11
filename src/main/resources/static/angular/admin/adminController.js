/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('adminController', function ($mdDialog, $mdMedia, $scope, $route, $routeParams, $window, serviceUser, serviceTeam) {
  
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.teams=serviceTeam.getTeams();	

	$scope.deleteUser = function(user, $event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/admin/dialogs/deleteUser.tmpl.html',
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
	      clickOutsideToClose: true,
	      templateUrl: 'angular/admin/dialogs/deleteTeam.tmpl.html',
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

	$scope.userDelete=user;
	$scope.teamDelete=team;
	$scope.deleteUser = function(){
		serviceUser.deleteUser(user);		
		$mdDialog.hide();
		$scope.notification("User "+user.name+" removed");
	};
	
	$scope.deleteTeam = function(){
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