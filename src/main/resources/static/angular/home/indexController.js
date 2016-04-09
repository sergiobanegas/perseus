/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('indexController', function ($scope, $mdDialog, $mdToast, $route, $filter, $window, webNotification, serviceNotification, serviceUser, serviceTeam, serviceParticipate, serviceTeamInvite) {
	
	
	$scope.user = serviceUser.getSession();
	$scope.teams= serviceParticipate.getParticipates();
	$scope.teamName="";		
	$scope.teamInvites=serviceTeamInvite.getTeamInvites();
	
	$scope.getImage = function(data, imageType){
		return 'data:'+imageType+';base64, '+data;
	}
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};
	
	$scope.acceptInvitation = function(invite){
		serviceParticipate.newParticipate({userid: invite.user.id, teamid: invite.team.id, teamPrivileges: 0});
		serviceTeamInvite.deleteTeamInvite(invite);
		$scope.notification("Invitation accepted");
	}
	
	$scope.denyInvitation = function(invite){
		serviceTeamInvite.deleteTeamInvite(invite);
		$scope.notification("Invitation denied");
	}
	
	$scope.init = function(){
		if ($scope.user.id){
			$(".sections").hide();
		}else{
			$("#mainPage").show();
		}
		
	}
	
	$scope.redirectTeam = function(team){
		$window.location.href="#/team/"+team;
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
	
	$scope.newTeam = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose: true,
	      templateUrl: 'angular/home/dialogs/newTeam.tmpl.html',
	      locals: {
	      },
	      controller: DialogController
	   })
	};	
	
	//Midnight.js
	$(document).ready(function(){
	      // vh fix for iOS7 (Not that it works well on that anyway)
	      // Start Midnight!
	      $('nav.fixed').midnight();
	      // Start wow.js
	      new WOW().init();
	      // The island disappears when the logo moves on top of it
	      var $island = $('#space-island');
	      var islandTop = $island.offset().top;
	      var windowHeight = $(window).height();
	      $(window).resize(function(){
	        islandTop = $island.offset().top;
	        windowHeight = $(window).height();
	      });
	      $(document).scroll(function(){
	        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	        var minScrollTop = islandTop - windowHeight * 0.4;
	        var maxScrollTop = islandTop;
	        // Opacity goes from 1.0 at the bottom 2/3 of the screen to 0.4 at the top
	        if( scrollTop <= islandTop*2 ) {
	          var targetOpacity = 1.0;
	          var minOpacity = 0.4;
	          if( scrollTop > minScrollTop && scrollTop < maxScrollTop ) {
	            targetOpacity = ((maxScrollTop - scrollTop) / (maxScrollTop - minScrollTop)) * (1.0 - minOpacity) + minOpacity;
	          }
	          else if( scrollTop > maxScrollTop ) {
	            targetOpacity = minOpacity;
	          }
	          else if( scrollTop < minScrollTop ) {
	            targetOpacity = 1.0;
	          }
	          $island.css('opacity', targetOpacity);
	        }
	      });
	      $('.scroll-prompt').click(function(event){
	        event.preventDefault();
	        $('html, body').animate({
	          scrollTop: $("section.step-one").offset().top - $('nav').height() * 0.5
	        }, 1000, 'swing');
	      });
	      $(window).trigger('resize');
	});
	
	//to hide the fixed nav when clicked outside dialog

	
});

function DialogController($scope, $http, $mdDialog, $mdToast, $filter, $window, $route, serviceNotification, serviceUser, serviceTeam, serviceParticipate, serviceRequestJoinTeam) {
	   $scope.user = serviceUser.getSession();
	   $scope.users = serviceUser.getUsers();
	   $scope.userName = "";
	   $scope.password = "";	
	   $scope.passwordNewTeam="";
		
		$scope.login = function() {
			if ($scope.userName && $scope.password){
				var array= $filter('filter')($scope.users, { name: $scope.userName});
				if (array.length!=0 && array[0].password==$scope.password){
					$mdDialog.hide();
					serviceUser.loginUser(array[0]);
					$route.reload();
				}
				else{
					$scope.notification("The username or password are incorrect");	
				}
			}
			else{
					$scope.notification("Please fill both fields");	
			}
		};
		
		$scope.forgotPassword = function(){
			$("#loginForm").hide();
			$("#loginButton").hide();
			$("#forgotPassword").show();
			$("#forgotPasswordSendButton").show();
		}
		
		$scope.emailForget;
		$scope.sendForgetPassword = function(){
			var data= {
					"email": $scope.emailForget
					};
			$http.post("/sendnewpassword", data);
		}
		
		$scope.joinTeam = function(Team) {
			if ( $filter('filter')(serviceTeam.getTeams(), { name: Team.name, password: Team.password}).length!=0){	
				var TeamJoined= ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}))[0];
					if ( $filter('filter')(serviceParticipate.getParticipates(), { userid: $scope.user.id, teamid: TeamJoined.id }).length==0 ){			
						serviceParticipate.newParticipate({teamid: TeamJoined.id, userid: $scope.user.id, teamPrivileges: 0, notifications: false });	
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
		
		$scope.newTeam = function(Team) {
			if ($filter('filter')(serviceTeam.getTeams(), { name: Team.name}).length==0){			
					if (Team.password===$scope.password){
						Team.admin=$scope.user.id;
						serviceTeam.newTeam(Team);
						$window.location.href = '#/';
						$mdDialog.hide();
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
		
		$scope.teamJoinRequest = function(name){		
				var team={};
				for (var i=0;i<serviceTeam.getTeams().length;i++){
					if (serviceTeam.getTeams()[i].name==name){
						team=serviceTeam.getTeams()[i];
						break;
					}
				}
				if (team){
					if ($filter('filter')(serviceParticipate.getParticipates(), { userid: $scope.user.id, teamid: team.id }).length==0 ){			
						if  ($filter('filter')(serviceRequestJoinTeam.getRequestJoinTeams(), { userid: $scope.user.id, teamid: team.id}).length==0){							
							serviceRequestJoinTeam.newRequestJoinTeam({userid:$scope.user.id, teamid: team.id});
							for (var i=0;i<serviceParticipate.getParticipates().length;i++){
								if (serviceParticipate.getParticipates()[i].teamid=team.id && serviceParticipate.getParticipates()[i].teamPrivileges>0){
										var data= {
												"user": $scope.user, 
												"team": team,
												"admin": serviceParticipate.getParticipates()[i].user
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