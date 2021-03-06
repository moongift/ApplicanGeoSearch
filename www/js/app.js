// Generated by CoffeeScript 1.8.0
angular.module("ionicApp", ["ionic"]).factory('GeoSearchService', function($q, $timeout) {
  return {
    getCurrentPosition: function() {
      var deferred, options;
      deferred = $q.defer();
      options = {
        maximumAge: 10000,
        timeout: 30000,
        enableHighAccuracy: false
      };
      applican.geolocation.getCurrentPosition(function(res) {
        return deferred.resolve(res);
      }, function(res) {
        return deferred.reject(res);
      }, options);
      return deferred.promise;
    }
  };
}).factory('FoursqureService', function($q, $http, $timeout) {
  return {
    getVenues: function(lat, lon) {
      var client_id, deferred, options, secret;
      deferred = $q.defer();
      client_id = "FOURSQUARE_CLIENT_KEY";
      secret = "FOURSQUARE_SECRET_KEY";
      options = {
        timeout: 10000,
        headers: {},
        verboseoutput: true
      };
      applican.http.get("https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lon + "&client_id=" + client_id + "&client_secret=" + secret + "&v=20140715&limit=50", options, function(res) {
        res = JSON.parse(res);
        return deferred.resolve(res.response);
      }, function(res) {
        console.log(res);
        return deferred.reject(res);
      });
      return deferred.promise;
    }
  };
}).controller("MyCtrl", function($scope, $ionicPopover, GeoSearchService, FoursqureService) {
  $scope.data = {
    showDelete: false
  };
  $ionicPopover.fromTemplateUrl("my-popover.html", {
    scope: $scope
  }).then(function(popover) {
    return $scope.popover = popover;
  });
  $scope.openPopover = function($event, item) {
    console.log($event, item);
    console.log($scope.popover);
    $scope.item = item;
    return $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    return $scope.popover.hide();
  };
  $scope.$on("$destroy", function() {
    return $scope.popover.remove();
  });
  $scope.$on("popover.hidden", function() {});
  $scope.$on("popover.removed", function() {});
  $scope.edit = function(item) {
    return alert("Edit Item: " + item.id);
  };
  $scope.share = function(item) {
    return alert("Share Item: " + item.id);
  };
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    return $scope.items.splice(toIndex, 0, item);
  };
  $scope.onItemDelete = function(item) {
    return $scope.items.splice($scope.items.indexOf(item), 1);
  };
  return GeoSearchService.getCurrentPosition().then(function(res) {
    var c;
    c = res.coords;
    return FoursqureService.getVenues(c.latitude, c.longitude).then(function(res) {
      $scope.items = [];
      console.log(res.venues);
      return angular.forEach(res.venues, function(venue) {
        var icon, options;
        options = {
          title: venue.name
        };
        if (venue.categories.length > 0) {
          icon = venue.categories[0].icon;
          options.img = "" + icon.prefix + "bg_88" + icon.suffix;
        }
        options.lat = venue.location.lat;
        options.lng = venue.location.lng;
        return $scope.items.push(options);
      });
    });
  });
});
