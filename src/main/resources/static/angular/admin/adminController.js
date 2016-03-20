/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('adminController', function ($scope, $mdDialog, $window, serviceUser, serviceTeam) {
  
	$scope.section="administration";
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.teams=serviceTeam.getTeams();	

	$scope.getImage = function(data, imagetype){
		return 'data:'+imagetype+';base64, '+data;
	}
	
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
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		LxNotificationService.success("Goodbye!");
	};
	
	
	 $("#sidenavButton").click(function(){
		 if (!$('#sidenav').is(":visible")){
			 $("#sidenav").show('slide', {direction: 'left'}, 100);
		 }else{
			 $("#sidenav").hide('slide', {direction: 'left'}, 100);
		 }
	 });
	
	 $("#welcomePageButton").click(function(){
		 $("#usersButton").removeClass("active");
		 $("#teamsButton").removeClass("active");
		 $("#settings").hide();
		 $("#users").hide();
		 $("#hide").show();
		 $("#teams").hide();
		 $("#welcomePage").show();
		 if (!$('#welcomePageButton').hasClass("active")){
			 $("#welcomePageButton").addClass("active");
		 }else{
			 if ($("#welcomePage").is(":hidden")){
			 	$("#welcomePageButton").removeClass("active");
			 }
		 }	
	 });
	 
	 $("#usersButton").click(function(){
		 $("#welcomePageButton").removeClass("active");
		 $("#teamsButton").removeClass("active");
		 $("#settings").hide();
		 $("#welcomePage").hide();
		 $("#teams").hide();
		 $("#users").show();
		 if (!$('#usersButton').hasClass("active")){
			 $("#usersButton").addClass("active");
		 }else{
			 if ($("#users").is(":hidden")){
			 	$("#usersButton").removeClass("active");
			 }
		 }	
	 });
	 
	 $("#teamsButton").click(function(){
		 $("#welcomePageButton").removeClass("active");
		 $("#usersButton").removeClass("active");
		 $("#settings").hide();
		 $("#welcomePage").hide();
		 $("#users").hide();
		 $("#teams").show();
		 if (!$('#teamsButton').hasClass("active")){
			 $("#teamsButton").addClass("active");
		 }else{
			 if ($("#teams").is(":hidden")){
			 	$("#teamsButton").removeClass("active");
			 }
		 }	
	 });
	 
	
});
function adminActionsController($scope, $mdDialog, $mdToast, $window, serviceUser, serviceTeam, user, team) {

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