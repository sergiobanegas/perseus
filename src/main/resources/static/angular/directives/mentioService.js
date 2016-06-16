/*
 * @author Sergio Banegas Cortijo
 */
perseus.run(["$templateCache", function($templateCache) {$templateCache.put("mentio-menu.tpl.html","<div class='dropup'><ul class=\"dropdown-menu\" style=\"display:block;\">\n    <li mentio-menu-item=\"item\" ng-repeat=\"item in items track by $index\">\n        <a class=\"text-primary\" ng-bind-html=\"item.name | mentioHighlight:triggerText:\'menu-highlighted\' | unsafe\"></a>\n    </li>\n</ul></div>");}]);
perseus.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      function read() {
          var html = element.html();
          if (attrs.stripBr && html === '<br>') {
              html = '';
          }
          ngModel.$setViewValue(html);
      }

      if(!ngModel) return;

      ngModel.$render = function() {
          if (ngModel.$viewValue !== element.html()) {
              element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
          }
      };

      element.on('blur keyup change', function() {
          scope.$apply(read);
      });
      read();
    }
  };
}])