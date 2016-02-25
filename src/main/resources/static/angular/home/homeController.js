/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('homeController', function ($scope, $mdDialog, $route, $filter, webNotification, serviceNotification, serviceUser, serviceTeam, serviceParticipate, serviceTeamInvite) {
	
	$scope.user = serviceUser.getSession();
	$scope.teams= serviceParticipate.getParticipates();
	$scope.teamName="";		
	$scope.teamInvites=serviceTeamInvite.getTeamInvites();
			
	$scope.findTeamById = function(id){
		return serviceTeam.getTeam(id);
	}
	
	$scope.acceptInvitation = function(invite){
		serviceParticipate.newParticipate({user: invite.user, team: invite.team, teamPrivileges: 0});
		serviceTeamInvite.deleteTeamInvite(invite);
	}
	
	$scope.denyInvitation = function(invite){
		serviceTeamInvite.deleteTeamInvite(invite);
	}
	
	$scope.logout = function(){		
		serviceUser.logout();
		$route.reload();
	};
	
	$scope.login = function($event) {
	    var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/home/dialogs/login.tmpl.html',
	      locals: {
	      },
	      controller: DialogController
	   })
	};
	
	$scope.joinTeam = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/home/dialogs/joinTeam.tmpl.html',
	      locals: {
	      },
	      controller: DialogController
	   })
	};	
});
function DialogController($scope, $http, $mdDialog, $mdToast, $filter, $window, serviceNotification, serviceUser, serviceTeam, serviceParticipate, serviceRequestJoinTeam) {
	   $scope.user = serviceUser.getSession();
	   $scope.users = serviceUser.getUsers();
	   $scope.userName = "";
	   $scope.password = "";	
		
		$scope.login = function() {
			if ($scope.userName && $scope.password){
				var array= $filter('filter')($scope.users, { name: $scope.userName});
				if (array.length!=0 && array[0].password==$scope.password){
					$mdDialog.hide();
					serviceUser.loginUser(array[0]);
					$scope.user=serviceUser.getSession();
					$window.location.reload();
				}
				else{
					$scope.notification("The username or password are incorrect");	
				}
			}
			else{
					$scope.notification("Please fill both fields");	
			}
		};
		
		$scope.joinTeam = function(Team) {
			if ( $filter('filter')(serviceTeam.getTeams(), { name: Team.name, password: Team.password}).length!=0){	
				var TeamJoined= ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}))[0];
					if ( $filter('filter')(serviceParticipate.getParticipates(), { user: $scope.user.id, team: TeamJoined.id }).length==0 ){			
						serviceParticipate.newParticipate({team: TeamJoined.id, user: $scope.user.id, teamPrivileges: 0});	
						$mdDialog.hide();
						serviceNotification.showNotification("Joined!", "You succesfully joined the team!");	
					}
					else{
						$scope.notification("You've already registered in the team "+Team.name);
					}
			}
			else{
				$scope.notification("The name of the team or the password of the team are incorrect!");
			}
		};
		
		$scope.findUserById = function(iduser){
			return serviceUser.getUser(iduser);
		}
		
		$scope.teamJoinRequest = function(name){		
				var team={};
				for (var i=0;i<serviceTeam.getTeams().length;i++){
					if (serviceTeam.getTeams()[i].name==name){
						team=serviceTeam.getTeams()[i];
						break;
					}
				}
				if (team){
					if ($filter('filter')(serviceParticipate.getParticipates(), { user: $scope.user.id, team: team.id }).length==0 ){			
						if  ($filter('filter')(serviceRequestJoinTeam.getRequestJoinTeams(), { user: $scope.user.id, team: team.id}).length==0){							
							serviceRequestJoinTeam.newRequestJoinTeam({user:$scope.user.id, team: team.id});
							for (var i=0;i<serviceParticipate.getParticipates().length;i++){
								if (serviceParticipate.getParticipates()[i].team=team.id && serviceParticipate.getParticipates()[i].teamPrivileges>0){
										var data= {
												"user": $scope.user, 
												"team": team,
												"admin": $scope.findUserById(serviceParticipate.getParticipates()[i].user)
												};
										$http.post("/sendrequestjointeam", data);
								}
								$mdDialog.hide();
								serviceNotification.showNotification("Petition sent", "A petition was sent to the team "+team.name);
								return 0;
							}		
						}else{
							$scope.notification("You've already sent a request to enter "+team);
						}	
					}else{
						$scope.notification("You already are a member of the team "+teamObject.name);
					}	
			}else{
				$scope.notification("That team doesn't exists");
			}
		}
	   
	   $scope.goRegistration = function (){
		   $mdDialog.hide();
		   $window.location.href = '#/registration';  
	   };
	   
	   $scope.notification = function(text) {
		    $mdToast.show(
		      $mdToast.simple()
		        .textContent(text)
		        .position("bottom right")
		        .hideDelay(3000)
		    );
		};
	   
     $scope.closeDialog = function() {
       $mdDialog.hide();
     }
}