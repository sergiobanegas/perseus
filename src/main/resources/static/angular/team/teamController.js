/*
 * @author Sergio Banegas Cortijo
 */

kurento_room.controller('teamController', function ($rootScope, $location, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, serviceUser, serviceRoom, serviceTeam, serviceParticipate, serviceKurentoRoom, serviceChatMessage, LxNotificationService, LxDialogService) {
  
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
	$http.get('/participates')
	  .then(function(result) {
	    $scope.participatesHttp = result.data;
	});
	
	$scope.teams2 = serviceTeam.getTeams();
	
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
    $scope.team={};
    $http.get('/teams/'+$routeParams.id)
	  .then(function(result) {
	    $scope.team = result.data;
	});
	$scope.user=serviceUser.getSession();
	
	$scope.rooms=serviceRoom.getRooms();
	$scope.chatMessage="";
	$scope.participate = function(){
		var participates=0;
		if ($scope.user.name){
			for (var i=0;i<serviceParticipate.getParticipates().length; i++){
				if ((serviceParticipate.getParticipates()[i].iduser==$scope.user.id)&&(serviceParticipate.getParticipates()[i].idteam==$routeParams.id)){
					participates=1;
				}
			}
		}
		return participates;
	};
	
	$scope.leaveTeam = function(){
		for (var i = 0; i<$scope.participatesHttp.length;i++){
			if ($scope.participatesHttp[i].iduser == $scope.user.id && $scope.participatesHttp[i].idteam == $scope.team.id){
				serviceParticipate.deleteParticipate($scope.participatesHttp[i]);
			}
		}
		$window.location.href = '#/';
		LxNotificationService.success("You exit the team!");
		$route.reload();
	};
	
	$scope.deleteTeam = function(){
		for (var i = 0; i<$scope.roomsHttp.length;i++){
			if ($scope.roomsHttp[i].idteam == $scope.team.id){
				serviceRoom.deleteRoom($scope.roomsHttp[i]);
			}
		}
		
		for (var i = 0; i<$scope.chatMessagesHttp.length;i++){
			if ($scope.chatMessagesHttp[i].team == $scope.team.id){
				serviceChatMessage.deleteChatMessage($scope.chatMessagesHttp[i]);
			}
		}				
		for (var i = 0; i<$scope.participatesHttp.length;i++){
			if ($scope.participatesHttp[i].idteam == $scope.team.id){
				serviceParticipate.deleteParticipate($scope.participatesHttp[i]);
			}
		}
		
		serviceTeam.deleteTeam($scope.team);
		$window.location.href = '#/';
		LxNotificationService.success("Team deleted!");
		$route.reload();
	}
	
	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		LxNotificationService.success("¡Hasta pronto!");
}
	
	$scope.newRoom = function(room){
		room.team=$scope.team.id;
		if (room.privileges){
			room.privileges=1;
		}
		else{
			room.privileges=0;
		}
		serviceRoom.newRoom(room);
		room.privileges=0;
		LxNotificationService.success("Room "+room.name+" created!");
	};
	
	$scope.roomToDelete={};
	
	$scope.openDeleteRoom = function(room){
		$scope.roomToDelete=room;
		$scope.opendDialog('deleteRoom');
	};
	
	$scope.deleteRoom = function(){
		serviceRoom.deleteRoom($scope.roomToDelete);
		LxNotificationService.success("Room "+$scope.roomToDelete.name+" deleted!");
		$scope.roomToDelete={};
	};

	$scope.register = function (room) {
	
		$scope.roomName = room.name;
		
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
		            	console.warn("Leave room because of error: " + answer);
		            	if (answer) {
		            		kurento.close(true);
		            	}
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
		serviceKurentoRoom.setUserName($scope.user.name);
		serviceKurentoRoom.setTeam($scope.team.id);
		//redirect to call
		$window.location.href = '#/call';
	};
	
	$scope.chatMessage;
	
	$scope.sendMessage = function () {   	
  	  var message = {};
  	  message.room="main";
  	  message.team=$scope.team.id;
  	  message.text=$scope.chatMessage;
  	  message.user=serviceUser.getSession().name;
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
    
	$scope.opendDialog = function(dialogId){
	    LxDialogService.open(dialogId);
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
    
});