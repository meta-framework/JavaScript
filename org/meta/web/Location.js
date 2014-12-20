/*
@identifier org.meta.web.Location
@extend org.meta.Object
@require org.meta.web.URL
@description An object wrapper for the `location` property of the window object in a browser environment.
@link https://developer.mozilla.org/en-US/docs/Web/API/Location
@todo research whether polyfills for some parts of the getters are necessary, implement in case
*/
{
		global:
		{
				getScheme: function getScheme( ) { return GLOBAL_OBJECT.location.protocol ; },
				getAuthority: function getAuthority( ) { return GLOBAL_OBJECT.location.hostname ; },
				getHost: function getHost( ) { return GLOBAL_OBJECT.location.hostname ; },
				getPort: function getPort( ) { return GLOBAL_OBJECT.location.port ; },
				getPath: function getPath( ) { return GLOBAL_OBJECT.location.pathname ; },
				getQuery: function getQuery( ) { return GLOBAL_OBJECT.location.search ; },
				getFragment: function getFragment( ) { return GLOBAL_OBJECT.location.hash ; },
				change: (function( ) {
				
					// variables
					
					var l = GLOBAL_OBJECT.location ;
					
					//
					
					
						if(isSet('assign', l)) return function change(url) { GLOBAL_OBJECT.location.assign(url) ; }
						else return function change(url) { GLOBAL_OBJECT.location = url ; }

				})( ),
				/**Change the current location without creating a history entry.*/
				replace: function replace(url) { GLOBAL_OBJECT.location.replace(url) ; },
				toURL: function toURL( ) { return GLOBAL_OBJECT.location.href ; }
		},
		/*@deprecated: local properties were globalized*/
		local:
		{
				/**
				* @type org.meta.web.URL
				* @deprecated
				*/
				location: null,
//				toURL: function toURL( ) { return URL.create(this.location.href) ; }
				/**@deprecated: globalized*/
				getScheme: function getProtocol( ) { return GLOBAL_OBJECT.location.protocol ; },
				/**@deprecated: globalized*/
				getAuthority: function getHostname( ) { return GLOBAL_OBJECT.location.hostname ; },
				/**@deprecated: globalized*/
				getHost: function getHost( ) { return this.location.hostname ; },
				/**@deprecated: globalized*/
				getPort: function getPort( ) { return this.location.port ; },
				/**@deprecated: globalized*/
				getPath: function getPort( ) { return this.location.pathname ; },
				/**@deprecated: globalized*/
				getQuery: function getQuery( ) { return this.location.search ; },
				/**@deprecated: globalized*/
				getFragment: function getFragment( ) { return this.location.hash ; },
				/**@deprecated: globalized, returns org.meta.web.URL*/
				toURL: function toURL( ) { return this.location.href ; }
		}
}