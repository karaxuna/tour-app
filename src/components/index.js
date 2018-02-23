import cdGoogleMapComponent from './cdGoogleMap';
import cdTourManagerComponent from './cdTourManager';

let module = angular.module('app.components', [])
    .component('cdGoogleMap', cdGoogleMapComponent)
    .component('cdTourManager', cdTourManagerComponent);

export default module;
