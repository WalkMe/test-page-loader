/// <reference path="../player/lib/common/jquery.d.ts" />
/// <reference path="jasmine.d.ts" />
declare module PageLoader {
    var $: JQueryStatic;
    var $$: JQuery;
    function setJQuery(externalJQuery: any): void;
    class PageLoader {
        private callbacks;
        private fixtures;
        private iframeCounter;
        private pagesUrlPrefix;
        private fixturePrefix;
        constructor(fixturePrefix?: string);
        loadPage(name: string): void;
        loaded(callback: () => any): void;
        private fixIframeSource();
        private fixIframeSourceRecursive(parent);
        private makeCallback();
        private getAbsoluteUrl(name, overridePrefixUrl?);
        private getHost();
        private decIframeCount();
        private incIframeCount();
        private raiseLoadFinished();
    }
}
