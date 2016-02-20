angular-click-outside
=====================

An angular directive to detect a click outside of an elements scope. Great for closing dialogues, drawers and off screen menu's etc.

###Recent changes

- Added support for SVG elements thanks to @holm
- Removed isolated scope as per @elado suggestion so it can be added to element already calling for isolated scope
- Now deregistering document click listener when routing away from within the callback passed to the directive
- Added in-code documentation, and removed the check for id roadblock in loop of elements

###Installation

There are two easy ways to install the clickoutside directive:

#### Manual download

Download the `clickoutside.directive.js` file, and include it in your index.html file with something like:

    <script type="text/javascript" src="/path/to/clickoutside.directive.js"></script>

Also be sure to include the module in your app.js file with:

    angular.module('yourAppName', ['angular-click-outside'])

####Bower

    bower install angular-click-outside --save

###Usage
__To use this directive, ensure the element you want to detect a close outside of has an id__.

The directive will work with either id's or classes, however be wary of using classes as quite often some unwanted elements may have the same class, and so will be excluded/included unintentionally. 

If you are sure that you want to exclude/include all elements with a class however the directive will work just fine as it looks through the classNames as well as looking at the given id list.

General though ID's will suffice, but instances of dynamically inserted list items may require the use of classes.

Add the directive via the `click-outside` attribute, and give exceptions via the `outside-if-not` attribute.

Basic example:

    <div class="menu" id="main-menu" click-outside="closeThis">
        ...
    </div>

This is of little use though without a callback function to do something with that click:

    <div class="menu" id="main-menu" click-outside="closeThis()">
        ...
    </div>

Where `closeThis()` is the function assigned to the scope via the controller such as:

    angular
        .module('myApp')
        .controller('MenuController', ['$scope', MenuController]);

    function MenuController($scope) {
        $scope.closeThis = function () {
            console.log('closing');
        }
    }

    <button id="my-button">Menu Trigger Button</button>
    <div ng-controller="MenuController">
        <div class="menu" id="main-menu" click-outside="closeThis()" outside-if-not="my-button">
            ...
        </div>
    </div>

###Adding Exceptions
You can also add exceptions via the `outside-if-not` tag, which executes the callback function, but only if the id's or classes listed aren't clicked.

In this case `closeThis()` will be called only if clicked outside _and_ #my-button wasn't clicked as well (note .my-button also would be an exception). This can be great for things like slide in menus that might have a button outside of the menu scope that triggers it:

    <button id="my-button">Menu Trigger Button</button>
    <div class="menu" id="main-menu" click-outside="closeThis()" outside-if-not="my-button">
        ...
    </div>

You can have more than one exception by comma delimiting a list such as:

	<button id="my-button">Menu Trigger Button</button>
    <div class="menu" id="main-menu" click-outside="closeThis()" outside-if-not="my-button, another-button">
        ...
    </div>
	<button id="another-button">A second trigger button</button>
