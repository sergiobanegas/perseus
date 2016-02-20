/*global angular*/

(function() {
    'use strict';

    angular
        .module('angular-click-outside', [])
        .directive('clickOutside', ['$document', '$parse', clickOutside]);

    function clickOutside($document, $parse) {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [],
                    fn;

                // add the elements id so it is not counted in the click listening
                if (attr.id !== undefined) {
                    classList.push(attr.id);
                }

                function eventHandler(e) {

                    // check if our element already hidden and abort if so
                    if (angular.element(elem).hasClass("ng-hide")) {
                        return;
                    }

                    var i = 0,
                        element;

                    // if there is no click target, no point going on
                    if (!e || !e.target) {
                        return;
                    }

                    // loop through the available elements, looking for classes in the class list that might match and so will eat
                    for (element = e.target; element; element = element.parentNode) {
                        var id = element.id,
                            classNames = element.className,
                            l = classList.length;

                        // Unwrap SVGAnimatedString
                        if (classNames && classNames.baseVal !== undefined) {
                            classNames = classNames.baseVal;
                        }

                        // loop through the elements id's and classnames looking for exceptions
                        for (i = 0; i < l; i++) {
                            // check for id's or classes, but only if they exist in the first place
                            if ((id !== undefined && id === classList[i]) || (classNames && classNames === classList[i])) {
                                // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                                return;
                            }
                        }
                    }

                    // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
                    return $scope.$apply(function() {
                        fn = $parse(attr['clickOutside']);
                        return fn($scope);
                    });
                }

                // detect if touch device and listen to touchstart instead of click
                var ua = navigator.userAgent,
                    event = (hasTouch()) ? "touchstart" : "click";

                // assign the document click handler to a variable so we can un-register it when the directive is destroyed
                $document.on(event, eventHandler);

                // when the scope is destroyed, clean up the documents click handler as we don't want it hanging around
                $scope.$on('$destroy', function() {
                    $document.off('click', eventHandler);
                });
                
                // attempt to figure out if we are on a touch device
                function hasTouch() {
                    // works on most browsers, IE10/11 and Surface
                    return 'ontouchstart' in window || navigator.maxTouchPoints;
                };
            }
        };
    }
})();