/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('teamController', function ($filter, $mdDialog, $mdMedia, $mdToast, $rootScope, $location, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, $timeout, $mdSidenav, $log, serviceUser, servicePrivateMessage, serviceRoom, serviceTeam, serviceRoomInvite, serviceParticipate, serviceKurentoRoom, serviceChatMessage, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom) {
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
	//Screens
	$scope.screen="chat";
	$scope.showMainScreen = function(){
		$scope.screen="chat";
	}
	
	$scope.showPrivateMessages = function(){
		$scope.screen="privateMessages";
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
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(iduser);
	}
	
	$scope.findTeamById = function(idteam){
		return serviceTeam.getTeam(idteam);
	}
	
	$scope.userMembership = function(){
		var participates=0;
		if ($scope.user.name){
			for (var i=0;i<serviceParticipate.getParticipates().length; i++){
				if ((serviceParticipate.getParticipates()[i].user==$scope.user.id)&&(serviceParticipate.getParticipates()[i].team==$routeParams.id)){
					participates=1;
				}
			}
		}
		return participates;
	};
	//end auxiliar search functions
	//chat message
	$scope.chatMessage;
	$scope.sendMessage = function () {   	
		var message = {};
  		message.room=0;
  		message.team=$scope.team.id;
  		message.text=$scope.chatMessage;
  		message.user=serviceUser.getSession().id;
  		$scope.chatMessage="";
  		var currentSize=$scope.chatMessages.length;
  		serviceChatMessage.newChatMessage(message);
  		setTimeout(function(){
  			$("#chatscroll").scrollTop($("#chatscroll")[0].scrollHeight);
  	    }, 500);
	};
	function sleepFor( sleepDuration ){
	    var now = new Date().getTime();
	    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
	}
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
	
	$scope.teamUsersWithoutUser = function(){
		return $filter('filter')($scope.teamUsers(), { id: '!'+$scope.user.id}); 
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
		if ($scope.privateMessage=='' && !$scope.receiver.id){
			
		}else{
			var privateMessage={};
			privateMessage.transmitter=$scope.user.id;		
			privateMessage.receiver=$scope.receiver.id;
			privateMessage.team=$routeParams.id;
			privateMessage.text=$scope.privateMessage;
			servicePrivateMessage.newPrivateMessage(privateMessage);
		}
	}
	
	$scope.replyMessage = function(message){
		var privateMessage={};
		privateMessage.transmitter=$scope.user.id;		
		privateMessage.receiver=$scope.userReceiver;
		privateMessage.team=$routeParams.id;
		privateMessage.text=message;
		servicePrivateMessage.newPrivateMessage(privateMessage);
	}
	//end private messages

	//sidenavs
	
	$scope.isOpen = false;
    $scope.demo = {
      isOpen: false,
      count: 0
    };
	
	 $scope.showNotifications = function(sidenav){
 		return $mdSidenav(sidenav).toggle();
	 }
	 
	 $scope.isNotificationsOpened = function(sidenav){
	   return $mdSidenav(sidenav).isOpen();
	 };
 
	$scope.close = function (sidenav) {
	      $mdSidenav(sidenav).close()
	        .then(function () {
	          $log.debug("close RIGHT is done");
	        });
	 };
	
    $scope.roomInvitations = function(){
    	return $filter('filter')(serviceRoomInvite.getRoomInvites(), { user: $scope.user.id});
    }
    
    $scope.acceptRoomInvitation = function(invitation){
    	var participate={};
    	participate.room=invitation.room;
    	participate.user=invitation.user;
    	participate.team=$scope.team.id;
    	participate.roomPrivileges=0;
    	serviceParticipateRoom.newParticipateRoom(participate);
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
    	var newParticipate={};
    	var user=$scope.findUserById(request.user);
    	var team=$scope.findTeamById(request.team);
    	newParticipate.user=request.user;
    	newParticipate.team=request.team;
    	newParticipate.teamPrivileges=0;    	    	
    	serviceParticipate.newParticipate(newParticipate);
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
    	var newParticipate={};
    	newParticipate.user=request.user;
    	newParticipate.room=request.room;
    	newParticipate.team=$scope.team.id;
    	newParticipate.roomPrivileges=0;
    	serviceParticipateRoom.newParticipateRoom(newParticipate);
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request accepted");
    }
    
    $scope.denyRoomRequest = function(request){
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request denied");
    }
    
    $scope.tooltip = {
    	showTooltip : false,
    	tipDirection : 'right'
    };
    $scope.$watch('tooltip.tipDirection',function(val) {
    	if (val && val.length ) {
    		$scope.tooltip.showTooltip = true;
    	}
    });
    
    //end sidenav	
	$scope.invitePeople = function($event){
		$scope.tooltip.showTooltip=false;
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" style="height:100%;width:100%"ng-cloak>' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Invite people</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Invite people! '+
	        '<div>'+
	        '<md-input-container>'+
	        '<md-icon class="material-icons">email</md-icon>'+
	        '<input ng-model="email" type="email" placeholder="User email">'+
	        '</md-input-container>'+
	        '<md-button class="md-primary" ng-click="sendInvitation(email)">'+
	        'Enviar'+
	        '</md-button>'+
	        '</div>'+
	        '</div>'+
	        '</md-dialog>',
	      locals: {
	    	team: $scope.team,
	    	user: $scope.user
	      },
	      controller: invitePeopleController
	   })
	};

	$scope.leaveTeam = function($event){
		var creator=false;
		var userLeaving={};
		for (var i=0;i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].teamPrivileges==2){
				if (serviceParticipate.getParticipates()[i].user==$scope.user.id){
						creator=true;
						userLeaving=serviceParticipate.getParticipates()[i];
						break;
				}
			}
		}
		if (creator){
			var parentEl = angular.element(document.body);
		    $mdDialog.show({
		      parent: parentEl,
		      targetEvent: $event,
		      template:
		        '<md-dialog aria-label="List dialog" ng-cloak flex="50">'+
		        '<md-toolbar>'+
		        '<div class="md-toolbar-tools">'+
		        '<span flex><h2>Leave team</h2></span>'+
		        '<md-button class="md-icon-button" ng-click="closeDialog()">'+
		        '<md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
		        '</md-button>'+
		        '</div>'+
		        '</md-toolbar>'+
		        '<md-dialog-content>'+
		        '<div class="md-dialog-content">'+
		        'You are the creator, you need to select a new administrator in the team administration panel in order to exit this team.'+
				'<md-button ng-show="participateUser.teamPrivileges==2" ng-click="goAdminPanel()"style="background-color:purple">'+
				' 	Admin panel'+
				'</md-button>'+
		        '</div>'+
		        '</md-dialog-content>'+
		        '</md-dialog>',
		      locals: {
		    	team: $scope.team,
		    	user: $scope.user,
		    	participateUser: $scope.participateUser
		      },
		      controller: exitTeamController
		   })
			
		}
			else{
			var parentEl = angular.element(document.body);
		    $mdDialog.show({
		      parent: parentEl,
		      targetEvent: $event,
		      template:
		        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
		        '<md-toolbar>'+
		        '<div class="md-toolbar-tools">'+
		          '<span flex><h2>Leave team</h2></span>'+
		          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
		           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
		          '</md-button>'+
		        '</div>'+
		        '</md-toolbar>'+
		        '<md-dialog-content>'+
		        '<div class="md-dialog-content">'+
		        'Are you sure you want to leave this team? '+
		        '</div>'+
		        '  <md-dialog-actions>' +
		        '  <md-button style="background-color:red" ng-click="leaveTeam()" >' +
		        '      Leave' +
		        '    </md-button>' +
		        '    <md-button ng-click="closeDialog()" class="md-primary">' +
		        '      Cancel' +
		        '    </md-button>' +
		        '  </md-dialog-actions>' +
		        '</md-dialog>',
		      locals: {
		    	team: $scope.team,
		    	user: $scope.user,
		    	participateUser: $scope.participateUser
		      },
		      controller: exitTeamController
		   })
		}
	};
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
	}
	
	$scope.newRoom = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	        '<span flex><h2>New room</h2></span>'+
	        '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	        '<md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	        '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        '<md-input-container class="md-icon-float md-block">'+
	        '<label>Room name</label>'+
	        '<md-icon aria-label="Name" class="material-icons" style="color: blue;">library_add</md-icon>'+
	        '<input ng-model="roomInput.name">'+
	        '</md-input-container>'+
	        '<md-checkbox ng-model="roomInput.privateRoom" aria-label="Private">'+
            'Private'+
	        '</md-checkbox>'+
	        '</div>'+
	        '<md-dialog-actions>' +
	        '<md-button class="md-primary md-raised" ng-click="newRoom(newRoom)" >' +
	        '  Create' +
	        '</md-button>' +
	        '<md-button ng-click="closeDialog()" class="md-primary">' +
	        'Cancel' +
	        '</md-button>' +
	        '</md-dialog-actions>' +
	        '</md-dialog>',
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
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Delete room</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Are you sure you want to delete this room? '+
	        '</div>'+
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:red" ng-click="deleteRoom(room)" >' +
	        '      Delete' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
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
		      template:
		        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
		        '<md-toolbar>'+
		        '<div class="md-toolbar-tools">'+
		          '<span flex><h2>Private room</h2></span>'+
		          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
		           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
		          '</md-button>'+
		        '</div>'+
		        '</md-toolbar>'+
		        '<md-dialog-content>'+
		        '<div class="md-dialog-content">{{userRequestRoom}}'+
		        'You have no access for this private room, if you want to enter you can send a request by clicking the button below '+
		        '<div>'+
		        '  <md-button class="md-primary md-raised" ng-click="roomRequest()" >' +
		        '      Send request' +
		        '    </md-button>' +
		        '</div>'+
		        '</div>'+
		        '</md-dialog>',
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

function roomController($scope, $http, $mdDialog, $mdToast, serviceNotification, serviceRoom, $window, room, user, team, serviceRequestJoinRoom, participateUser, serviceParticipateRoom, serviceChatMessage) {
	
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
			var request={};
			request.user=user.id;
			request.room=room.id;
			request.team=team.id;
			serviceRequestJoinRoom.newRequestJoinRoom(request);
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

function exitTeamController($scope, $http, $filter, $mdDialog, serviceNotification, serviceRoom, $window, serviceChatMessage, serviceParticipate, serviceRoom, serviceTeam, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom, serviceUser, serviceRoomInvite, team, user, participateUser) {

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
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user == user.id && serviceParticipate.getParticipates()[i].team == team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
			if (serviceParticipateRoom.getParticipateRooms()[i].user == user.id && serviceParticipateRoom.getParticipateRooms()[i].team == team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipate.getParticipateRooms()[i]);
			}
		}
		for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
			if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user == user.id && serviceRequestJoinRoom.getRequestJoinRooms()[i].team == team.id){
				serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
			}
		}
		for (var i=0;i<serviceRoomInvite.getRoomInvites().length;i++){
			if (serviceRoomInvite.getRoomInvites()[i].transmitter == user.id && serviceRoomInvite.getRoomInvites()[i].team == team.id){
				serviceRoomInvite.deleteRoomInvite(serviceRoomInvite.getRoomInvites()[i]);
			}
		}		
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
function invitePeopleController($scope, $http, $route, $mdDialog, serviceNotification, serviceUser, $window, team, user) {
	
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