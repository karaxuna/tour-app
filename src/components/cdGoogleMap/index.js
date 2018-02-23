import templateUrl from './index.html';
import emptyMarkerImageSrc from './icons/empty-marker.png';

controller.$inject = [
    '$scope',
    '$element',
    '$attrs',
    'googleMapSrvc'
];

function controller(scope, element, attrs, googleMapSrvc) {
    var map,
        centerMarker,
        ngModel,
        directionsService = new google.maps.DirectionsService();

    let init = () => {
        map = new google.maps.Map(element.children().get(0), {
            maxZoom: this.maxZoom
        });

        centerMarker = new google.maps.Marker({
            map: map,
            position: map.getCenter(),
            icon: emptyMarkerImageSrc
        });

        // Markers
        let oldMarkers = [];

        let drawStaticMarkers = () => {
            clearStaticMarkers();

            this.staticMarkers.forEach((m) => {
                oldMarkers.push(new google.maps.Marker({
                    map: map,
                    position: m.position,
                    icon: m.icon
                }));
            });
        };

        let clearStaticMarkers = () => {
            oldMarkers.forEach(oldMarker => {
                oldMarker.setMap(null);
            });

            oldMarkers.length = 0;
        };

        // Directions
        let oldDirectionDisplays = [];

        let drawDirections = () => {
            clearDirections();

            if (oldMarkers.length > 1) {
                for (let i = 0; i < oldMarkers.length; i++) {
                    if (oldMarkers.length === 2 && i === 1) {
                        break;
                    }

                    directionsService.route({
                        origin: oldMarkers[i].position,
                        destination: oldMarkers[oldMarkers.length > 2 && (i === oldMarkers.length - 1) ? 0 : (i + 1)].position,
                        travelMode: 'DRIVING'
                    }, function (directions, status) {
                        if (status == 'OK') {
                            oldDirectionDisplays.push(new google.maps.DirectionsRenderer({
                                map,
                                directions,
                                preserveViewport: true,
                                suppressMarkers: true
                            }));
                        }
                    });
                }
            }
        };

        let clearDirections = () => {
            oldDirectionDisplays.forEach(oldDirectionDisplay => {
                oldDirectionDisplay.set('directions', null);
            });

            oldDirectionDisplays.length = 0;
        };

        scope.$watchCollection('$ctrl.staticMarkers', () => {
            if (this.staticMarkers) {
                drawStaticMarkers();

                if (this.showDirections) {
                    drawDirections();
                }
            }
        });

        scope.$watch('$ctrl.showDirections', () => {
            if (this.showDirections) {
                drawDirections();
            }
            else {
                clearDirections();
            }
        });

        map.addListener('center_changed', function () {
            let center = map.getCenter();
            centerMarker.setPosition(center);
        });

        map.addListener('dragend', e => {
            let center = map.getCenter();
            ngModel.$setViewValue(center.toJSON());
        });

        ngModel.$render = () => {
            map.setCenter(ngModel.$modelValue);
            let zoom = this.initialZoom;
            map.setZoom(zoom);
        };
    };

    this.$onInit = () => {
        ngModel = this.ngModel;
        init();
    };

    scope.$on('$destroy', () => {
        google.maps.event.clearInstanceListeners(map);
    });
}

export default {
    restrict: 'E',
    require: {
        ngModel: 'ngModel',
    },
    bindings: {
        initialZoom: '=',
        maxZoom: '=',
        staticMarkers: '=',
        showDirections: '='
    },
    controller,
    templateUrl
};
