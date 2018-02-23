import googleMapSrvc from './googleMapSrvc';
import storageSrvc from './storageSrvc';

let module = angular.module('app.factories', [])
    .provider('googleMapSrvc', googleMapSrvc)
    .factory('storageSrvc', storageSrvc);

export default module;
