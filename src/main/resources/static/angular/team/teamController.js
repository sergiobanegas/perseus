/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('teamController', function ($filter, $mdDialog, $mdToast, $window, $scope, $http, $route, $routeParams, ServiceParticipant, $window, $timeout, $mdSidenav, $compile, serviceUser, servicePrivateMessage, serviceRoom, serviceTeam, serviceRoomInvite, serviceParticipate, serviceKurentoRoom, serviceChatMessage, serviceNotification, serviceRequestJoinTeam, serviceRequestJoinRoom, serviceParticipateRoom, serviceTeamInvite) {
	//Kurento client config
	$http.get('/getClientConfig').
	    success(function (data, status, headers, config) {
	   	console.log(JSON.stringify(data));
	   	$scope.clientConfig = data;
	    });
	
	//global variables
	$scope.user=serviceUser.getSession();
	$scope.team={};
	$scope.notificationStatus;
	serviceTeam.getTeamHttp($routeParams.id).then(function (result){
		$scope.team = result.data;
		if (Notification.permission==="granted"){
			$scope.notificationStatus=true;
		}else{
			$scope.notificationStatus=false;
		}
		$("#globalchatscroll").scrollTop($("#globalchatscroll")[0].scrollHeight);
		$("#privateChatScroll").scrollTop($("#privateChatScroll")[0].scrollHeight);
	    $("#chatscroll").delay(300).scrollTop($("#chatscroll")[0].scrollHeight);
	});
    
    $scope.teamUsers=[];
    $scope.teamUsersWithoutUser=[];    
    serviceParticipate.getTeamParticipates($routeParams.id).then(function (result){
        $scope.teamUsers=result.data;
        $scope.teamUsersWithoutUser = $filter('filter')(result.data, { userid: '!'+$scope.user.id});
	});
    
    $scope.member=false;
    serviceParticipate.getUserParticipate($routeParams.id, $scope.user.id).then(function (result){
    	if (result.data.length>0){
    		$scope.member = true;
		}	
    });
    
	$scope.participateUser={};
	$http.get('/participates')
	  .then(function(result) {
	    $scope.participatesHttp = result.data;
	    for (var i=0;i<$scope.participatesHttp.length;i++){
	    	if ($scope.participatesHttp[i].userid==$scope.user.id && $scope.participatesHttp[i].teamid==$scope.team.id){
	    		$scope.participateUser=$scope.participatesHttp[i];
	    		break;
	    	}
	    }
	});
	$scope.participateUser = function(){
		 for (var i=0;i<$scope.participatesHttp.length;i++){
		    	if ($scope.participatesHttp[i].userid==$scope.user.id && $scope.participatesHttp[i].teamid==$scope.team.id){
		    		$scope.participateUser=$scope.participatesHttp[i];
		    		break;
		    	}
		    }
	}
	
	$scope.publicRooms= function(){
		return $filter('filter')(serviceRoom.getRooms(), { teamid: $scope.team.id, privateRoom: 0});
	}
	$scope.privateRooms= function(){
		return $filter('filter')(serviceRoom.getRooms(), { teamid: $scope.team.id, privateRoom: 1});
	}
	$scope.chatMessages = function(){
		return $filter('filter')(serviceChatMessage.getChatMessages(), { teamid: $scope.team.id, roomid : 0});
	}
	
	$scope.mentionsFilter = function(message){
		return ((message.text).toString().split(" ")).indexOf("@"+$scope.user.name) > -1; 
	}

	$scope.logout = function(){		
		serviceUser.logout();
		$window.location.href = '#/';
		$window.location.reload();
	}
	
	$scope.goToMainPage = function(){		
		$window.location.href = '#/';
	}
	
	//Screens
	$scope.userReceiver={};
	$scope.showUserMessages = function(user){
		if (user){
			$scope.chatMessage="";
			$scope.emojiMessage="";
			$("#chatform").show();
			$scope.userReceiver=user;
			$("#privateChat").show();
			$("#newchatform").hide();
		}else{
			$scope.notification("Please select a member of your team");
		}
		
	}
	
    $scope.receiver;
	$scope.querySearch = function (query) {
		return $filter('filter')($scope.teamUsersWithoutUser, { user: {name: query}});
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
	$scope.getImage = function(data, imagetype){
		return 'data:'+imagetype+';base64, '+data;
	}
	
	$scope.chatMessage;
	$scope.emojiMessage;
	$scope.sendMessage = function () { 
		if ($("#chat").is(":visible")){
			if ($scope.chatMessage!="" && $scope.emojiMessage!=""){
				serviceChatMessage.newChatMessage({roomid: 0, teamid: $scope.team.id, text: $scope.chatMessage, userid: $scope.user.id, date: new Date()});	  		
				$scope.chatMessage="";
				$scope.emojiMessage="";
				setTimeout(function(){
		  			$("#globalchatscroll").scrollTop($("#globalchatscroll")[0].scrollHeight);
		  	    }, 500);
			}
		}else if ($("#privateChat").is(":visible")){			
			servicePrivateMessage.newPrivateMessage({transmitterid: $scope.user.id, receiverid: $scope.userReceiver, teamid: $routeParams.id, text: $scope.chatMessage, date: new Date()});
			$scope.chatMessage="";
			$scope.emojiMessage="";
			setTimeout(function(){
	  			$("#privateChatScroll").scrollTop($("#privateChatScroll")[0].scrollHeight);
	  	    }, 500);
		}
	};
	
	$scope.index = 1;
	$scope.searchPeople = function (term) {
		$scope.people = $filter('filter')(serviceUser.getUsers(), {name:term});
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
			return message.user.name==$scope.nameFilter;
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
		return $filter('filter')(servicePrivateMessage.getPrivateMessages(), { teamid: $scope.team.id}); 
	}
	
	$scope.privateMessagesChat = function(){
		var conversation=[];
		var messages=$scope.privateMessages();
		for (var i=0;i<messages.length;i++){
			if ((messages[i].transmitterid==$scope.user.id && messages[i].receiverid==$scope.userReceiver) || (messages[i].receiverid==$scope.user.id && messages[i].transmitterid==$scope.userReceiver)){
				conversation.push(messages[i]);
			}
		}
		return conversation;
	}
	
	$scope.filterMessagesContacts = function(){
		var array=[];
		var found=false;
		var messages=$scope.privateMessages();
		for (var i=0;i<messages.length;i++){
			found=false;
			if (messages[i].transmitterid==$scope.user.id){
				for (var j=0;j<array.length;j++){
					if (array[j].id==messages[i].receiverid){
						found=true;
						break;
					}
				}
				if (!found){
					array.push(messages[i].receiver);
				}
			}
			if(messages[i].receiverid==$scope.user.id){
				for (var j=0;j<array.length;j++){
					if (array[j].id==messages[i].transmitterid){
						found=true;
						break;
					}
				}
				if (!found){
					array.push(messages[i].receiver);
				}
			}
		}
		return array;
	}
	
	$scope.searchText;
	$scope.newPrivateMessage = function(){
		if ($scope.receiver.id){
			$scope.showUserMessages($scope.receiver.user);
			$scope.receiver={};
			$scope.searchText="";
			setTimeout(function(){
	  			$("#privateChatScroll").scrollTop($("#privateChatScroll")[0].scrollHeight);
	  	    }, 1000);
		}
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
    	return $filter('filter')(serviceRoomInvite.getRoomInvites(), { userid: $scope.user.id});
    }
    
    $scope.acceptRoomInvitation = function(invitation){
    	serviceParticipateRoom.newParticipateRoom({roomid: invitation.room.id, userid: invitation.user.id, teamid: $scope.team.id, roomPrivileges: 0});
    	serviceRoomInvite.deleteRoomInvite(invitation);
    	$scope.notification("Room invitation accepted");
    }
    
    $scope.denyRoomInvitation = function(invitation){
    	serviceRoomInvite.deleteRoomInvite(invitation);
    	$scope.notification("Room invitation canceled");
    }
	
    $scope.requests = function(){ 	
    	return $filter('filter')(serviceRequestJoinTeam.getRequestJoinTeams(), { teamid: $scope.team.id});
    }
    
    $scope.roomRequests = function(){
    	var requests=$filter('filter')(serviceRequestJoinRoom.getRequestJoinRooms(), { teamid: $scope.team.id});
    	var participateRooms=serviceParticipateRoom.getParticipateRooms();
    	var roomRequests=[];
    	for (var i=0;i<requests.length;i++){
    		for (var j=0;j<participateRooms.length;j++){
    			if (participateRooms[j].userid==$scope.user.id && participateRooms[j].roomPrivileges>0 && participateRooms[j].roomid==requests[i].roomid){
    				roomRequests.push(requests[i]);
    				break;
    			}
    		}
    	}
    	return roomRequests;
    }
    
    $scope.acceptRequest = function(request){
    	serviceParticipate.newParticipate({userid: request.userid, teamid: request.teamid, teamPrivileges: 0});
    	serviceRequestJoinTeam.deleteRequestJoinTeam(request);
    	$scope.notification("Request accepted");
    	var data= {"user" : request.user,"team" : request.team,	"response" : 1};
		$http.post("/senduserjoined", data);
    }
    $scope.denyRequest = function(request){
    	serviceRequestJoinTeam.deleteRequestJoinTeam(request);
    	$scope.notification("Request denied");
    	var response=0;
    	var data= {"user" : request.user, "team" : request.team, "response" : 0};
		$http.post("/senduserjoined", data);
    }
    
    $scope.acceptRoomRequest = function(request){
    	serviceParticipateRoom.newParticipateRoom({userid: request.userid, roomid: request.roomid, teamid: $scope.team.id, roomPrivileges: 0});
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request accepted");
    }
    
    $scope.denyRoomRequest = function(request){
    	serviceRequestJoinRoom.deleteRequestJoinRoom(request);
    	$scope.notification("Request denied");
    }
    //end sidenav	
    //invite people
  
    $scope.invitePeople = function($event){
		var parentEl = angular.element(document.body);
	    $mdDialog.show({
	      parent: parentEl,
	      targetEvent: $event,
	      templateUrl: 'angular/team/dialogs/invitePeople.tmpl.html',
	      clickOutsideToClose:true,
	      locals: {
	    	team: $scope.team
	      },
	      controller: invitePeopleTeamController
	   })
    };    

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
				if (serviceParticipateRoom.getParticipateRooms()[i].roomid==room.id && serviceParticipateRoom.getParticipateRooms()[i].userid==$scope.user.id){
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
		var displayPublished = $scope.clientConfig.loopbackRemote || false;
		var mirrorLocal = $scope.clientConfig.loopbackAndLocal || false;
		
		var kurento = KurentoRoom(wsUri, function (error, kurento) {
		
		    if (error)
		        return console.log(error);
				    
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
		
		serviceKurentoRoom.setKurento(kurento);
		serviceKurentoRoom.setRoomName($scope.roomName);
		serviceKurentoRoom.setRoomId($scope.roomId);
		serviceKurentoRoom.setCreator($scope.roomCreator);
		serviceKurentoRoom.setUserName($scope.user.name);
		serviceKurentoRoom.setTeam($scope.team.id);
		$("#emojibtn").remove();
		$("#emojibtn").remove();
		$("#inputchat").remove();
		$("#chatform").remove();
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
	 $("#newPrivateMessage").click(function(){
		$("#newchatform").show(); 
		$("#privateChat").hide();
		$("#chatform").hide();
	 });
	 
	 $("#toggleConversations").click(function(){
		 if ($('#lastconversations').is(":hidden")){
			 $("#lastconversations").show('slide', {direction: 'left'}, 100);
		 }else{
			 $("#lastconversations").hide('slide', {direction: 'left'}, 100);
		 }
	 })
	 
	 $(".sidenavButton").click(function(){
		 if ($('#sidenav').is(":hidden")){
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
		 $("#chatform").show();
		 $("#chat").show(); 
		 if (!$('#homeButton').hasClass("active")){
				$("#homeButton").addClass("active");
		 }else{
			 if ($("#chat").is(":hidden")){
				 $("#homeButton").removeClass("active");
			 }
		 }	
	 });
	 
	 $("#privateMessagesButton").click(function(){
		 $("#chatform").hide();
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
			 if ($("#privateMessages").is(":hidden")){
				 $("#privateMessagesButton").removeClass("active");
			 }
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
		 if ($("#privaterooms").is(":visible")){
			 $("#privaterooms").toggle("blind");
		 }
		 if ($("#onlinemembers").is(":visible")){
			 $("#onlinemembers").toggle("blind");
		 }
	 });
		
	 $("#privateroomsbutton").click(function() {
		 $("#privaterooms").toggle("blind");
		 if ($("#publicrooms").is(":visible")){
			 $("#publicrooms").hide();
		 }
		 if ($("#onlinemembers").is(":visible")){
			 $("#onlinemembers").hide();
		 }
	 });
	 $("#onlinemembersbutton").click(function() {
		 $("#onlinemembers").toggle("blind");
		 if ($("#publicrooms").is(":visible")){
			 $("#publicrooms").toggle("blind");
		 }
		 if ($("#privaterooms").is(":visible")){
			 $("#privaterooms").toggle("blind");
		 }
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
	 
	 $scope.showPublicRoomButtons = function(index){
		 $("#"+index+"_public").show();
	 }
	 
	 $scope.hidePublicRoomButtons = function(index){
		 $("#"+index+"_public").hide();
	 }
		
	 $scope.showPrivateRoomButtons = function(index){
		 $("#"+index+"_private").show();
	 }
		
	 $scope.hidePrivateRoomButtons = function(index){
		 $("#"+index+"_private").hide();
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
	 
	 $("#newchatform").keypress(function (e) {
	        if(e.which == 13) {
	            e.preventDefault();
	            $scope.newPrivateMessage();
	        }
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
		$scope.roomInput.teamid=team.id;
		$scope.roomInput.creatorid=user.id;
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
			serviceRequestJoinRoom.newRequestJoinRoom({userid: user.id, roomid: room.id, teamid: team.id});
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
		serviceNotification.showNotification("Goodbye"+participateUser.user.name, "You left the team "+team.name);
		serviceParticipate.deleteParticipate(participateUser);
		$mdDialog.hide();
		$window.location.href = '#/';
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

function invitePeopleTeamController($scope, $http, $mdDialog, $filter, $mdToast, serviceUser, serviceNotification, serviceTeamInvite, serviceParticipate, team) {
	
	$scope.team=team;
	$scope.user=serviceUser.getSession();
	$scope.email="";
	$scope.sendInvitation = function(){
		if ($scope.email==""){
			$scope.notification("Please enter a email");
		}else{
			var user=$filter('filter')(serviceUser.getUsers(), { email: $scope.email});
			if (user.length>0){
				$scope.sendInvitationUser(user.name);
			}
			var data= {"email": $scope.email, "team": $scope.team};
			$http.post("/sendinvitation", data);
			serviceNotification.showNotification("Invitation sent", "The invitation has been sent to "+$scope.email);
			$scope.email="";
		}
	}
	
	$scope.sendInvitationUser = function (name){
		var teamInvites=serviceTeamInvite.getTeamInvites();
		var alreadySent=false;
		var user=$filter('filter')(serviceUser.getUsers(), { name: name});
		if (user.length>0){
			var participates=serviceParticipate.getParticipates();
			var isMember=false;
			for (var i=0;i<teamInvites.length;i++){
				if (teamInvites[i].userid==user[0].id && teamInvites[i].teamid==team.id){
					alreadySent=true;
					break;
				}
			}
			if (alreadySent){
				$scope.notification("The user with the name "+name+" has been already invited to your team");
				return;
			}		
			for (var i=0;i<participates.length;i++){
				if (participates[i].userid==user[0].id && participates[i].teamid==team.id){
					isMember=true;
					break;
				}
			}
			if (!isMember){
				serviceTeamInvite.newTeamInvite({userid: user[0].id, teamid: $scope.team.id});
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