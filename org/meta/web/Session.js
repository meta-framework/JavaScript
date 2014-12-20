/*
@identifier org.meta.web.Session
@extend org.meta.web.dom.event.EventTarget
@require org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener, org.meta.web.Cookie, org.meta.web.Location, org.meta.web.URL
@description A utility object for the management of a web based user session.
@link https://developer.mozilla.org/en-US/docs/Web/API/History
*/
{
		main: function main(cookie)
		{

				this.target = GLOBAL_OBJECT ;
				this.cookie = cookie ;
				
				this.listeners = { } ;
// console.log('session:') ;
// console.dir(this) ;
		},
		global:
		{
				EVENT_BEGIN: 'begin',
				EVENT_CLOSE: 'close',
//				EVENT_RELOCATE: 'relocate',
				EVENT_TRANSITION: 'transition',
				create: function create( )
				{				
// console.log('Session::create') ;
// console.dir(this) ;
					// return
					
					return new this(Cookie.create( )) ;

				}
		},
		local:
		{
				destroy: function destroy( )
				{
				
						this.cookie.destroy( ) ;
					
						org.meta.web.Session.super.invoke('destroy', this) ;

				},
				/**
				* @todo distinguish inter host referals: (1) aspect changes (only hash modified, these indicate minor modifications within the same functionality/module) and (2) functionality changes (path name modified, changes to other modules).
				*/
				setLocation: (function( ) {
						if(isSet('pushState', GLOBAL_OBJECT.history)) return function setLocation(url)
						{
						
							// variables
							
							var u ;
							
							//
							
								/*If the given location is the current location, return early.*/
								if(url === Location.toURL( )) return ;

								/*Analyze the given url.*/
								u = URL.create(url) ;

								/*Detect an intra host referal and leave the page. Otherwise, if its an intra host referal, push a state..*/
								if((u.getHost( )) !== Location.getHost( ))
								{
								
										this.triggerEvent(Session.EVENT_CLOSE, null) ;

										Location.change(url) ;
							  
								}
								else
								{
								
										history.pushState(null, null, url) ;

										this.triggerEvent(Session.EVENT_RELOCATE, {old_location: Location.toURL( ), new_location: url, url_object: u}) ;
							  
								}
								
						}
						else return function setLocation(url)
						{
						
							// variables
							
							var u ;
							
							//
							
								/*If the given location is the current location, return early.*/
								if(url === Location.toURL( )) return ;
								
								/*Analyze the given url.*/
								u = URL.create(url) ;
								
								if((u.getHost( )) !== Location.getHost( ))
								{
								
										this.triggerEvent(Session.EVENT_CLOSE, null) ;

										Location.change(url) ;
							  
								}
								else
								{
							  
										/*Use the fragment modifier to push a history entry.*/
										Location.change(
												'/#' + u.getPath( )
												+ (u.getQuery( ) !== null ? '?' + u.getQuery( ) : '')
												+ (u.getFragment( ) !== null ? '#' + u.getFragment( ) : '' )
										) ;
							  
										this.triggerEvent(Session.EVENT_RELOCATE, {old_location: Location.toURL( ), new_location: url}) ;
							  
								}

						}
				})( ),
				/**Return the current session location.*/
				getLocation: function getLocation( ) { return Location.toURL( ) ; },
				/**
				* A proxy for `Events.onDocumentReady`.
				*/
				onBegin: function onBegin(callback)
				{
						Events.onReady(DEFAULT_DOCUMENT, callback) ;
				},
				onClose: function onClose(callback)
				{
					
					//
					
						Events.onUnload(DEFAULT_WINDOW, callback) ;
					
				},
				onTransition: function onTransition(callback)
				{

					//
				
//						listener = EventListener.create(callback) ;
						this.addListener(Session.EVENT_TRANSITION, EventListener.create(callback)) ;
//						this.addListener(Session.EVENT_TRANSITION, EventListener.create(callback)) ;
					
				}
		}
}