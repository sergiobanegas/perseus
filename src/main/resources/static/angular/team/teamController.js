/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('teamController', function ($filter, $mdDialog, $mdToast, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, $timeout, $mdSidenav, serviceUser, servicePrivateMessage, serviceRoom, serviceTeam, serviceRoomInvite, serviceParticipate, serviceKurentoRoom, serviceChatMessage, serviceNotification, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom, serviceTeamInvite) {
	//Kurento client config
	$http.get('/getClientConfig').
	    success(function (data, status, headers, config) {
	   	console.log(JSON.stringify(data));
	   	$scope.clientConfig = data;
	    });
	
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
	
	$scope.mentionsFilter = function(message){
		return ((message.text).toString().split(" ")).indexOf("@"+$scope.user.name) > -1; 
	}

	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
	}
	//Screens
	$scope.userReceiver={};
	$scope.showUserMessages = function(user){
		$scope.userReceiver=user;
		$("#privateChat").show();
		$("#newchatform").hide();
		$scope.messagesScreen="userMessages";
	}
	
	$scope.messagesScreen="newMessage";
	
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
	
	$scope.findRoomById = function(idroom){
		return serviceRoom.getRoom(idroom);
	}
	//end auxiliar search functions
	//chat message
	$scope.chatMessage;
	$scope.emojiMessage;
	$scope.sendMessage = function () { 
		if ($scope.chatMessage!="" && $scope.emojiMessage!=""){
			serviceChatMessage.newChatMessage({room: 0, team: $scope.team.id, text: $scope.chatMessage, user: $scope.user.id, userName: $scope.user.name, date: new Date()});	  		
			$scope.chatMessage="";
			$scope.emojiMessage="";
	  		setTimeout(function(){
	  			$("#globalchatscroll").scrollTop($("#globalchatscroll")[0].scrollHeight);
	  	    }, 500);
		}
	};
	
	$scope.index = 1;
	$scope.searchPeople = function (term) {
		$scope.people = $filter('filter')($scope.users, {name:term});
	}
	$scope.getPeopleText = function (member) {
		return '@' + member.name;
	}
	
	$scope.chatFilter="";
	$scope.nameFilter="";
	$scope.dateFilter=new Date();
	$scope.contentFilter="";
	
	$scope.resetFilter= function(){
		$scope.chatFilter="";
		$("#filterdate").hide();
		$("#filtername").hide();
		$("#filtercontent").hide();
		$("#searchFilter").hide();
	}
	
	$scope.showFilterName = function(){
		$("#filtername").show();
		$("#searchFilter").show();
		$("#filtercontent").hide();
		$("#filterdate").hide();
	}
	
	$scope.showFilterDate = function(){
		$("#filterdate").show();
		$("#searchFilter").show();
		$("#filtername").hide();
		$("#filtercontent").hide();
	}
		
	$scope.showFilterContent = function(){
		$("#filtercontent").show();
		$("#searchFilter").show();
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
			return ((message.text).toString().split(" ")).indexOf($scope.contentFilter) > -1;
		}
		else if ($scope.chatFilter=="date"){
			var date1=($scope.dateFilter.toLocaleDateString()).split("/");
			var date2=message.date.slice(0,10).split("-");
			return parseInt(date1[0])==parseInt(date2[2]) && parseInt(date1[1])==parseInt(date2[1]) && parseInt(date1[2])==parseInt(date2[0]);
		}
		else{
			return true;
		}
	}
	
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
	
	$scope.emojiMessage3;
	$scope.privateMessage='';
	$scope.searchText;
	$scope.newPrivateMessage = function(){
		if ($scope.privateMessage!='' && $scope.receiver.id){
			servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.receiver.user, team: $routeParams.id, text: $scope.privateMessage, date: new Date()});
			$scope.privateMessage='';
			$scope.emojiMessage3="";
			$scope.showUserMessages($scope.receiver.user);
			$scope.receiver={};
			$scope.searchText="";
		}
	}
	$scope.emojiMessage2;
	$scope.replyText="";
	$scope.replyMessage = function(){
		servicePrivateMessage.newPrivateMessage({transmitter: $scope.user.id, transmitterName: $scope.user.name, receiver: $scope.userReceiver, team: $routeParams.id, text: $scope.replyText, date: new Date()});
		$scope.replyText="";
		$scope.emojiMessage2="";
		setTimeout(function(){
  			$("#chatscroll").scrollTop($("#chatscroll")[0].scrollHeight);
  	    }, 500);
	}
	//END private messages
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
    	var requests=$filter('filter')(serviceRequestJoinRoom.getRequestJoinRooms(), { team: $scope.team.id});
    	var participateRooms=serviceParticipateRoom.getParticipateRooms();
    	var roomRequests=[];
    	for (var i=0;i<requests.length;i++){
    		for (var j=0;j<participateRooms.length;j++){
    			if (participateRooms[j].user==$scope.user.id && participateRooms[j].roomPrivileges>0 && participateRooms[j].room==requests[i].room){
    				roomRequests.push(requests[i]);
    				break;
    			}
    		}
    	}
    	return roomRequests;
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
    //invite people
  
    $scope.email="";
	$scope.sendInvitation = function(){
		if ($scope.email==""){
			$scope.notification("Please enter a email");
		}else{
			var data= {"email": $scope.email, "team": $scope.team};
			$http.post("/sendinvitation", data);
			serviceNotification.showNotification("Invitation sent", "The invitation has been sent to "+$scope.email);
			$scope.email="";
		}
	}
	$scope.sendInvitationUser = function (name){
		var user=$filter('filter')($scope.users, { name: name});
		var participates=serviceParticipate.getParticipates();
		var isMember=false;
		if (user.length>0){
			for (var i=0;i<participates.length;i++){
				if (participates.user==user.id && participates.team==$scope.team.id){
					isMember=true;
					break;
				}
			}
			if (!isMember){
				serviceTeamInvite.newTeamInvite({user: user[0].id, team: $scope.team.id});
				var data= {"email": user[0].email, "team": $scope.team};
				$http.post("/sendinvitation", data);
				serviceNotification.showNotification("Invitation sent", "The invitation has been sent");
			}else{
				$scope.notification(name+" is already a member of the team");
			}
		}else{
			$scope.notification("The user with the name "+name+" doesn't exists");
		}
	}

	//end invite people
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
	 //jQuery functions 
//	 $scope.chatStyle = ".message_"+$scope.user.id+" { background-color:  #e6e6ff; }";
	 
	 $("#newPrivateMessage").click(function(){
		$("#newchatform").show(); 
		$("#privateChat").hide();
	 });
	 
	 $(".sidenavButton").click(function(){
		 if (!$('#sidenav').is(":visible")){
			 $("#sidenav").show('slide', {direction: 'left'}, 100);
		 }else{
			 $("#sidenav").hide('slide', {direction: 'left'}, 100);
		 }
	 })
	 
	 $(".notifications").click(function() {
		 if (!$('.notifications').hasClass("active")){
			$(".notifications").addClass("active");
		}else{
			$(".notifications").removeClass("active");
		}	
	 });
	 
	 $("#membershipToggle").click(function() {
		 $("#privateMessagesButton").removeClass("active");
		 $("#homeButton").removeClass("active");
		 $(".notifications").removeClass("active");
		 $("#membershipMenu").toggle("blind");
		 if (!$('#membershipToggle').hasClass("active")){
			$("#membershipToggle").addClass("active");
		}else{
			$("#membershipToggle").removeClass("active");
		}	
	 });
	 
	 $("#homeButton").click(function(){
		 $("#membershipToggle").removeClass("active");
		 $("#privateMessagesButton").removeClass("active");
		 $(".notifications").removeClass("active");
		 $("#membership").hide();
		 $("#privateMessages").hide();
		 $("#privateChat").hide();
		 $("#chat").show(); 
		 if (!$('#homeButton').hasClass("active")){
				$("#homeButton").addClass("active");
		 }else{
			 $("#homeButton").removeClass("active");
		 }	
	 });
	 
	 $("#privateMessagesButton").click(function(){
		 $("#membershipToggle").removeClass("active");
		 $("#homeButton").removeClass("active");
		 $(".notifications").removeClass("active");
		 $("#chat").hide(); 
		 $("#membership").hide();
		 $("#privateChat").hide(); 
		 $("#privateMessages").show(); 
		 if (!$('#privateMessagesButton').hasClass("active")){
				$("#privateMessagesButton").addClass("active");
		 }else{
			 $("#privateMessagesButton").removeClass("active");
		 }	
	 });
	 
	 $("#membershipButton").click(function(){
		 $("#chat").hide(); 
		 $("#newchatform").hide(); 
		 $("#privateChat").hide();
		 $("#membership").show();
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
		
	 $scope.closeEnableNotifications = function(){
		 $("#enablenotifications").animate({height:'toggle'},350);
	 }

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
	 
	 $("#chatform").keypress(function (e) {
	        if(e.which == 13) {
	            e.preventDefault();
	            $scope.sendMessage();
	        }
	 });
	 
	 $("#privatechatform").keypress(function (e) {
	        if(e.which == 13) {
	            e.preventDefault();
	            $scope.replyMessage();
	        }
	 });
	 
	 $("#newchatform").keypress(function (e) {
	        if(e.which == 13) {
	            e.preventDefault();
	            $scope.newPrivateMessage();
	        }
	 });
	 
	 $("#inviteButton").animatedModal({
		 modalTarget:'inviteModal',
		 animatedIn: 'lightSpeedIn',
		 animatedOut: 'bounceOutDown'
	 });
	
	 //END jQuery functions
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

function exitTeamController($scope, $http, $filter, $mdDialog, $mdToast, $window, serviceNotification, serviceParticipate, serviceTeam, serviceUser, team, user, participateUser) {

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
//		serviceNotification.showNotification("Goodbye", "You left the team");
		serviceParticipate.deleteParticipate(participateUser);
		$mdDialog.hide();
		$window.location.href = '#/home';
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
	
	$scope.notification = function(text) {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent(text)
	        .position("bottom right")
	        .hideDelay(3000)
	    );
	};

}