storageSrvc.$inject = [
    '$q'
];

/*
 * Made with promises, because storage operations will be async in future
 */
function storageSrvc(q) {
    let getItem = (key) => {
        let json = localStorage.getItem(key);
        let value;

        try {
            value = JSON.parse(json);
        }
        catch (err) {
            value = null;
        }

        return q.resolve(value);
    };

    let setItem = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
        return q.resolve();
    };

    let bindToScope = (scope, key, initialValue) => {
        let $watch = initialValue instanceof Array ? scope.$watchCollection : scope.$watch;
        scope[key] = initialValue;

        return getItem(key).then(value => {
            if (value) {
                scope[key] = value;
            }
            
            $watch.call(scope, key, (newValue, oldValue) => {
                if (newValue !== oldValue) {
                    setItem(key, newValue);
                }
            });
        });
    };

    return {
        getItem,
        setItem,
        bindToScope
    };
}

export default storageSrvc;
