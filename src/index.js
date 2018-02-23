import './index.less';
import components from './components';
import services from './services';

let module = angular.module('app', [
    services.name,
    components.name
]);

angular.element(() => {
    angular.bootstrap(document, [module.name]);
});
