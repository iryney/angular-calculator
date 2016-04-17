var app = angular.module("calculator", ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('simple', {
        url: '/',
        templateUrl: 'templates/simple.html'
    })
    .state('advanced', {
      url: "/advanced",
      templateUrl: "templates/advanced.html"
    })
});

app.controller("mainCtrl", ['$scope', '$location', '$state', function($scope, $location, $state) {
    $scope.modeBtn = $location.url() == '/advanced' ? 'Simple' : 'Advanced';
    $scope.state = $location.url() == '/advanced' ? 'advanced' : 'simple';
    $scope.displayExpression = '';
    $scope.expression = null;
    $scope.isDot = false;
    $scope.changeMode = function(){
        $scope.state = $scope.state == 'advanced' ? 'simple' : 'advanced';
        $state.go($scope.state);
        $scope.modeBtn = $scope.modeBtn == 'Advanced' ? 'Simple' : 'Advanced';
    }
    $scope.digitPressed = function(digit) {
        if (digit === '.') {
            if (!$scope.isDot) {
                $scope.isDot = true;
            } else{
                return;
            }
        }
        $scope.displayExpression = $scope.displayExpression.concat(digit);
    }
    $scope.binaryOperationPressed = function(operation) {
        $scope.lastChar = $scope.displayExpression[$scope.displayExpression.length - 1];
        if(isNaN($scope.lastChar)) {
            $scope.displayExpression = $scope.displayExpression.replace(/[^.]$/, operation);
            return;
        }
        $scope.expression = eval($scope.displayExpression);
        $scope.isDot = false;
        $scope.displayExpression = $scope.displayExpression.concat(operation);
    }
    $scope.unaryOperationPressed = function(operation) {
        $scope.expression = eval($scope.displayExpression);
        $scope.isDot = false;
        $scope.result = '';
        switch(operation) {
            case 'sin':
                $scope.result = Math.sin($scope.expression);
                break;
            case 'cos':
                $scope.result = Math.cos($scope.expression);
                break;
            case 'pow':
                $scope.result = Math.pow($scope.expression, 2);
                break;
            case 'sqrt':
                if ($scope.expression < 0) {
                    alert("Can't calculate square root of negative number");
                    break;
                }
                $scope.result = Math.sqrt($scope.expression);
                break;
            case 'factorial':
                if ($scope.expression < 0) {
                    alert("Can't calculate factorial of negative number");
                    break;
                }
                $scope.result = $scope.factorial($scope.expression);
            default:
                break;          
        }
        $scope.displayExpression = String($scope.result || $scope.displayExpression);
    }
    $scope.factorial = function(n) {
        return n ? n * $scope.factorial(n - 1) : 1;
    }
    $scope.calculate = function() {
        $scope.lastChar = $scope.displayExpression[$scope.displayExpression.length - 1];
        if(isNaN($scope.lastChar)) {
            return;
        }
        $scope.displayExpression = String(eval($scope.displayExpression));
        $scope.isDot = false;
    }
    $scope.save = function() {
        $scope.expression = eval($scope.displayExpression);
        $scope.displayExpression = '';
        localStorage.setItem('result', $scope.expression);
        $scope.isDot = false;
    }
    $scope.clearAll = function() {
        $scope.displayExpression = '';
        $scope.isDot = false;
    }
    $scope.clearMemory = function() {
        $scope.displayExpression = '';
        $scope.isDot = false;
        localStorage.removeItem('result');
    }
    $scope.clearPrevious = function() {
        $scope.displayExpression = $scope.displayExpression.substring(0, $scope.displayExpression.length - 1);
        $scope.isDot = false;
    }
}]);