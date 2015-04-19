///<reference path="../player/lib/common/jquery.d.ts"/>
///<reference path="jasmine.d.ts"/>
var PageLoader;
(function (_PageLoader) {
    _PageLoader.$;
    _PageLoader.$$;
    function setJQuery(externalJQuery) {
        _PageLoader.$ = externalJQuery;
        _PageLoader.$$ = externalJQuery;
    }
    _PageLoader.setJQuery = setJQuery;
    var PageLoader = (function () {
        function PageLoader(fixturePrefix) {
            this.callbacks = [];
            this.fixtures = jasmine.getFixtures();
            this.fixturePrefix = fixturePrefix || 'base/';
            this.pagesUrlPrefix = this.getHost() + this.fixturePrefix;
        }
        PageLoader.prototype.loadPage = function (name) {
            this.fixtures.fixturesPath = this.fixturePrefix;
            this.fixtures.load(name);
            this.fixIframeSource();
        };
        PageLoader.prototype.loaded = function (callback) {
            this.callbacks.push(callback);
        };
        PageLoader.prototype.fixIframeSource = function () {
            // Think of the main page as the first iframe
            this.iframeCounter = 1;
            // TODO: add support for frameset
            this.fixIframeSourceRecursive(_PageLoader.$('body'));
        };
        PageLoader.prototype.fixIframeSourceRecursive = function (parent) {
            var _this = this;
            var elements = parent.find('[data-page-name]');
            elements.each(function (i, e) {
                _this.incIframeCount();
                var jElement = _PageLoader.$(e);
                var name = jElement.attr('data-page-name');
                jElement.load(_this.makeCallback());
                var path = _this.getAbsoluteUrl(name);
                jElement.attr('src', path);
            });
            this.decIframeCount();
        };
        PageLoader.prototype.makeCallback = function () {
            var _this = this;
            return function (e) {
                var frame = _PageLoader.$(e.target);
                var contents = frame.contents();
                _this.fixIframeSourceRecursive(contents);
            };
        };
        PageLoader.prototype.getAbsoluteUrl = function (name, overridePrefixUrl) {
            var selectedPrefix = (overridePrefixUrl ? overridePrefixUrl : this.pagesUrlPrefix);
            var pageSrc = selectedPrefix + name;
            return pageSrc;
        };
        PageLoader.prototype.getHost = function () {
            var location = document.location;
            return (location.origin ? location.origin : location.protocol + "//" + location.host) + '/';
        };
        PageLoader.prototype.decIframeCount = function () {
            this.iframeCounter--;
            if (this.iframeCounter == 0) {
                this.raiseLoadFinished();
            }
        };
        PageLoader.prototype.incIframeCount = function () {
            this.iframeCounter++;
        };
        PageLoader.prototype.raiseLoadFinished = function () {
            _PageLoader.$.each(this.callbacks, function (i, cb) {
                cb();
            });
        };
        return PageLoader;
    })();
    _PageLoader.PageLoader = PageLoader;
})(PageLoader || (PageLoader = {}));
