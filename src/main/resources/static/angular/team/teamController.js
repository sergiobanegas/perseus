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
		
	
	$("#publicroomsbutton").click(function() {
		$("#publicrooms").toggle("blind");
	});
	
	$("#privateroomsbutton").click(function() {
		$("#privaterooms").toggle("blind");
	});
	$("#onlinemembersbutton").click(function() {
		$("#onlinemembers").toggle("blind");
	});
	
	$("#search").click(function(){
		$("#inputsearch").animate({width:'toggle'},350);
	});
	
	$('textarea').bind('keypress', function(e) {
		  if ((e.keyCode || e.which) == 13) {
		    $(this).parents('form').submit();
		    return false;
		  }
		});

	$scope.showNotificationTop = function(){
		if (Notification.permission === "granted"){
			return false;
		} 
		else return true;
	}
	$scope.enableNotifications = function(){
		Notification.requestPermission();
	}
	
	$scope.showRoomButtons = function(index){
		$("#"+index).show();
	}
	
	$scope.hideRoomButtons = function(index){
		$("#"+index).hide();
	}
	var timeoutId;
	$scope.showMenu = function(){
		clearInterval(timeoutId);
		$("#menu").show();
	}
	
	$scope.hideMenu = function(){
		timeoutId = setTimeout(function (){
		$("#menu").hide();
		}, 500);
	}
	//global variables
	$scope.user=serviceUser.getSession();
	$scope.users=serviceUser.getUsers();
	$scope.team={};
	serviceTeam.getTeamHttp($routeParams.id).then(function (result){
		$scope.team = result.data;
		$("#globalchatscroll").scrollTop($("#globalchatscroll")[0].scrollHeight);
	    $("#chatscroll").delay(300).scrollTop($("#chatscroll")[0].scrollHeight);
	});
    
    $scope.teamUsers=[];
    $scope.teamUsersWithoutUser=[];    
    serviceParticipate.getTeamParticipates($routeParams.id).then(function (result){
        $scope.teamUsers=result.data;
        $scope.teamUsersWithoutUser = $filter('filter')(result.data, { user: '!'+$scope.user.id});
	});
    
    $scope.member=false;   
    serviceParticipate.getUserParticipate($routeParams.id, $scope.user.id).then(function (result){
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
	    		break;
	    	}
	    }
	});
	$scope.publicRooms= function(){
		return $filter('filter')(serviceRoom.getRooms(), { team: $scope.team.id, privateRoom: 0});
	}
	$scope.privateRooms= function(){
		return $filter('filter')(serviceRoom.getRooms(), { team: $scope.team.id, privateRoom: 1});
	}
	$scope.chatMessages = function(){
		return $filter('filter')(serviceChatMessage.getChatMessages(), { team: $scope.team.id, room : 0});
	}
	
	$scope.optionFilter;
	$scope.chatFilter="";
	$scope.nameFilter="";
	$scope.dateFilter=new Date();
	$scope.contentFilter="";
	
	$scope.resetFilter= function(){
		$scope.chatFilter="";
		$("#filterdate").hide();
		$("#filtername").hide();
		$("#filtercontent").hide();
		$scope.optionFilter=null;
	}
	
	$scope.showFilterName = function(){
		$("#filtername").show();
		$("#filtercontent").hide();
		$("#filterdate").hide();
	}
	
	$scope.showFilterDate = function(){
		$("#filterdate").show();
		$("#filtername").hide();
		$("#filtercontent").hide();
	}
	
	$scope.showFilterContent = function(){
		$("#filtercontent").show();
		$("#filtername").hide();
		$("#filterdate").hide();
	}
	
	$scope.searchByFilter = function(){
		if ($('#filtername').is(":visible")){
			$scope.chatFilter="name";
		}
		if ($('#filtercontent').is(":visible")){
			$scope.chatFilter="content";
		}
		if ($('#filterdate').is(":visible")){
			$scope.chatFilter="date";
		}
	}
	$scope.filterMessages = function(message){
		if ($scope.chatFilter=="name"){
			return message.userName==$scope.nameFilter;
		}
		else if ($scope.chatFilter=="content"){
			return (message.text).indexOf($scope.contentFilter) > -1;
		}
		else if ($scope.chatFilter=="date"){
			var date1=($scope.dateFilter.toLocaleDateString()).split("/");
			var date2=message.date.slice(0,10).split("-");
			return (date1[0]==date2[2] || date1[0]=="0"+date2[2]) && (date1[1]==date2[1] || "0"+date1[1]==date2[1]) && date1[2]==date2[0];
		}
		else{
			return true;
		}
	}
	//tarda mucho
	$scope.chatMessagesOrdered = function(){
		var chatMessages=$scope.chatMessages();
		var chatMessagesOrdered=[];
		for (var i=0;i<chatMessages.length;i++){
			if (i>0 && chatMessages[i].user==chatMessages[i-1].user){
				chatMessagesOrdered[chatMessagesOrdered.length-1].text=chatMessagesOrdered[chatMessagesOrdered.length-1].text+"</br>"+chatMessages[i].text;
			}else{
				chatMessagesOrdered.push(chatMessages[i]);
			}
		}
		return chatMessagesOrdered;
	}

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
		return $filter('filter')($scope.teamUsersWithoutUser, { user: query});
	}
	
	//end screens
	//auxiliar search functions
	$scope.findUserById = function(iduser){
		return serviceUser.getUser(iduser);
	}
	
	$scope.findTeamById = function(idteam){
		return serviceTeam.getTeam(idteam);
	}
	//end auxiliar search functions
	//chat message
	$scope.chatMessage;
	$scope.emojiMessage;
	$scope.sendMessage = function () { 
		serviceChatMessage.newChatMessage({room: 0, team: $scope.team.id, text: $scope.chatMessage, user: $scope.user.id, userName: $scope.user.name, date: new Date()});	  		
		$scope.chatMessage="";
		$scope.emojiMessage="";
  		setTimeout(function(){
  			$("#globalchatscroll").scrollTop($("#globalchatscroll")[0].scrollHeight);
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
	$scope.privateMessages= function(){
		return $filter('filter')(servicePrivateMessage.getPrivateMessages(), { team: $scope.team.id}); 
	}
	
	$scope.privateMessagesChat = function(){
		var conversation=[];
		var messages=$scope.privateMessages();
		for (var i=0;i<messages.length;i++){
			if ((messages[i].transmitter==$scope.user.id && messages[i].receiver==$scope.userReceiver) || (messages[i].receiver==$scope.user.id && messages[i].transmitter==$scope.userReceiver)){
				conversation.push(messages[i]);
			}
		}
		return conversation;
	}
	
	$scope.filterMessagesContacts = function(){
		var array=[];
		var messages=$scope.privateMessages();
		for (var i=0;i<messages.length;i++){
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
			servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.receiver.user, team: $routeParams.id, text: $scope.privateMessage, date: new Date()});
		}
	}
	$scope.replyText="";
	$scope.replyMessage = function(message){
		servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.userReceiver, team: $routeParams.id, text: message, date: new Date()});
		$scope.replyText="";
		setTimeout(function(){
  			$("#chatscroll").scrollTop($("#chatscroll")[0].scrollHeight);
  	    }, 500);
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
    	var data= {"user" : user,"team" : team,	"response" : 1};
		$http.post("/senduserjoined", data);
    }
    $scope.denyRequest = function(request){
    	var user=$scope.findUserById(request.user);
    	var team=$scope.findTeamById(request.team);
    	serviceRequestJoinTeam.deleteRequestJoinTeam(request);
    	$scope.notification("Request denied");
    	var response=0;
    	var data= {"user" : user, "team" : team, "response" : 0};
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
		return $filter('filter')(serviceParticipate.getParticipates(), { team: team.id});
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
			var data= {"email": $scope.email, "team": team};
			$http.post("/sendinvitation", data);
			serviceNotification.showNotification("Invitation sent", "The invitation has been sent to "+$scope.email);
			$scope.email="";
		}
	}
	
	$scope.closeDialog = function() {
		$mdDialog.hide();
	}
}