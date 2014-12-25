/*
@identifier org.meta.web.Session
@extend org.meta.web.dom.event.EventTarget
@require org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener, org.meta.web.Cookie, org.meta.web.Location, org.meta.web.URL
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
				EVENT_BEGIN: 'begin',
				EVENT_CLOSE: 'close',
//				EVENT_RELOCATE: 'relocate',
				EVENT_TRANSITION: 'transition',
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
try {
console.log('session-target: %s', session.target) ;
								session.triggerEvent(Session.EVENT_CLOSE, null) ;
//								session.destroy( ) ;
} catch(error) { console.log(error.stack) ; }
						}, '!') ; //

						location.afterChange(function(data) {
								/*Trigger the transition event.*/
								session.triggerEvent(Session.EVENT_TRANSITION, data.detail) ;
						}) ;
					
					// return
					
						return session ;

				}
		},
		local:
		{
				location: null,
				cookie: null,
				/**
				* @todo session closal logic
				*/
				destroy: function destroy( )
				{
console.log('Session#destroy') ;
						this.cookie.destroy( ) ;
						this.location.destroy( ) ;
					
						org.meta.web.Session.super.invoke('destroy', this) ;

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