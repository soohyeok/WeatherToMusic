var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/app');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('app', {
            url: '/app',
            // templateUrl: 'partial-home.html'
            templateUrl: '/templates/form.html',
            controller: 'formController'
        })
        .state('songs', {
          url: '/songs',
          templateUrl: 'templates/songs.html',
          controller: 'songsController'
        })
        .state('callback', {
          url:'/callback',
          template:'<h1>...Loading</h1>',
          controller: 'callbackController'
        })
        
});

routerApp.service('usernameService', function(){
  var username='', addUsername, getUsername;
  addUsername = function(name){
    username = name;
  }

  getUsername = function(){
    return username;
  }

  return {
    addUsername,
    getUsername
  }
})

routerApp.controller('formController', function($scope, $state , $http, $window, usernameService) {
    console.log('Controller called');
    if($window.location.href.includes('callback')){
      $state.go('callback');
    }
    $scope.sendData = function(){
    console.log($scope.username);
    console.log($scope.city);

    $http({
      url: 'http://localhost:5000/location',
      method:'POST',
      data:{
        username: $scope.username,
        city: $scope.city
      }
    })
    .then((value) => {
      console.log('All good', value);
      if(value.data.type === 'link')
      {
        console.log('Trying redirection');
        $window.location.href = value.data.url;
        // $state.go('songs');
      }
      else if(value.data.type==='status' && value.data.status==='OK'){
        // console.log('WTF', Object.keys(value));
        usernameService.addUsername(value.data.user)
        $state.go('songs')
      }
    })
    .catch((err) => {
      console.log('Not good: ', err);
    })
    }
});

routerApp.controller('songsController', function($scope, $state, $http, usernameService){
  console.log('Songs controller executed');
  $http({
    url: 'http://localhost:5000/songs',
    method: 'POST',
    data: {
      username: usernameService.getUsername()
    }
  })
  .then((values) => {
    console.log('Got: ', values);
    $scope.songs = values.data.filter((datum ) => {
      return {
        link: datum.external_urls.spotify,
        name: datum.name
      }
    })
  })
  .catch((err) => {
    console.log('Error: ', err);
  })
})

routerApp.controller('callbackController', function($scope, $state, $http, $window){
  console.log('Callback controller executed');
  const query = $window.location.href.split('?')[1].replace('#/app','');
  $http({
    method:'POST',
    url: 'http://localhost:5000/callback?'+query
  })
  .then((value) => {
    if(value.data.type==='link' && value.data.url==='/songs'){
      $state.go('songs');
    }
  })
  .catch((err) => {
    console.log('Err in callback: ', err)
  })
});