/**
 * @license ng-gc-dialog-directive v0.1.0
 * (c) 2013-2013 GoCardless, Ltd.
 * https://github.com/gocardless-ng/ng-gc-dialog-directive.git
 * License: MIT
 */'use strict';

angular.module('gc.backdrop', [])
.directive('backdrop', [
  '$window',
  function backdropDirective($window) {

    return {
      controller: function backdropController($element) {
        this.backdrop = new $window.Dialog.Backdrop({
          el: $element[0]
        });
      }
    };

  }
]);

'use strict';

angular.module('gc.dialogController', [])
.controller('DialogController',
  ['$scope', '$element', '$attrs', '$location',
  function DialogController($scope, $element, $attrs, $location) {

    // Creates an element and appends it to the body
    $scope.dialog = {};

    $scope.hideDialog = function hideDialog() {
      if ($scope.$root.$$phase) {
        $scope.show = false;
      } else {
        $scope.$apply(function() {
          $scope.show = false;
        });
      }
    };

    $scope.$watch(function dialogPathWatch(){
      return $location.url();
    }, function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.hideDialog();
      }
    });

    // Watch the variable bound to show
    $scope.$watch('show', function dialogShowWatch(isShown) {
      if (isShown) {
        $scope.dialog.show();
      } else {
        $scope.dialog.hide();
      }
    });

    // Cleanup dialog when the view gets torn down
    $scope.$on('$destroy', function dialogDestroy(){
      $scope.dialog.remove();
    });
  }]);

'use strict';

angular.module('gc.dialog', [
  'gc.backdrop',
  'gc.dialogController',
  'dialog-template.html',
  'dialog-empty-template.html'
]).directive('dialog',
  ['$rootScope', '$window', '$timeout', '$animate',
  function dialogDirective($rootScope, $window, $timeout, $animate) {
    var Dialog = $window.Dialog;

    var DEFAULT_TMPL = 'dialog-template.html';
    var EMPTY_TMPL = 'dialog-empty-template.html';

    return {
      restrict: 'E',
      templateUrl: function(element, attrs) {
        var templateUrl = attrs.templateUrl;
        if (templateUrl === 'empty') { return EMPTY_TMPL; }
        else { return templateUrl || DEFAULT_TMPL; }
      },
      replace: true,
      transclude: true,
      require: '^backdrop',
      controller: 'DialogController',
      scope: {
        title: '@',
        cancelText: '@',
        onHide: '&',
        show: '=',
        options: '&'
      },
      link: function dialogLink(scope, element, attrs, backdropController) {
        var options = {
          preventHideOnClick: true
        };
        var opts = angular.extend({}, options, scope.options());

        // Creates an element and appends it to the body
        scope.dialog = new Dialog(opts);

        // Move the dialog element inside the created dialog element
        scope.dialog.append(element[0]);

        scope.backdrop = backdropController.backdrop;

        $rootScope.$on('closeDialog', scope.hideDialog);

        function clickOutsideAnimation(event) {
          if (element[0] && !element[0].contains(event.target)) {
            var PULSE_CLASS = 'is-pulsing';

            $animate.addClass(element, PULSE_CLASS);
            setTimeout(function() {
              $animate.removeClass(element, PULSE_CLASS);
            }, 500);
          }
        }

        scope.dialog.on(Dialog.HIDE, function dialogOnHide() {
          document.removeEventListener('click', clickOutsideAnimation, true);
          scope.onHide();
          scope.backdrop.hide();
          scope.hideDialog();
        }).on(Dialog.SHOW, function dialogOnShow() {
          scope.backdrop.show();
          document.addEventListener('click', clickOutsideAnimation, true);
        });
      }
    };

  }]);

'use strict';

angular.module('gc.dialogHandler', [])
.factory('DialogHandler', [
  '$rootScope', function DialogHandler($rootScope) {

    return {
      hide: function hideDialog() {
        $rootScope.$emit('closeDialog');
      }
    };

  }
]);

angular.module('dialog-empty-template.html', []).run(function($templateCache) {
  $templateCache.put('dialog-empty-template.html',
    '<div class="dialog__inner dialog__inner--empty" ng-transclude=""></div>');
});

angular.module('dialog-template.html', []).run(function($templateCache) {
  $templateCache.put('dialog-template.html',
    '<div class="dialog-wrapper"><div class="dialog__header center-header"><div class="center-header__side"><button class="dialog__header__close btn btn--small btn--hollow" ng-click="hideDialog()">{{ cancelText || \'Cancel\' }}</button></div><div class="center-header__title"><h1 class="dialog__header__title u-text-h4" id="dialog-title">{{ title }}</h1></div><div class="center-header__side"></div></div><div class="dialog__inner" ng-transclude=""></div></div>');
});
