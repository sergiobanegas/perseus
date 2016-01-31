/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('userController', function ($mdDialog, $http, $scope, $route, $routeParams, $window, serviceUser) {
  
	$scope.user=serviceUser.getSession();
	$scope.userProfile={};
	$http.get('/users/'+$routeParams.id)
	  .then(function(result) {
	    $scope.userProfile = result.data;
	});
	$scope.editName=0;
	$scope.editEmail=0;
	
	$scope.updateUser = function(){
		serviceUser.updateUser($scope.userProfile);
		serviceUser.logout();
		serviceUser.loginUser($scope.userProfile);
		$scope.editName=0;
		$scope.editEmail=0;
		$route.reload();
	};
	
	$scope.showInput = function(option){
		switch (option){
			case "name":
				if($scope.editName==1){
					$scope.editName=0;
				}
				else{
					$scope.editName=1;
				}
				break;
			case "email":
				if($scope.editEmail==1){
					$scope.editEmail=0;
				}
				else{
					$scope.editEmail=1;
				}
				break;
		}
	};
	
	$scope.deleteAccount = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Delete account</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Are you sure you want to delete your account? '+
	        '</div>'+
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:red" ng-click="deleteAccount()" >' +
	        '      Delete' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
	      locals: {
	        user: $scope.userProfile
	      },
	      controller: userActionsController
	   })
	}
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
	};
	
	$scope.exit = function(){
		$window.location.href = '#/';
	}
});


function userActionsController($scope, $mdDialog, $mdToast, $window, serviceUser, serviceParticipate, serviceParticipateRoom, serviceRoomInvite, serviceRequestJoinRoom, serviceRequestJoinTeam, serviceChatMessage, servicePrivateMessage, user) {

	$scope.deleteAccount = function(){
		serviceUser.deleteUser(user);
		serviceUser.logout();
		$mdDialog.hide();
		$window.location.href = '#/';
	    $scope.notification("Come back soon!");
	};
	
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