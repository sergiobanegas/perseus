/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('teamController', function ($filter, $mdDialog, $mdToast, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, $timeout, $mdSidenav, serviceUser, servicePrivateMessage, serviceRoom, serviceTeam, serviceRoomInvite, serviceParticipate, serviceKurentoRoom, serviceChatMessage, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom) {
	//Kurento client config
	$http.get('/getClientConfig').
	    success(function (data, status, headers, config) {
	   	console.log(JSON.stringify(data));
	   	$scope.clientConfig = data;
	    }).
	    error(function (data, status, headers, config) {	 
    });
	//global variables
	$scope.user=serviceUser.getSession();
	
	$scope.team={};
    $http.get('/teams/'+$routeParams.id)
	  .then(function(result) {
	    $scope.team = result.data;
	    $("#chatscroll").delay(300).scrollTop($("#chatscroll")[0].scrollHeight);
	});
    $scope.member=false;
    $http.get('/participates/'+$routeParams.id+'/'+$scope.user.id)
	  .then(function(result) {
		  if (result.data.length>0){
			  $scope.member = true;
		  }	   
	});   
    $scope.participatesHttp=[];
	$scope.participateUser={};
	$http.get('/participates')
	  .then(function(result) {
	    $scope.participatesHttp = result.data;
	    for (var i=0;i<$scope.participatesHttp.length;i++){
	    	if ($scope.participatesHttp[i].user==$scope.user.id && $scope.participatesHttp[i].team==$scope.team.id){
	    		$scope.participateUser=$scope.participatesHttp[i];
	    	}
	    }
	});
	$scope.rooms= function(){
		var roomsTeam=$filter('filter')(serviceRoom.getRooms(), { team: $scope.team.id});
		var publicRooms=[];
		var privateRooms=[];
		for (var i=0;i< roomsTeam.length;i++){
			if (roomsTeam[i].privateRoom==0){
				publicRooms.push(roomsTeam[i]);
			}
			else{
				privateRooms.push(roomsTeam[i]);
			}
		}
		return publicRooms.concat(privateRooms);
	}
	
	$scope.chatMessages = serviceChatMessage.getChatMessages();   
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
	}
	//Screens
	$scope.screen="chat";
	$scope.showScreen = function (screen){
		$scope.screen=screen;
	}
	$scope.userReceiver={};
	$scope.showUserMessages = function(user){
		$scope.userReceiver=user;
		$scope.screen="privateUserMessages";
	}
		
    $scope.receiver;
	$scope.querySearch = function (query) {
		return $filter('filter')($scope.teamUsersWithoutUser(), { name: query});
	}
	
	//end screens
	//auxiliar search functions
	$scope.teamUsersWithoutUser = function(){
		return $filter('filter')($scope.teamUsers(), { id: '!'+$scope.user.id}); 
	};
	
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(iduser);
	}
	
	$scope.findTeamById = function(idteam){
		return serviceTeam.getTeam(idteam);
	}
	//end auxiliar search functions
	//chat message
	$scope.chatMessage;
	$scope.sendMessage = function () {   	
  		serviceChatMessage.newChatMessage({room: 0, team: $scope.team.id, text: $scope.chatMessage, user: $scope.user.id, userName: $scope.user.name});
  		$scope.chatMessage="";
  		setTimeout(function(){
  			$("#chatscroll").scrollTop($("#chatscroll")[0].scrollHeight);
  	    }, 500);
	};
	
	$scope.options = {
            'linkTarget': '_blank',
            'basicVideo': false,
            'code'      : {
                'highlight'  : true,
                'lineNumbers': true
            },
            'video'     : {
                'embed'    : true,
                'width'    : 800,
                'ytTheme'  : 'light',
                'details'  : true,
                'ytAuthKey': 'AIzaSyAQONTdSSaKwqB1X8i6dHgn9r_PtusDhq0'
            },
            'image'     : {
                'embed': true
            }
     };
	//end chat message
	//private messages
	$scope.teamUsers = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team==$scope.team.id){
				teamUsers.push($scope.findUserById(serviceParticipate.getParticipates()[i].user));
			}
		}
		return teamUsers;
	};
	
	$scope.privateMessages= function(){
		return $filter('filter')(servicePrivateMessage.getPrivateMessages(), { team: $scope.team.id}); 
	}
	
	$scope.filterMessages = function(message){
	    return ((message.transmitter == $scope.user.id && message.receiver==$scope.userReceiver)|| (message.receiver == $scope.user.id && message.transmitter==$scope.userReceiver));
	};
	
	$scope.filterMessagesContacts = function(){
		var array=[];
		var object;
		var object2;
		var object3;
		var messages=$scope.privateMessages();
		for (var i=0;i<messages.length;i++){
			object={};
			object2={};
			if (messages[i].transmitter==$scope.user.id){
				if (array.indexOf(messages[i].receiver)==-1){
					array.push(messages[i].receiver);
				}	
			}
			if(messages[i].receiver==$scope.user.id){
				if (array.indexOf(messages[i].transmitter)==-1){
					array.push(messages[i].transmitter);
				}	
			}
		}
		return array;
	}
		
	$scope.privateMessage='';
	$scope.newPrivateMessage = function(){
		if ($scope.privateMessage!='' && $scope.receiver.id){
			servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.receiver.id, team: $routeParams.id, text: $scope.privateMessage});
		}
	}
	$scope.replyText="";
	$scope.replyMessage = function(message){
		servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.userReceiver, team: $routeParams.id, text: message});
		$scope.replyText="";
	}
	//end private messages
	//sidenavs	
	$scope.showNotifications = function(sidenav){
		return $mdSidenav(sidenav).toggle();
	}
	 
	$scope.isNotificationsOpened = function(sidenav){
		return $mdSidenav(sidenav).isOpen();
	};
 
	$scope.close = function (sidenav) {
		$mdSidenav(sidenav).close();
	};
	
    $scope.roomInvitations = function(){
    	return $filter('filter')(serviceRoomInvite.getRoomInvites(), { user: $scope.user.id});
    }
    
    $scope.acceptRoomInvitation = function(invitation){
    	serviceParticipateRoom.newParticipateRoom({room: invitation.room, user: invitation.user, team: $scope.team.id, roomPrivileges: 0});
    	serviceRoomInvite.deleteRoomInvite(invitation);
    	$scope.notification("Room invitation accepted");
    }
    
    $scope.denyRoomInvitation = function(invitation){
    	serviceRoomInvite.deleteRoomInvite(invitation);
    	$scope.notification("Room invitation canceled");
    }
	
    $scope.requests = function(){ 	
    	return $filter('filter')(serviceRequestJoinTeam.getRequestJoinTeams(), { team: $scope.team.id});
    }
    
    $scope.roomRequests = function(){
    	return serviceRequestJoinRoom.getRequestJoinRooms();
    }
    
    $scope.acceptRequest = function(request){
    	var user=$scope.findUserById(request.user);
    	var team=$scope.findTeamById(request.team);  	    	
    	serviceParticipate.newParticipate({user: request.user, team: request.team, teamPrivileges: 0});
    	serviceRequestJoinTeam.deleteRequestJoinTeam(request);
    	$scope.notification("Request accepted");
    	var response=1;
    	var data= {
				"user" : user, 
				"team" : team,	
				"response" : 1
				};
		$http.post("/senduserjoined", data);
    }
    $scope.denyRequest = function(request){
    	var user=$scope.findUserById(request.user);
    	var team=$scope.findTeamById(request.team);
    	serviceRequestJoinTeam.deleteRequestJoinTeam(request);
    	$scope.notification("Request denied");
    	var response=0;
    	var data= {
				"user" : user, 
				"team" : team,
				"response" : 0
				};
		$http.post("/senduserjoined", data);
    }
    
    $scope.acceptRoomRequest = function(request){
    	serviceParticipateRoom.newParticipateRoom({user: request.user, room: request.room, team: $scope.team.id, roomPrivileges: 0});
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request accepted");
    }
    
    $scope.denyRoomRequest = function(request){
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request denied");
    }
    //end sidenav	
	$scope.invitePeople = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      templateUrl: 'angular/team/dialogs/inviteToTeam.tmpl.html',
	      clickOutsideToClose:true,
	      parent: angular.element(document.body),
	      locals: {
	    	team: $scope.team,
	    	user: $scope.user
	      },
	      controller: invitePeopleController
	   })
	};

	$scope.leaveTeam = function($event){
			var parentEl = angular.element(document.body);
		    $mdDialog.show({
		      parent: parentEl,
		      targetEvent: $event,
		      templateUrl: 'angular/team/dialogs/leaveTeam.tmpl.html',
		      clickOutsideToClose:true,
		      locals: {
		    	team: $scope.team,
		    	user: $scope.user,
		    	participateUser: $scope.participateUser
		      },
		      controller: exitTeamController
		   })
	};
	
	$scope.newRoom = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose:true,
	      templateUrl: 'angular/team/dialogs/newRoom.tmpl.html',
	      locals: {
	        room: {},
	        user: $scope.user,
	        team: $scope.team,
	        participateUser: $scope.participateUser
	        
	      },
	      controller: roomController
	   })
	};
		
	$scope.deleteRoom = function(room, $event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      clickOutsideToClose:true,
	      templateUrl: 'angular/team/dialogs/deleteRoom.tmpl.html',
	      locals: {
	        room: room,
	        user: $scope.user,
	        team: $scope.team,
	        participateUser: $scope.participateUser
	      },
	      controller: roomController
	   })
	};
	$scope.roomId='';
	$scope.register = function (room, $event) {
		var participate=1;
		if (room.privateRoom==1){
			participate=0;
			for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
				if (serviceParticipateRoom.getParticipateRooms()[i].room==room.id && serviceParticipateRoom.getParticipateRooms()[i].user==$scope.user.id){
					participate=1;
					break;
				}
			}		
		}
		if ($scope.participateUser.teamPrivileges>0 || $scope.user.privileges>0){
			participate=1;
		}
		if (participate==0){		
			var parentEl = angular.element(document.body);
		    $mdDialog.show({
		      parent: parentEl,
		      targetEvent: $event,
		      clickOutsideToClose:true,
		      templateUrl: 'angular/team/dialogs/privateRoom.tmpl.html',
		      locals: {
		        room: room,
		        user: $scope.user,
		        team: $scope.team,
		        participateUser: $scope.participateUser
		      },
		      controller: roomController
		   })
		}else{
			
		$scope.roomName = room.name;
		$scope.roomId=room.id;
		$scope.roomCreator=room.creator;
		var wsUri = 'wss://' + location.host + '/room';
		//show loopback stream from server
		var displayPublished = $scope.clientConfig.loopbackRemote || false;
		//also show local stream when display my remote
		var mirrorLocal = $scope.clientConfig.loopbackAndLocal || false;
		
		var kurento = KurentoRoom(wsUri, function (error, kurento) {
		
		    if (error)
		        return console.log(error);
		
		    //TODO token should be generated by the server or a 3rd-party component  
		    //kurento.setRpcParams({token : "securityToken"});
		    
		    room = kurento.Room({
		        room: $scope.roomName,
		        user: $scope.user.name
		    });
		
		    var localStream = kurento.Stream(room, {
		        audio: true,
		        video: true,
		        data: true
		    });
		
		    localStream.addEventListener("access-accepted", function () {
		        room.addEventListener("room-connected", function (roomEvent) {
		        	var streams = roomEvent.streams;
		        	if (displayPublished ) {
		        		localStream.subscribeToMyRemote();
		        	}
		        	localStream.publish();
		            serviceKurentoRoom.setLocalStream(localStream.getWebRtcPeer());
		            for (var i = 0; i < streams.length; i++) {
		                ServiceParticipant.addParticipant(streams[i]);
		            }
		        });
		
		        room.addEventListener("stream-published", function (streamEvent) {
		        	 ServiceParticipant.addLocalParticipant(localStream);
		        	 if (mirrorLocal && localStream.displayMyRemote()) {
		        		 var localVideo = kurento.Stream(room, {
		                     video: true,
		                     id: "localStream"
		                 });
		        		 localVideo.mirrorLocalStream(localStream.getWrStream());
		        		 ServiceParticipant.addLocalMirror(localVideo);
		        	 }
		        });
		        
		        room.addEventListener("stream-added", function (streamEvent) {
		            ServiceParticipant.addParticipant(streamEvent.stream);
		        });
		
		        room.addEventListener("stream-removed", function (streamEvent) {
		            ServiceParticipant.removeParticipantByStream(streamEvent.stream);
		        });
		
		        room.addEventListener("newMessage", function (msg) {
		            ServiceParticipant.showMessage(msg.room, msg.user, msg.message);
		        });
		
		        room.addEventListener("error-room", function (error) {
		            ServiceParticipant.showError($window, LxNotificationService, error);
		        });
		
		        room.addEventListener("error-media", function (msg) {
		            ServiceParticipant.alertMediaError($window, LxNotificationService, msg.error, function (answer) {
//		            	console.warn("Leave room because of error: " + answer);
//		            	if (answer) {
//		            		kurento.close(true);
//		            	}
		            });
		        });
		        
		        room.addEventListener("room-closed", function (msg) {
		        	if (msg.room !== $scope.roomName) {
		        		console.error("Closed room name doesn't match this room's name", 
		        				msg.room, $scope.roomName);
		        	} else {
		        		kurento.close(true);
		        		ServiceParticipant.forceClose($window, LxNotificationService, 'Room '
		        			+ msg.room + ' has been forcibly closed from server');
		        	}
		        });
		        
		        room.connect();
		    });
		
		    localStream.addEventListener("access-denied", function () {
		    	ServiceParticipant.showError($window, LxNotificationService, {
		    		error : {
		    			message : "Access not granted to camera and microphone"
		    				}
		    	});
		    });
		    localStream.init();
		});
		
		//save kurento & roomName & userName in service
		serviceKurentoRoom.setKurento(kurento);
		serviceKurentoRoom.setRoomName($scope.roomName);
		serviceKurentoRoom.setRoomId($scope.roomId);
		serviceKurentoRoom.setCreator($scope.roomCreator);
		serviceKurentoRoom.setUserName($scope.user.name);
		serviceKurentoRoom.setTeam($scope.team.id);
		$window.location.href = '#/call';
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

function roomController($scope, $http, $mdDialog, $mdToast, $window, serviceNotification, serviceRoom, serviceRequestJoinRoom, room, user, team, participateUser) {
	
	$scope.userRequestRoom={};
	$http.get('/requestjoinrooms/'+room.id+'/'+user.id)
	  .then(function(result) {
	    $scope.userRequestRoom = result.data[0];
	});
	
	$scope.participateUser=participateUser;
	$scope.roomInput;
	$scope.newRoom = function(){
		$scope.roomInput.team=team.id;
		$scope.roomInput.creator=user.id;
		if ($scope.roomInput.privateRoom){
			$scope.roomInput.privateRoom=1;
		}
		else{
			$scope.roomInput.privateRoom=0;
		}
		serviceRoom.newRoom($scope.roomInput);
		$mdDialog.hide();
		serviceNotification.showNotification("Room created!", "The room "+$scope.roomInput.name+" has been created");
	};
	
	$scope.deleteRoom = function(){	   
		serviceRoom.deleteRoom(room);
		serviceNotification.showNotification("Room deleted", "The room "+room.name+" has been deleted");		
		$mdDialog.hide();
	};
		
	$scope.roomRequest = function(){
		if ($scope.userRequestRoom){				
			$scope.notification("You already sent a request to the room "+room.name);
		}else{
			serviceRequestJoinRoom.newRequestJoinRoom({user: user.id, room: room.id, team: team.id});
			$mdDialog.hide();
			serviceNotification.showNotification("Request sent", "The request to join the room "+room.name+" has been sent");				
		}
	}
	   
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

function exitTeamController($scope, $http, $filter, $mdDialog, $window, serviceNotification, serviceParticipate, serviceTeam, serviceUser, team, user, participateUser) {

	$scope.participatesTeam=[];
	$http.get('/participates/'+team.id+'/members')
	  .then(function(result) {
	    $scope.participatesTeam = result.data[0];
	});
	
	$scope.participateUser=participateUser;
	$scope.team=team;
	$scope.newAdmin='';
	$scope.participates= function(){
		var participates = $filter('filter')(serviceParticipate.getParticipates(), { team: team.id});
		return participates;
	}
	
	$scope.goAdminPanel = function(){
		$mdDialog.hide();
		$window.location.href = '#/team/'+$scope.team.id+"/admin";
	}
	
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(id);
	}  
	
	$scope.receiver;
	$scope.querySearch = function (query) {
		return $filter('filter')($scope.participatesTeam, { name: query});
	}
	
	$scope.leaveTeam = function(){
		serviceParticipate.deleteParticipate($scope.participateUser);
		$mdDialog.hide();
		$window.location.href = '#/';
		serviceNotification.showNotification("Goodbye", "You left the team");
		$route.reload();
	};
		
	$scope.deleteTeam = function(){
		serviceTeam.deleteTeam(team);
		$mdDialog.hide();
		$window.location.href = '#/';
		serviceNotification.showNotification("Deleted", "The team "+team.name+" has been deleted");
	}
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}

}
function invitePeopleController($scope, $http, $mdDialog, serviceNotification, $window, team, user) {
	
	$scope.email="";
	$scope.sendInvitation = function(){
		if ($scope.email==""){
			$scope.notification("Please enter a email");
		}else{
			var data= {
					"email":$scope.email, 
					"team": team
					};
			$http.post("/sendinvitation", data);
			serviceNotification.showNotification("Invitation sent", "The invitation has been sent to "+$scope.email);
			$scope.email="";
		}
	}
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
}