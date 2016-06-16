/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('registerController', function ($mdToast, $scope, $window, $filter, $mdDialog, serviceNotification, serviceUser, serviceUnconfirmedUser) {
	$scope.user=serviceUser.getSession();
	if ($scope.user){
		$window.location.href = '#/';
	}
	$scope.password2="";
	$scope.register = function(newUnconfirmedUser) {
		if ( $filter('filter')(serviceUser.getUsers(), { name: newUnconfirmedUser.name }).length==0 ){			
			if ($scope.password2==newUnconfirmedUser.password){
				newUnconfirmedUser.confirmationCode=(Math.random() * 10000000 + 0);
				serviceUnconfirmedUser.newUnconfirmedUser(newUnconfirmedUser);
				serviceNotification.showNotification("Email validation needed", "Hello "+newUnconfirmedUser.name+", you have to confirm your email address in order to finish your registration, we've sent an email to you");
				$window.location.href = '#/';
			}else{
				$scope.notification("The passwords don't match");
			}
		}
		else{
			$scope.notification("An user with that name already exist");
		}
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

	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	  };
	  
	  $("#homeButton").click(function(){
		  $window.location.href = '#/';
	  })
});