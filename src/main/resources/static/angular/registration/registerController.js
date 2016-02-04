/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('registerController', function ($mdToast, $scope, $window, $filter, serviceNotification, serviceUser, serviceUnconfirmedUser) {
	$scope.users=serviceUser.getUsers();
	$scope.user=serviceUser.getSession();
	$scope.register = function(newUnconfirmedUser) {
		if ( $filter('filter')($scope.users, { name: newUnconfirmedUser.name }).length==0 ){			
			newUnconfirmedUser.privileges=0;
			newUnconfirmedUser.confirmationCode=(Math.random() * 10000000 + 0);
			serviceUnconfirmedUser.newUnconfirmedUser(newUnconfirmedUser);
			serviceNotification.showNotification("Email validation needed", "Hello "+newUnconfirmedUser.name+", you have to confirm your email address in order to finish your registration, we've sent an email to you");
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