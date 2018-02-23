import templateUrl from './index.html';

controller.$inject = [
    '$scope',
    'storageSrvc',
    'googleMapSrvc'
];

function controller(scope, storageSrvc, googleMapSrvc) {
    let geocoder;

    googleMapSrvc.init('AIzaSyCH2bsMY1eQunKk8Nbij1lTGFLRiVmpP2Q').then(() => {
        geocoder = new google.maps.Geocoder;
        scope.mapReady = true;
    });

    storageSrvc.bindToScope(scope, 'waypoints', []);
    storageSrvc.bindToScope(scope, 'tours', []);

    scope.centerLocation = {
        lng: 44.791000,
        lat: 41.725000
    };

    scope.mapReady = false;
    scope.initialZoom = 14;
    scope.maxZoom = 18;
    scope.markers = [];
    scope.showDirections = true;

    scope.addWaypoint = waypoint => {
        scope.markers.push({
            position: waypoint.location,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
    };

    scope.saveWayPoint = () => {
        geocoder.geocode({ 'location': scope.centerLocation }, function (results, status) {
            if (status === 'OK' && results.length) {
                scope.$apply(() => {
                    let waypoint = {
                        address: results[0].formatted_address,
                        location: results[0].geometry.location.toJSON()
                    };

                    scope.waypoints.push(waypoint);

                    scope.markers.push({
                        position: waypoint.location,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    });
                });
            }
            else {
                console.error('Geocoder failed.');
            }
        });
    };

    scope.saveTour = () => {
        scope.tours.push({
            waypoints: scope.waypoints.slice(0)
        });

        scope.markers.length = 0;
    };

    scope.clearPersistentData = () => {
        scope.waypoints = [];
        scope.tours = [];
    };
}

export default {
    templateUrl,
    controller
};
