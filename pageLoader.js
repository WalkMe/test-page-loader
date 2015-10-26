///<reference path="../player/lib/common/jquery.d.ts"/>
///<reference path="jasmine.d.ts"/>
var PageLoader;
(function (PageLoader_1) {
    function setJQuery(externalJQuery) {
        PageLoader_1.$ = externalJQuery;
        PageLoader_1.$$ = externalJQuery;
    }
    PageLoader_1.setJQuery = setJQuery;
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
        PageLoader.prototype.destroyPage = function () {
            PageLoader_1.$('body').find('[data-page-name]').remove();
        };
        PageLoader.prototype.loaded = function (callback) {
            this.callbacks.push(callback);
        };
        PageLoader.prototype.fixIframeSource = function () {
            this.iframeCounter = 1;
            this.fixIframeSourceRecursive(PageLoader_1.$('body'));
        };
        PageLoader.prototype.fixIframeSourceRecursive = function (parent) {
            var _this = this;
            var elements = parent.find('[data-page-name]');
            elements.each(function (i, e) {
                _this.incIframeCount();
                var jElement = PageLoader_1.$(e);
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
                var frame = PageLoader_1.$(e.target);
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
            PageLoader_1.$.each(this.callbacks, function (i, cb) {
                cb();
            });
        };
        return PageLoader;
    })();
    PageLoader_1.PageLoader = PageLoader;
})(PageLoader || (PageLoader = {}));
//# sourceMappingURL=pageLoader.js.map