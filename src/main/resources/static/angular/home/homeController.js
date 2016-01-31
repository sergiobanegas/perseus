/*
 * @author Micael Gallego (micael.gallego@gmail.com)
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('homeController', function (webNotification, $mdDialog, $mdToast, $mdMedia, $scope, $http, $resource, $window, serviceUser, serviceTeam, serviceParticipate, $location, $route, $filter, serviceRequestJoinRoom) {

	Notification.requestPermission();
	
	$scope.notification= function(){
		webNotification.showNotification('Example Perseus Notification', {
            body: 'Notification Text...',
            icon: '../bower_components/HTML5-Desktop-Notifications/alert.ico',
            onClick: function onNotificationClicked() {
                window.alert('Notification clicked.');
            },
            autoClose: 4000 //auto close the notification after 2 seconds (you manually close it via hide function)
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                    console.log('Hiding notification....');
                    hide(); //manually close the notification (or let the autoClose close it)
                }, 5000);
            }
        });
	}

	$scope.borrar=serviceRequestJoinRoom.getRequestJoinRooms();
	
	$scope.user = serviceUser.getSession();
	$scope.users = serviceUser.getUsers();
	$scope.teams= serviceParticipate.getParticipates();
	$scope.primerUser=serviceUser.getUser(1);
	$scope.teamsUser=[];	
	$scope.teamName="";		
	
	$scope.fileUpload;
	
	$scope.findTeamById = function(idteam){
		for (var i=0; i< serviceTeam.getTeams().length;i++){
			if (serviceTeam.getTeams()[i].id==idteam){
				return serviceTeam.getTeams()[i];
				break;
			}
		}
	}
	
	$scope.logout = function(){		
		serviceUser.logout();
		user={};
		$route.reload();
	};
	
	$scope.exit = function(){
		$window.location.href = '#/';
	};
	
	$scope.login = function($event) {
	    var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	         ' <h2>Login</h2>'+
	          '<span flex></span>'+
	          '<md-button class="md-icon-button" ng-click="cancel()">'+
	           ' <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        '<div layout="column" ng-cloak class="md-inline-form">'+
	        '<md-input-container class="md-icon-float md-block">'+
	        '<label>Username</label>'+
	        '<md-icon aria-label="Name" class="material-icons" style="color: blue;">person</md-icon>'+
	        '<input ng-model="userName">'+
	        '</md-input-container>'+
	        '<md-input-container>'+
	        '<label>Password</label>'+
	        '<md-icon aria-label="vpn_key" class="material-icons" style="color: blue;">vpn_key</md-icon>'+
	        '<input type="password" ng-model="password">'+
	        '</md-input-container>'+
	        '<div>'+
	        'Are you new?'+
	        '<md-button style="background-color:purple" ng-click="goRegistration()">Register</md-button>'+
	        '</div>'+
	        '</div>'+
	        '</div>'+
	        '  </md-dialog-content>' +
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:greenyellow" ng-click="login()" >' +
	        '      Login' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
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
	      template:
	        '<md-dialog aria-label="List dialog" style="height:100%;width:100%"ng-cloak>' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Join a team</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Join a team</br>'+
	        'Insert the name of the team and the password admins: {{admins}}'+
	        '<div>'+
	        '<md-input-container>'+
	        '<label>Team name</label>'+
	        '<input ng-model="team.name">'+
	        '</md-input-container>'+
	      	'<md-input-container>'+
	      	'<label>Password</label>'+
	      	'<input ng-model="team.password" type="password">'+
	      	'</md-input-container>'+
	        '<md-button class="md-primary" ng-click="joinTeam(team)">'+
	        'Join'+
	        '</md-button>'+
	        '</div>'+
	        "If you don't know the team password, you can send a petition to the team:"+
	        '<div>'+
	        '<md-input-container>'+
	        '<label>Team name</label>'+
	        '<input ng-model="teamRequested">'+
	        '</md-input-container>'+
	      	'<md-input-container>'+
	      	'<md-button class="md-primary" ng-click="teamJoinRequest(teamRequested)">'+
	        'Send petition'+
	        '</md-button>'+
	      	'</div>'+
	        '</div>'+
	        '</md-dialog>',
	      locals: {
	      },
	      controller: DialogController
	   })
	};
	
});
function DialogController($scope, $http, $mdDialog, $mdToast, $filter, $window, serviceUser, serviceTeam, serviceParticipate, serviceRequestJoinTeam) {
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
						var newParticipate={};
						newParticipate.team=TeamJoined.id;
						newParticipate.user=$scope.user.id;
						newParticipate.teamPrivileges=0;
						serviceParticipate.newParticipate(newParticipate);	
						$mdDialog.hide();
						$scope.notification("You succesfully joined the team!");	
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
							var newRequest={};
							newRequest.user=$scope.user.id;
							newRequest.team=team.id;
							serviceRequestJoinTeam.newRequestJoinTeam(newRequest);
//							var admins=serviceParticipate.getModerators(team.name);
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
								$scope.notification("A petition was sent to the team "+team.name);
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