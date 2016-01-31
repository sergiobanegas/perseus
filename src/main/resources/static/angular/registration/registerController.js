/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('registerController', function ($mdToast, $document, $scope, $window, serviceUser, $location, $route, $filter) {
	$scope.users=serviceUser.getUsers();
	$scope.user=serviceUser.getSession();
	$scope.register = function(newUser) {
		if ( $filter('filter')($scope.users, { name: newUser.name }).length==0 ){			
			newUser.privileges=0;
			serviceUser.newUser(newUser);	
			$window.location.href = '#/';
		}
		else{
			$scope.notification("An user with that name already exist");
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