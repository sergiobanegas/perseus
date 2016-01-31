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