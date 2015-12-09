/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('joinTeamController', function ($scope, $window, serviceUser, serviceTeam, serviceParticipate, $location, $filter, LxNotificationService) {

	$scope.user=serviceUser.getSession();
	$scope.teams=serviceTeam.getTeams();
	$scope.teams2=serviceParticipate.getParticipates();
	$scope.join = function(Team) {
		if ( $filter('filter')(serviceTeam.getTeams(), { name: Team.name, password: Team.password}).length!=0){	
			var TeamJoined= ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}))[0];
				if ( $filter('filter')(serviceParticipate.getParticipates(), { iduser: $scope.user.id, idteam: TeamJoined.id }).length==0 ){			
					var newParticipate={};
					newParticipate.iduser=$scope.user.id;
					newParticipate.idteam=TeamJoined.id;
					newParticipate.userName=$scope.user.name;
					newParticipate.teamName=Team.name;
					serviceParticipate.newParticipate(newParticipate);	
					$window.location.href = '#/';
					LxNotificationService.success("You succesfully joined "+TeamJoined.name+"!");	
				}
				else{
					LxNotificationService.error("You've already registered in that team!");
				}
		}
		else{
			LxNotificationService.error("The name of the team or the password of the team are incorrect!");
		}
	};
	$scope.exit = function(){
		$window.location.href = '#/';
	};
});