/*
@identifier org.meta.web.Location
@extend org.meta.logic.event.EventTarget
@require org.meta.util.StringBuilder, org.meta.web.URL, org.meta.web.dom.event.Events, org.meta.logic.event.EventListener
@description An object wrapper for the `location` property of the window object in a browser environment.
@link https://developer.mozilla.org/en-US/docs/Web/API/Location
@todo research whether polyfills for some parts of the getters are necessary, implement in case
*/
{
		main: function main(window)
		{
				this.target = window ;
				this.listeners = { } ;
		},
		global:
		{
				/**@deprecated*/
				EVENT_CHANGE: 'change',
				EVENT_BEFORE_CHANGE: 'before-change',
				EVENT_AFTER_CHANGE: 'after-change',
				/**@deprecated*/
				LOCATION_HASHCHANGE: 'hash-change', // location change using either the the `GLOBAL_OBJECT.location` property or the browser history
				/**@deprecated*/
				LOCATION_URLCHANGE: 'url-change', // location change using the `GLOBAL_OBJECT.location` property
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
						callback = (function( ) {
								var _location = location.getLocation( ) ;
								return function( ) {

									var detail,
										o ;
									
										/*Create a transition data object.*/
										detail = Location.createTransitionData(location, _location) ;
										o = detail.new_location ; // the transition properties have to be swapped since we are transitioning from the location stored in the hidden variable
										detail.new_location = detail.old_location ;
										detail.old_location = o ;
								
										_location = location.getLocation( ) ; // update the hidden location variable

										location.triggerEvent(Location.EVENT_AFTER_CHANGE, detail) ;

								}
						})( ) ;
					
						Events.addListener(window, Events.EVENT_LOCATION_HASHCHANGE, callback) ; // add a listener for the hash change event
					
					// return
					
						return location ;

				},
				/**
				* @param (Location) location A location instance.
				* @param (String) url The location to transition to.
				* @return (Object) An object containing a break-down of the old and new location URLs.
				*/
				createTransitionData: function createTransitionData(location, url)
				{
				
					// variables
					
					var data,
						u ;
					
					//
					
						u = URL.create(url) ; // create an instance of `org.meta.web.URL` in order to analyze the referal URL

						data = {
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
					
						return data ;
		 
				},
				/** @deprecated refactored into local property.*/
				_getScheme: function getScheme( ) { return GLOBAL_OBJECT.location.protocol ; },
				/** @deprecated refactored into local property.*/
				_getAuthority: function getAuthority( ) { return GLOBAL_OBJECT.location.hostname ; },
				/** @deprecated refactored into local property.*/
				_getHost: function getHost( ) { return GLOBAL_OBJECT.location.hostname ; },
				/** @deprecated refactored into local property.*/
				_getPort: function getPort( )
				{
				
					// variables
					
						var s = GLOBAL_OBJECT.location.port ;
					
					//
					
						if(stringEmpty(s)) return -1 ;
						else return parseInt(s) ;
					
				},
				/** @deprecated refactored into local property.*/
				_getPath: function getPath( ) { return GLOBAL_OBJECT.location.pathname ; },
				/** @deprecated refactored into local property.*/
				_getQuery: function getQuery( )
				{
				
					// variables
					
					var query ;
					
					//
					
						if((query = GLOBAL_OBJECT.location.search) !== '') return query.substring(1) ;
						else return null ;
			
				},
				/** @deprecated refactored into local property.*/
				_getFragment: function getFragment( )
				{
				
					// variables
					
					var fragment ;
					
					//
					
						if((fragment = GLOBAL_OBJECT.location.hash) !== '') return fragment.substring(1) ;
						else return null ;
	
				},
				/**
				* Get the URL substring which identifies the requested file.
				* @contract This operation is ought to concatenate the file path, query and fragment components of the URL.
				* @deprecated refactored into local property
				*/
				_getFileIdentifier: function getFileIdentifier( )
				{

					// variables

					var builder,
						s ;

					//
						builder = new StringBuilder(Location.getPath( )) ;

						if((s = Location.getQuery( )))
								builder.append('?')
								.append(s) ;
						if((s = Location.getFragment( )))
								builder.append('#')
								.append(s) ;
					
					// return

						return builder.build( ) ;

				},
				/** @deprecated refactored into local property.*/
				_toURLString: function toURLString( ) { return GLOBAL_OBJECT.location.href ; }
		},
		local:
		{
				window: null,
				getLocation: function getLocation( ) { return this.target.location.href ; },
				setLocation: (function( ) {
						if(isSet('assign', GLOBAL_OBJECT.location)) return function(url) { this.target.location.assign(url) ; }
						else return function(url) { this.target.location = url ; }
				})( ),
				getScheme: function getScheme( ) { return this.target.location.protocol ; },
				getAuthority: function getAuthority( ) { return this.target.location.hostname ; },
				getHost: function getHost( ) { return this.target.location.hostname ; },
				getPort: function getPort( )
				{
				
					// variables
					
						var s = GLOBAL_OBJECT.location.port ;
					
					//
					
						if(stringEmpty(s)) return -1 ;
						else return parseInt(s) ;
					
				},
				getPath: function getPath( ) { return GLOBAL_OBJECT.location.pathname ; },
				getQuery: function getQuery( )
				{
				
					// variables
					
					var query ;
					
					//
					
						if((query = this.target.location.search) !== '') return query.substring(1) ;
						else return null ;
			
				},
				getFragment: function getFragment( )
				{
				
					// variables
					
					var fragment ;
					
					//
					
						if((fragment = this.target.location.hash) !== '') return fragment.substring(1) ;
						else return null ;
	
				},
				/**
				* Get the URL substring which identifies the requested file.
				* @contract This operation is ought to concatenate the file path, query and fragment components of the URL.
				*/
				getFileIdentifier: function getFileIdentifier( )
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

				},
				change: function change(url, push)
				{
console.log('Location#change (%s, %s)', url, push) ;
					// variables
					
					var detail,
						s,
						u ;
					
					//

						detail = Location.createTransitionData(this, url) ;

						this.triggerEvent(Location.EVENT_BEFORE_CHANGE, data) ;
				 
						if(push && (data.old_location.host === data.new_location.host)) this.setLocation(this.getScheme( ) + '//' + this.getAuthority( ) + '/#' + this.getFileIdentifier( )) ; // the location change is a history pushed internal referal
						else this.setLocation(url) ; // either not history pushed or external referal
				 
						this.triggerEvent(Location.EVENT_AFTER_CHANGE, detail) ;
				
				},
				/**Change the current location URL without creating a history entry.*/
				replace: function replace(url)
				{
				
					// variables
					
					var data ;
					
					//

						data = Location.createTransitionData(this, url) ;
				
						this.triggerEvent(Location.EVENT_BEFORE_CHANGE, data) ;
					
						GLOBAL_OBJECT.location.replace(url) ;

						this.triggerEvent(Location.EVENT_AFTER_CHANGE, data) ;
						
				},
				beforeChange: function onChange(callback)
				{

					//

						this.addListener(Location.EVENT_BEFORE_CHANGE, EventListener.create(callback, 0)) ;

				},
				afterChange: function onChange(callback)
				{

					//

						this.addListener(Location.EVENT_AFTER_CHANGE, EventListener.create(callback, 0)) ;

				},
				/**
				* @contract Creates a url instance for the location URL's properties.
				*/
				toURL: function toURL( )
				{
/*@quickanddirty*/
return URL.create(this.getLocation( )) ;
				}
		}
}