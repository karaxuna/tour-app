function googleMapSrvc() {
    var provider = this;
    provider.callbackName = 'googleMapInitialized';

    provider.$get = ['$q', '$window', function (q, window) {
        var isInitialized = false;

        function promisify(fn) {
            var deferred = q.defer();
            fn(function (err, result) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(result);
                }
            });
            return deferred.promise;
        }

        function waitForInitialisation(callback) {
            (function check(timeout) {
                if (isInitialized) {
                    callback();
                } else {
                    setTimeout(check, timeout);
                }
            })(30);
        }

        function init() {
            return promisify(function (callback) {
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        waitForInitialisation(callback);
                    } else {
                        js = d.createElement(s); js.id = id;
                        window[provider.callbackName] = function () {
                            isInitialized = true;
                            callback();
                        };
                        js.src = '//maps.googleapis.com/maps/api/js?callback=' + provider.callbackName;
                        fjs.parentNode.insertBefore(js, fjs);
                    }
                }(document, 'script', 'google-map'));
            });
        }

        return {
            init: init
        };
    }];
}

export default googleMapSrvc;
