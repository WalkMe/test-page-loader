///<reference path="../player/lib/common/jquery.d.ts"/>
///<reference path="jasmine.d.ts"/>

module PageLoader {
	export var $: JQueryStatic;
    export var $$: JQuery;

    export function setJQuery(externalJQuery: any) {
        $ = externalJQuery;
        $$ = externalJQuery;
    }

	export class PageLoader {
		private callbacks: Array<()=>any>;
		private fixtures: any;
		private iframeCounter: number;
		private pagesUrlPrefix: string;
		private fixturePrefix: string;

		constructor(fixturePrefix?: string) {
			this.callbacks = [];
			this.fixtures = jasmine.getFixtures();
			this.fixturePrefix = fixturePrefix || 'base/';
			this.pagesUrlPrefix = this.getHost() + this.fixturePrefix;
		}

		loadPage(name: string) {
		    this.fixtures.fixturesPath = this.fixturePrefix;
		    this.fixtures.load(name);
		    this.fixIframeSource();
		}

		destroyPage() {
			$('body').find('[data-page-name]').remove();
		}

		loaded(callback: ()=>any) {
			this.callbacks.push(callback);
		}

		private fixIframeSource() {
			// Think of the main page as the first iframe
			this.iframeCounter = 1;
			
			// TODO: add support for frameset
			this.fixIframeSourceRecursive($('body'));
		}

		private fixIframeSourceRecursive(parent: JQuery) {
			var _this = this;
			var elements = parent.find('[data-page-name]');

			elements.each(function(i, e) {		
				_this.incIframeCount();
				var jElement = $(e);			
				var name = jElement.attr('data-page-name');
				jElement.load(_this.makeCallback());
				var path = _this.getAbsoluteUrl(name);
				jElement.attr('src', path);			
			});		
			
			this.decIframeCount();
		}

		private makeCallback() {
			var _this = this;
			return function(e) {
				var frame = $(e.target);
				var contents = frame.contents();
				_this.fixIframeSourceRecursive(contents);
			};
		}

		private getAbsoluteUrl(name: string, overridePrefixUrl?: string) {
			var selectedPrefix = (overridePrefixUrl ? overridePrefixUrl : this.pagesUrlPrefix);
			var pageSrc = selectedPrefix + name;
			return pageSrc;
		}

		private getHost(): string {
			var location: any = document.location;
			return (location.origin ? location.origin : location.protocol + "//" + location.host) + '/';
		}

		private decIframeCount() {	
			this.iframeCounter--;
			if(this.iframeCounter == 0)	{
				this.raiseLoadFinished();
			}
		}
		
		private incIframeCount() {
			this.iframeCounter++;		
		}
		
		private raiseLoadFinished() {        
			$.each(this.callbacks, function(i, cb: ()=>any) {
				cb();
			});
		}
	}
}