/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('userController', function ($mdDialog, $mdToast, $scope, $route, $http, $routeParams, $window, serviceUser) {
  
	$scope.user=serviceUser.getSession();
	$scope.userProfile={};
	serviceUser.getUserHttp($routeParams.id).then(function (result){
		$scope.userProfile = result.data;
	});
	
	$scope.editName=0;
	$scope.editEmail=0;
	$scope.actualpassword;
	$scope.password1;
	$scope.password2;
	$scope.updateUser = function(){
		if ($scope.userProfile.password==$scope.currentPassword && $scope.password1==$scope.password2){
			$scope.userProfile.password=$scope.password1;
		}
		serviceUser.updateUser($scope.userProfile);
		serviceUser.logout();
		serviceUser.loginUser($scope.userProfile);
		$scope.editName=0;
		$scope.editEmail=0;
		$scope.notification("Your credentials have been updated");
		setTimeout(function(){
			$window.location.reload();
  	    }, 500);
	};
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
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
	 $scope.myImage='';
	 $scope.myCroppedImage='';
	 var handleFileSelect=function(evt) {
		 var file=evt.currentTarget.files[0];
		 var reader = new FileReader();
		 reader.onload = function (evt) {
			 $scope.$apply(function($scope){
				 $scope.myImage=evt.target.result;
			 });
		 };
		 reader.readAsDataURL(file);
	 };
	 angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
	    
	$scope.changeProfileImage = function(cropped){
		var croppedFormated=cropped.slice(5, cropped.length-1);
		var imagetype;
		var imageBase64;
		for (var i=0;i<croppedFormated.length;i++){
			if (croppedFormated.charAt(i)==';'){
				imagetype=croppedFormated.slice(0,i);
				imageBase64=croppedFormated.slice(i+8,croppedFormated.length-1);
				break;
			}
		}
		$scope.userProfile.image=imageBase64;
		$scope.userProfile.imageType=imagetype;
		serviceUser.updateUser($scope.userProfile);
	}

	$scope.getImage = function(data){
		return 'data:'+$scope.userProfile.imageType+';base64, '+data;
	}
	
	$scope.deleteAccount = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/user/dialogs/deleteAccount.tmpl.html',
	      locals: {
	        user: $scope.userProfile
	      },
	      controller: userActionsController
	   })
	}
	
	$("#editProfileLaunchButton").click(function(){
		$("#editProfile").toggle("blind");
		if ($("#editProfilePhotoLaunchButton").is(":hidden")){
			$("#editProfilePhotoLaunchButton").show();
		}else{
			$("#editProfilePhotoLaunchButton").hide();
		}		
	});
	
	$("#editProfileLaunchButton2").click(function(){
		$("#editProfile").toggle("blind");
		if ($("#editProfilePhotoLaunchButton2").is(":hidden")){
			$("#editProfilePhotoLaunchButton2").show();
		}else{
			$("#editProfilePhotoLaunchButton2").hide();
		}
	});
	
	$("#editProfilePhotoLaunchButton").click(function(){
		$("#userCredentials").toggle("blind");
		$("#editProfilePhoto").toggle("blind");
	});
	
	$("#editProfilePhotoLaunchButton2").click(function(){
		$("#userCredentials").toggle("blind");
		$("#editProfilePhoto").toggle("blind");
	});
	
	$("#homeButton").click(function(){
		  $window.location.href = '#/';
	});
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.reload();
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
	  
});

function userActionsController($scope, $mdDialog, $window, serviceNotification, serviceUser, user) {

	$scope.deleteAccount = function(){
		serviceUser.deleteUser(user);
		serviceUser.logout();
		$mdDialog.hide();
		$window.location.href = '#/';
		serviceNotification.showNotification("Goodbye "+user.name, "Come back soon!");
	};
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
}