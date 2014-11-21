/*
@identifier org.meta.web.Location
@extend org.meta.standard.Object
@require org.meta.web.URL
@description An object wrapper for the `location` property of the window object in a browser environment.
@link https://developer.mozilla.org/en-US/docs/Web/API/Location
*/
{
		main: function main(location) { this.location = location ; },
		global:
		{
				create: function create( ) { return new this(URL.create(constant('GLOBAL_OBJECT').location.href)) ; }
		},
		local:
		{
//				toURL: function toURL( ) { return URL.create(this.location.href) ; }
				getScheme: function getProtocol( ) { return this.location.protocol ; },
				getAuthority: function getHostname( ) { return this.location.hostname ; },
				getHost: function getHost( ) { return this.location.hostname ; },
				getPort: function getPort( ) { return this.location.port ; },
				getPath: function getPort( ) { return this.location.pathname ; },
				getQuery: function getQuery( ) { return this.location.search ; },
				getFragment: function getFragment( ) { return this.location.hash ; },
				toURL: function toURL( ) { return this.location.href ; },
				change: (function( ) {
				
					// variables
					
					var l = constant('GLOBAL_OBJECT').location ;
					
					//
					
					
						if(isSet('assign', l)) return function change(url) { this.location.assign(url) ; }
						else return function change(url) { this.location = url ; }

				})( )
		}
}