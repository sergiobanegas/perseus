/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('adminTeamController', function ($scope, $filter, $routeParams, $window, $mdDialog, serviceNotification, serviceTeam, serviceUser, serviceParticipate) {
	
	$scope.section="administration";
    $scope.team={};
	serviceTeam.getTeamHttp($routeParams.id).then(function (result){
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
		var members=$scope.members();
		for (var i=0; i<members.length;i++){
			if (members[i].user!=$scope.user.id){
				teamUsers.push($scope.findUserById(members[i].user));
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
		serviceParticipate.deleteParticipate(member);
		serviceNotification.showNotification("User kicked", "The user "+$scope.findUserById(member.user).name+" has been kicked from the team");					
	}	
	
	$("#leaveTeamButton").click(function(){
		$("#leaveTeam").toggle("blind");
	});
	
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
		$window.location.href = '#/';
		serviceNotification.showNotification("Goodbye", "You left the team");					
		
	}
	
	$scope.deleteTeam = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      templateUrl: 'angular/team/dialogs/deleteTeam.tmpl.html',
	      clickOutsideToClose:true,
	      locals: {
	    	team: $scope.team,
	    	user: $scope.user,
	    	participateUser: $scope.participateUser
	      },
	      controller: exitTeamController
	   })
	};
	
	$scope.newTeamName=$scope.team.name;
	
	$scope.newTeamPassword1=$scope.team.password;
	
	$scope.newTeamPassword2=$scope.team.password;
	
	$scope.updateTeam = function(){
		if ($scope.newTeamName!="" && $scope.newTeamPassword1!="" && $scope.newTeamPassword2!=""){
				if ($scope.newTeamPassword1==$scope.newTeamPassword2){
					$scope.team.name=$scope.newTeamName;
					$scope.team.password=$scope.newTeamPassword1;
					serviceTeam.updateTeam($scope.team);
				}else{
					//notification password no igual
				}
		}
	}
	
	//jQuery functions
	 $("#sidenavButton").click(function(){
		 if (!$('#sidenav').is(":visible")){
			 $("#sidenav").show('slide', {direction: 'left'}, 100);
		 }else{
			 $("#sidenav").hide('slide', {direction: 'left'}, 100);
		 }
	 })
	
	 $("#teamSettingsButton").click(function(){
		 $("#membersButton").removeClass("active");
		 $("#welcomePageButton").removeClass("active");
		 $("#filesButton").removeClass("active");
		 $("#members").hide();
		 $("#files").hide();
		 $("#welcomePage").hide();
		 $("#settings").show();
		 if (!$('#teamSettingsButton').hasClass("active")){
			 $("#teamSettingsButton").addClass("active");
		 }else{
			 $("#teamSettingsButton").removeClass("active");
		 }	
	 });
	 
	 $("#welcomePageButton").click(function(){
		 $("#membersButton").removeClass("active");
		 $("#teamSettingsButton").removeClass("active");
		 $("#filesButton").removeClass("active");
		 $("#members").hide();
		 $("#files").hide();
		 $("#settings").hide();
		 $("#welcomePage").show();
		 if (!$('#welcomePageButton').hasClass("active")){
			 $("#welcomePageButton").addClass("active");
		 }else{
			 $("#welcomePageButton").removeClass("active");
		 }	
	 });
	 
	 $("#membersButton").click(function(){
		 $("#welcomePageButton").removeClass("active");
		 $("#teamSettingsButton").removeClass("active");
		 $("#filesButton").removeClass("active");
		 $("#settings").hide();
		 $("#files").hide();
		 $("#welcomePage").hide();
		 $("#members").show();
		 if (!$('#membersButton').hasClass("active")){
			 $("#membersButton").addClass("active");
		 }else{
			 $("#membersButton").removeClass("active");
		 }	
	 });
	 
	 $("#filesButton").click(function(){
		 $("#membersButton").removeClass("active");
		 $("#welcomePageButton").removeClass("active");
		 $("#teamSettingsButton").removeClass("active");
		 $("#settings").hide();
		 $("#members").hide();
		 $("#welcomePage").hide();
		 $("#files").show();
		 if (!$('#filesButton').hasClass("active")){
			 $("#filesButton").addClass("active");
		 }else{
			 $("#filesButton").removeClass("active");
		 }	
	 });
	 
	 $("#changeImageButton").click(function(){
		 $("#changeImage").toggle("blind");
	 });
	 
	 $("#changeValuesButton").click(function(){
		 $("#changeValues").toggle("blind");
	 });
	
});