/*
 * @author Sergio Banegas Cortijo
 */

perseus.controller('indexController', function ($scope, $mdDialog, $route, $filter, webNotification, serviceNotification, serviceUser, serviceTeam, serviceParticipate, serviceTeamInvite) {
	
	$scope.user = serviceUser.getSession();
	$scope.teams= serviceParticipate.getParticipates();
	
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
	
});