/*
 * @author Sergio Banegas Cortijo
 */
perseus.run(["$templateCache", function($templateCache) {$templateCache.put("mentio-menu.tpl.html","<ul class=\"dropdown-menu\" style=\"display:block;\">\n    <li mentio-menu-item=\"item\" ng-repeat=\"item in items track by $index\">\n        <a class=\"text-primary\" ng-bind-html=\"item.name | mentioHighlight:triggerText:\'menu-highlighted\' | unsafe\"></a>\n    </li>\n</ul>");}]);
perseus.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html === '<br>') {
              html = '';
          }
          ngModel.$setViewValue(html);
      }

      if(!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
          if (ngModel.$viewValue !== element.html()) {
              element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
          }
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
          scope.$apply(read);
      });
      read(); // initialize
    }
  };
}])