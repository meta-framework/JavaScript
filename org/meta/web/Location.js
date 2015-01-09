/*
@identifier org.meta.web.Location
@extend org.meta.logic.event.EventTarget
@require org.meta.util.StringBuilder, org.meta.web.URL, org.meta.web.dom.event.Events, org.meta.logic.event.EventListener
@description An object wrapper for the `location` property of the window object in a browser environment.
@link https://developer.mozilla.org/en-US/docs/Web/API/Location
@todo research whether polyfills for some parts of the getters are necessary, implement in case; setters for the URL parts, which modify the URL.
*/
{
		main: function main(window)
		{
				this.target = window ;
				this.listeners = { } ;
		},
		global:
		{
				EVENT_BEFORE_CHANGE: 'before-change',
				EVENT_AFTER_CHANGE: 'after-change',
//				EVENT_HASHCHANGE: 'hash-change', // location change using either the the `GLOBAL_OBJECT.location` property or the browser history
//				EVENT_URLCHANGE: 'url-change', // location change using the `GLOBAL_OBJECT.location` property
//				EVENT_URLREPLACE: 'url-replace', // location replacement using the `GLOBAL_OBJECT.location` property
				/**
				* @todo polyfill for non HTML5 compliant browsers
				*/
				create: function create(window)
				{
				
					// preconditions
					
						assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be DOM window.') ;
				
					// variables
					
					var location ;
					
					//
					
						location = new this(window) ;
						callback = (function( ) { // use a function expression to create a hidden variable (`_location`) for the previous location and specify the callback logic
								var _location = location.getLocation( ) ;
								return function( ) {

									var __location = _location;
									
										/*Create a transition detail object./
										detail = Location.createTransitionDetail(location, _location) ;
									
										o = detail.new_location ; // the transition properties need to be swapped since we are transitioning from the location stored in the hidden variable to the current location
										detail.new_location = detail.old_location ;
										detail.old_location = o ;
*/
									
										_location = location.getLocation( ) ; // update the hidden location variable

										location.triggerEvent(Location.EVENT_AFTER_CHANGE, {detail: {old_location: __location, new_location: _location}}) ;

								}
						})( ) ;
					
						Events.onHashChange(window, callback) ; // add a listener for the hash change event
					
					// return
					
						return location ;

				},
				/**
				* @param (Location) location A location instance.
				* @param (String) url The location to transition to.
				* @return (Object) An object containing details of the URL transition.
				* @deprecated: excessive
				*/
				_createTransitionDetail: function createTransitionDetail(location, url)
				{
				
					// variables
					
					var detail,
						u ;
					
					//
					
						u = URL.create(url) ; // create an instance of `org.meta.web.URL` in order to analyze the referal URL

						detail = {
								old_location:
								{
										url: location.getLocation( ),
										scheme: location.getScheme( ),
										authority: location.getAuthority( ),
										host: location.getHost( ),
										port: location.getPort( ),
										file_identifier: location.getFileIdentifier( ),
										path: location.getPath( ),
										query: location.getQuery( ),
										fragment: location.getFragment( )
								},
								new_location:
								{
										url: url,
										scheme: u.getScheme( ),
										authority: u.getAuthority( ),
										host: u.getHost( ),
										port: u.getPort( ),
										file_identifier: u.getFileIdentifier( ),
										path: u.getPath( ),
										query: u.getQuery( ),
										fragment: u.getFragment( )
								}
						} ;
					
					// return
					
						return detail ;
		 
				},
				getLocation: function getLocation(window) { return window.location.href ; },
				setLocation: (function( ) {
						if(isSet('assign', DEFAULT_WINDOW.location)) return function(window, url) { window.location.assign(url) ; }
						else return function(url) { window.location = url ; }
				})( ),
				getScheme: function getScheme(window) { return window.location.protocol ; },
				getAuthority: function getAuthority(window) { return window.location.hostname ; },
				getHost: function getHost(window) { return window.location.hostname ; },
				getPort: function getPort(window)
				{
				
					// variables
					
						var s = window.location.port ;
					
					//
					
						if(stringEmpty(s)) return -1 ;
						else return parseInt(s) ;
					
				},
				getPath: function getPath(window) { return window.location.pathname ; },
				getQuery: function getQuery(window)
				{
				
					// variables
					
					var query ;
					
					//
					
						if((query = window.location.search) !== '') return query.substring(1) ;
						else return null ;
			
				},
				getFragment: function getFragment(window)
				{
				
					// variables
					
					var fragment ;
					
					//
					
						if((fragment = window.location.hash) !== '') return fragment.substring(1) ;
						else return null ;
	
				},
				/**
				* Get the URL substring which identifies the requested file.
				* @contract This operation is ought to concatenate the file path, query and fragment components of the URL.
				*/
				getFileIdentifier: function getFileIdentifier(window)
				{

					// variables

					var builder,
						s ;

					//
						if((s = this.getPath( )))
						{
						
								builder = new StringBuilder(s) ;

								if((s = this.getQuery( ))) builder.append('?')
								.append(s) ;
								if((s = this.getFragment( ))) builder.append('#')
								.append(s) ;
							
								return builder.build( ) ;
							
						}
					
					// return

						return null ;

				}
		},
		local:
		{
				getLocation: function getLocation( ) { return Location.getLocation(this.target) ; },
				setLocation: function setLocation(url) { Location.setLocation(this.target, url) ; },
				getScheme: function getScheme( ) { return Location.getScheme(this.target) ; },
				getAuthority: function getAuthority( ) { return Location.getAUthority(this.target) ; },
				getHost: function getHost( ) { return Location.getHost(this.target) ; },
				getPort: function getPort( ) { return Location.getPort(this.target) ; },
				getPath: function getPath( ) { return Location.getPath(this.target) ; },
				getQuery: function getQuery( ) { return Location.getQuery(this.target) ; },
				getFragment: function getFragment( ) { return Location.getFragment(this.target) ; },
				/**
				* Get the URL substring which identifies the requested file.
				* @contract This operation is ought to concatenate the file path, query and fragment components of the URL.
				* @deprecated
				*/
				getFileIdentifier: function getFileIdentifier( ) { return Location.getFileIdentifier(this.target) ; },
				change: function change(url, push)
				{

					// variables
					
					var properties,
						detail,
						s,
						u ;
					
					//

						properties = {detail: {old_location: this.getLocation( ), new_location: url}} ;
						detail = properties.detail ;

						this.triggerEvent(Location.EVENT_BEFORE_CHANGE, properties) ;
				 
						if(push && (detail.old_location.host === detail.new_location.host)) this.setLocation(this.getScheme( ) + '//' + this.getAuthority( ) + '/#' + this.getFileIdentifier( )) ; // the location change is a history pushed internal referal
						else this.setLocation(url) ; // either not history pushed or external referal
				 
						this.triggerEvent(Location.EVENT_AFTER_CHANGE, properties) ;
				
				},
				/**Change the current location URL without creating a history entry.*/
				replace: function replace(url)
				{
				
					// variables
					
					var properties ;
					
					//

						properties = {detail: {old_location: this.getLocation( ), new_location: url}} ;
				
						this.triggerEvent(Location.EVENT_BEFORE_CHANGE, properties) ;
					
						GLOBAL_OBJECT.location.replace(url) ;

						this.triggerEvent(Location.EVENT_AFTER_CHANGE, properties) ;
						
				},
				beforeChange: function onChange(callback)
				{

					//

						this.addListener(Location.EVENT_BEFORE_CHANGE, EventListener.create(callback)) ;

				},
				afterChange: function onChange(callback)
				{

					//

						this.addListener(Location.EVENT_AFTER_CHANGE, EventListener.create(callback)) ;

				},
				/**
				* @contract Creates a url instance for the location URL's properties.
				*/
				toURL: function toURL( )
				{
/*@qnd*/
return URL.create(this.getLocation( )) ;
				}
		}
}