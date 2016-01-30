/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('teamController', function ($filter, $mdDialog, $mdMedia, $mdToast, $rootScope, $location, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, $timeout, $mdSidenav, $log, serviceUser, servicePrivateMessage, serviceRoom, serviceTeam, serviceRoomInvite, serviceParticipate, serviceKurentoRoom, serviceChatMessage, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom) {
  
	
	
    $http.get('/getAllRooms').
	    success(function (data, status, headers, config) {
	        console.log(JSON.stringify(data));
	        $scope.listRooms = data;
	    }).
	    error(function (data, status, headers, config) {
    });

	$http.get('/getClientConfig').
	     success(function (data, status, headers, config) {
	    	console.log(JSON.stringify(data));
	    	$scope.clientConfig = data;
	     }).
	     error(function (data, status, headers, config) {	 
	});
	
	$scope.screen="chat";
	
	$scope.showMainScreen = function(){
		$scope.screen="chat";
	}
	
	$scope.showPrivateMessages = function(){
		$scope.screen="privateMessages";
	}
	$scope.user=serviceUser.getSession();
	
	$scope.team={};
    $http.get('/teams/'+$routeParams.id)
	  .then(function(result) {
	    $scope.team = result.data;
	});
		
    $scope.receiver;
	$scope.querySearch = function (query) {
		return $filter('filter')($scope.teamUsers2(), { name: query});
	}
	
	$scope.teamUsers2 = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team==$scope.team.id && serviceParticipate.getParticipates()[i].user!=$scope.user.id){
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
	
	$scope.filterUniqueMessages = function(){
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
	
	$scope.userReceiver={};
	$scope.showUserMessages = function(user){
		$scope.userReceiver=user;
		$scope.screen="privateUserMessages";
	}
		
	$scope.privateMessage='';
	$scope.newPrivateMessage = function(){
		var privateMessage={};
		privateMessage.transmitter=$scope.user.id;		
		privateMessage.receiver=$scope.receiver.id;
		privateMessage.team=$routeParams.id;
		privateMessage.text=$scope.privateMessage;
		servicePrivateMessage.newPrivateMessage(privateMessage);
		$scope.notification("New private message");
	}
	
	$scope.replyMessage = function(message){
		var privateMessage={};
		privateMessage.transmitter=$scope.user.id;		
		privateMessage.receiver=$scope.userReceiver;
		privateMessage.team=$routeParams.id;
		privateMessage.text=message;
		servicePrivateMessage.newPrivateMessage(privateMessage);
		$scope.notification("New private message");
		
	}
	
	$scope.teamUsers = function(){
		var teamUsers=[];
		for (var i=0; i< serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team==$scope.team.id){
				teamUsers.push($scope.findUserById(serviceParticipate.getParticipates()[i].user));
			}
		}
		return teamUsers;
	};
	
	$scope.findUserById = function(iduser){
		for (var i=0; i< serviceUser.getUsers().length;i++){
			if (serviceUser.getUsers()[i].id==iduser){
				return serviceUser.getUsers()[i];
				break;
			}
		}
	}
	
	$scope.findTeamById = function(idteam){
		for (var i=0; i< serviceTeam.getTeams().length;i++){
			if (serviceTeam.getTeams()[i].id==idteam){
				return serviceTeam.getTeams()[i];
				break;
			}
		}
	}
    
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
    
	$scope.roomsHttp=[];
	$http.get('/rooms')
	  .then(function(result) {
	    $scope.roomsHttp = result.data;
	});
	$scope.chatMessagesHttp=[];
	$http.get('/chatmessages')
	  .then(function(result) {
	    $scope.chatMessagesHttp = result.data;
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
		
	$scope.roomName = serviceKurentoRoom.getRoomName();
    $scope.userName = serviceKurentoRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = serviceKurentoRoom.getKurento();
    $scope.chatMessages = serviceChatMessage.getChatMessages();
    
    window.onbeforeunload = function () {
    	//not necessary if not connected
    	if (ServiceParticipant.isConnected()) {
    		serviceKurentoRoom.getKurento().close();
    	}
    };
	
	$scope.rooms=serviceRoom.getRooms();
	$scope.chatMessage="";
	$scope.participate = function(){
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
	
	
	
	$scope.invitePeople = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" style="height:100%;width:100%"ng-cloak>' +
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
			$scope.notification("You are the creator");
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
		        'You are the creator, you need to select a new administrator in order to exit this team.'+
		     '   <md-input-container>'+
		     '   <label>State</label>'+
		     '   <md-select ng-model="userState">'+
		     '     <md-option ng-repeat="state in participates()" value="{{state.id}">'+
		      '      {{state.id}}'+
		      '    </md-option>'+
		     '   </md-select>'+
		    '  </md-input-container>'+
		        '</div>'+
		        '</md-dialog-content>'+
		        '</md-dialog>',
		      locals: {
		    	team: $scope.team,
		    	user: $scope.user
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
		    	user: $scope.user
		      },
		      controller: exitTeamController
		   })
		}
	};
	
	$scope.deleteTeam = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      template:
	        '<md-dialog aria-label="List dialog" ng-cloak flex="50">' +
	        '<md-toolbar>'+
	        '<div class="md-toolbar-tools">'+
	          '<span flex><h2>Delete team</h2></span>'+
	          '<md-button class="md-icon-button" ng-click="closeDialog()">'+
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
	          '</md-button>'+
	        '</div>'+
	        '</md-toolbar>'+
	        '<md-dialog-content>'+
	        '<div class="md-dialog-content">'+
	        'Are you sure you want to delete this team? '+
	        '</div>'+
	        '  <md-dialog-actions>' +
	        '  <md-button style="background-color:red" ng-click="deleteTeam()" >' +
	        '      Delete' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
	        '</md-dialog>',
	      locals: {
	    	team: $scope.team,
	    	user: $scope.user
	      },
	      controller: exitTeamController
	   })
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
	           ' <md-icon class="material-icons" aria-label="Close dialog">close</md-icon>'+
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
	        '  <md-dialog-actions>' +
	        '  <md-button class="md-primary md-raised" ng-click="newRoom(newRoom)" >' +
	        '      Create' +
	        '    </md-button>' +
	        '    <md-button ng-click="closeDialog()" class="md-primary">' +
	        '      Cancel' +
	        '    </md-button>' +
	        '  </md-dialog-actions>' +
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
		        '<div class="md-dialog-content">'+
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
		//redirect to call
		$window.location.href = '#/call';
		}
	};
	$scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
          var context = $scope,
              args = Array.prototype.slice.call(arguments);
          $timeout.cancel(timer);
          timer = $timeout(function() {
            timer = undefined;
            func.apply(context, args);
          }, wait || 10);
        };
      }
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildDelayedToggler(navID) {
        return debounce(function() {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }, 200);
      }
      function buildToggler(navID) {
        return function() {
          $mdSidenav(navID)
            .toggle()
            .then(function () {
              $log.debug("toggle " + navID + " is done");
            });
        }
      }
	$scope.close = function () {
	      $mdSidenav('right').close()
	        .then(function () {
	          $log.debug("close RIGHT is done");
	        });
	    };
	
	$scope.chatMessage;
	
	$scope.sendMessage = function () {   	
  	  var message = {};
  	  message.room=0;
  	  message.team=$scope.team.id;
  	  message.text=$scope.chatMessage;
  	  message.user=serviceUser.getSession().id;
  	  $scope.chatMessage="";
  	  serviceChatMessage.newChatMessage(message);
	};
    
    $scope.toggleChat = function () {
        var selectedEffect = "slide";
        // most effect types need no options passed by default
        var options = {direction: "right"};
        if ($("#effect").is(':visible')) {
            $("#content").animate({width: '100%'}, 500);
        } else {
            $("#content").animate({width: '80%'}, 500);
        }
        // run the effect
        $("#effect").toggle(selectedEffect, options, 500);
    };
	
	$scope.exit = function(){
		$window.location.href = '#/';
	};
	
	$rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
    });        

	$rootScope.$watch(function () {return $location.path()}, function (newLocation, oldLocation) {
	   if (oldLocation == "/call"){
	    	serviceKurentoRoom.getKurento().close();
		    ServiceParticipant.removeParticipants();
	   }
    });
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	 };
    
});

function roomController($scope, $mdDialog, $mdToast, serviceRoom, $window, room, user, team, serviceRequestJoinRoom, participateUser, serviceParticipateRoom, serviceChatMessage) {
	
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
		$scope.notification("Room "+$scope.roomInput.name+" created");
	};
	
	   $scope.deleteRoom = function(){
		   
			for (var i=0;i<serviceParticipateRoom.getParticipateRooms().length;i++){
				if (serviceParticipateRoom.getParticipateRooms()[i].team==team.id && serviceParticipateRoom.getParticipateRooms()[i].room==room.id){					
					serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[i]);
				}
			}
			
			if (room.privateRoom==1){
				for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
					if (serviceRequestJoinRoom.getRequestJoinRooms()[i].room==room.id){
						serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[i]);
					}
				}
			}
			for (var i=0;i<serviceChatMessage.getChatMessages().length;i++){
				if (serviceChatMessage.getChatMessages()[i].team==team.id && serviceChatMessage.getChatMessages()[i].room==room.id){
					serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
				}
			}
			$scope.notification("Room "+room.name+" deleted");
			serviceRoom.deleteRoom(room);
			$mdDialog.hide();
		};
		
		$scope.roomRequest = function(){
			var request={};
			request.user=user.id;
			request.room=room.id;
			request.team=team.id;
			var exists=false;
			for (var i=0;i<serviceRequestJoinRoom.getRequestJoinRooms().length;i++){
				if (serviceRequestJoinRoom.getRequestJoinRooms()[i].user==user.id && serviceRequestJoinRoom.getRequestJoinRooms()[i].room==room.id){
					exists=true;
				}
			}
			if (exists){				
				$scope.notification("You already sent a request to the room "+room.name);
			}else{
				serviceRequestJoinRoom.newRequestJoinRoom(request);
				$mdDialog.hide();
				$scope.notification("Request to join "+room.name+" sent");
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

function exitTeamController($scope, $filter, $mdDialog, $mdToast, serviceRoom, $window, serviceChatMessage, serviceParticipate, serviceRoom, serviceTeam, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom, team, user) {

	$scope.newAdmin='';
	$scope.participates= function(){
		var participates = $filter('filter')(serviceParticipate.getParticipates(), { team: team.id});
		return participates;
	}
	    
	$scope.leaveTeam = function(){
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].user == user.id && serviceParticipate.getParticipates()[i].team == team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		$mdDialog.hide();
		$window.location.href = '#/';
		$scope.notification("You left the team");
		$route.reload();
	};
	
	$scope.deleteTeam = function(){
		for (var i = 0; i<serviceRoom.getRooms().length;i++){
			if (serviceRoom.getRooms()[i].team == team.id){
				if (serviceRoom.getRooms()[i].privateRoom==1){		
					for (var j=0;j<serviceRequestJoinRoom.getRequestJoinRooms().length;j++){
						if (serviceRequestJoinRoom.getRequestJoinRooms()[j].team==team.id){
							serviceRequestJoinRoom.deleteRequestJoinRoom(serviceRequestJoinRoom.getRequestJoinRooms()[j]);
						}
					}
				}
				serviceRoom.deleteRoom(serviceRoom.getRooms()[i]);
			}
		}	
		for (var j=0;j<serviceParticipateRoom.getParticipateRooms().length;j++){
			if (serviceParticipateRoom.getParticipateRooms()[j].team==team.id){
				serviceParticipateRoom.deleteParticipateRoom(serviceParticipateRoom.getParticipateRooms()[j]);
			}
		}
		for (var i = 0; i<serviceChatMessage.getChatMessages().length;i++){
			if (serviceChatMessage.getChatMessages()[i].team == team.id){
				serviceChatMessage.deleteChatMessage(serviceChatMessage.getChatMessages()[i]);
			}
		}				
		for (var i = 0; i<serviceParticipate.getParticipates().length;i++){
			if (serviceParticipate.getParticipates()[i].team == team.id){
				serviceParticipate.deleteParticipate(serviceParticipate.getParticipates()[i]);
			}
		}
		for (var i = 0; i<serviceRequestJoinTeam.getRequestJoinTeams().length;i++){
			if (serviceRequestJoinTeam.getRequestJoinTeams()[i].team==team.id){
				serviceRequestJoinTeam.deleteRequestJoinTeam(serviceRequestJoinTeam.getRequestJoinTeams()[i]);
			}
		}
		
		serviceTeam.deleteTeam(team);
		$mdDialog.hide();
		$window.location.href = '#/';
		$scope.notification("Team deleted");
	}
	
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};

}
function invitePeopleController($scope, $http, $route, $mdDialog, $mdToast, serviceUser, $window, team, user) {
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
			$scope.notification("Invitation sent to "+$scope.email);
			$scope.email="";
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