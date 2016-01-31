/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('newTeamController', function ($mdToast, $scope, $window, serviceNotification, serviceUser, serviceTeam, serviceParticipate, $location, $filter) {

	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.password="";
	
	$scope.newTeam = function(Team) {
		if ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}).length==0){			
				if (Team.password===$scope.password){
					serviceTeam.newTeam(Team);
					$window.location.href = '#/';
					serviceNotification.showNotification("Team created", "You succesfully created "+Team.name+"!");					
				}
				else{
					$scope.notification("The password doesn't match!");
				}				
		}
		else{
			$scope.notification("A team with that name already exists!");
		}
	};
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	  };

});