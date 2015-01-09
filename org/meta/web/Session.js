/*
@identifier org.meta.web.Session
@extend org.meta.web.dom.event.EventTarget
@require org.meta.util.Matcher, org.meta.web.URI, org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener, org.meta.web.Cookie, org.meta.web.Location
@description A utility object for the management of a web based user session.
@link https://developer.mozilla.org/en-US/docs/Web/API/History
*/
{
		main: function main(window, location, cookie)
		{

				this.target = window ;
				this.location = location ;
				this.cookie = cookie ;
				
				this.listeners = { } ;
// console.log('session:') ;
// console.dir(this) ;
		},
		global:
		{
				PATTERN_STATE: '/(?:([^:]+)(?::(.+))?)?', // e.g. '/a/b/c:A=1&B=2&C=3'; the state at minimum contains the root path '/'
				EVENT_BEGIN: 'session-begin',
				EVENT_CLOSE: 'session-close',
				EVENT_TRANSITION: 'session-transition',
				/**
				* @todo the session destruction upon unload might have to be refined.
				*/
				create: function create(window)
				{				
// console.log('Session::create') ;
// console.dir(this) ;
					// preconditions
					
						assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be DOM window.') ;

					// variables
					
					var session,
						location ;
					
					//
					
						session = new this(window, (location = Location.create(window)), Cookie.create( )) ;
					
						Events.onBeforeUnload(window, function( ) { // tie session close to the unload event
								session.triggerEvent(Session.EVENT_CLOSE, null) ;
						}, '') ; //

						location.afterChange(function(event) { // tie session transitions to location changes
// console.log(':after-location-change') ;
								session.triggerEvent(Session.EVENT_TRANSITION, {detail: event.detail}) ; // only pass the event details since these are different events
						}) ;
					
					// return
					
						return session ;

				},
				parseState: function parseState(fragment)
				{
				
					// variables
					
					var state = null,
						matcher,
						query ;
					
					//
					
						matcher = Matcher.create(Session.PATTERN_STATE) ;
						matcher.reset(fragment) ;
					
						if(! matcher.lookingAt( )) error('Syntax Error: Given fragment is not a valid state string.') ;
						else
						{
						
								state = {path: '/' + matcher.group(1)} ;

								if((query = matcher.group(2))) state.parameter = URI.parseQuery(query) ;
						
						}
					
					// return
					
						return state ;
				
				}
		},
		local:
		{
				location: null,
				cookie: null,
				/**
				* @todo session close logic
				*/
				destroy: function destroy( )
				{
// console.log('Session#destroy') ;
						this.cookie.destroy( ) ;
						this.location.destroy( ) ;
					
						org.meta.web.Session.super.invoke('destroy', this) ;

				},
				/**
				* Analyze the current URL and parse state properties.
				*/
				getState: function getState( )
				{
				
					// variables
					
					var fragment ;
					
					//
					
						if((fragment = this.location.getFragment( ))) return Session.parseState(fragment) ;
					
					// return
					
						return null ;

				},
				getPath: function getPath( )
				{
				
					// variables
					
					var fragment ;
					
					//
					
						if((fragment = this.location.getFragment( ))) return fragment.substring(0, fragment.indexOf(':')) ;
					
					// return
					
						return null ;

				},
				getParameter: function getParameter( )
				{
				
					// variables
					
					var fragment,
						parameter ;
					
					//
					
						if((fragment = this.location.getFragment( )))
						{
						
								parameter = fragment.substring(fragment.indexOf(':') + 1, fragment.length) ;
						
								return URI.parseQuery(parameter) ;
							
						}
					
					// return
					
						return null ;

				},
				/**
				* A proxy for `Events.onDocumentReady`.
				*/
				onBegin: function onBegin(callback) { Events.onReady(DEFAULT_DOCUMENT, callback) ; },
				onClose: function onClose(callback) { Events.onUnload(DEFAULT_WINDOW, callback) ; },
				/**
				* @contract Allows listener registration for internal referals.
				*/
				onTransition: function onTransition(callback) { this.addListener(Session.EVENT_TRANSITION, EventListener.create(callback)) ; }
		}
}