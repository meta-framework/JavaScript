/*
@identifier org.meta.web.Session
@extend org.meta.web.dom.event.EventTarget
@require org.meta.logic.event.EventTarget, org.meta.web.dom.event.EventTarget, org.meta.logic.event.EventListener, org.meta.web.Cookie, org.meta.web.Location
@description A utility object for the management of a web based user session.
@link https://developer.mozilla.org/en-US/docs/Web/API/History
*/
{
		extend: 'org.meta.logic.event.EventTarget',
		main: function main(target, cookie, location)
		{

				this.target = target ;
				this.cookie = cookie ;
				this.location = location ;
				
				this.listeners = { } ;

		},
		global:
		{
				EVENT_READY: 'ready',
				EVENT_CLOSE: 'close',
				EVENT_TRANSITION: 'transition',
				create: function create( )
				{
				
					// variables
					
					var session,
						t ;
					
					//

						session = new this(constant('DEFAULT_DOCUMENT'), Cookie.create( ), Location.create( )) ;
						
						t = org.meta.web.dom.event.EventTarget.create(constant('GLOBAL_OBJECT')) ;
						t.addListener(
								org.meta.web.dom.event.EventTarget.EVENT_UNLOAD,
								EventListener.create(function( ) { session.triggerEvent(Session.EVENT_CLOSE) ; session.destroy( ) ; t.destroy( ) ; })
						) ;
						
						session.onReady(EventListener.create(function( ) { session.triggerEvent(Session.EVENT_READY) ; })) ;

						
					// return
					
					return session ;
				}
		},
		local:
		{
				destroy: function destroy( )
				{
				
						this.cookie.destroy( ) ;
						this.location.destroy( ) ;
						
						if(this.super.destroy) this.super.destroy(this) ;

				},
				transition: function transition(url, push)
				{
				
					// variables
					
					var u ;
					
					//
					
						u = URL.create(url) ;
						
						if((u.getHost( )) !== this.location.getHost( ))	this.triggerEvent(Session.EVENT_CLOSE, null) ;
						
						this.triggerEvent(Session.EVENT_TRANSITION, {url: url}) ;
						
						if(push) History.pushState(url) ;
						else this.location.change(url) ;
				
				},
				/**
				* Refer this session to the given URL.
				* 
				* @todo polyfill
				* If a relative URI is given---starting with a slash ('/') character---the URI is supposed to be an internal referral, i.e. one that keeps the current session alive; if an aboslute URI is given---starting with a protocol and host portion, e.g. ''http://www.host.com ''---the referral is supposed to be external and the session will be closed.
				* @param uri (String) A URI to refer to.
				* @deprecated: refactored into `refer` and `Location` type
				*/
				setLocation: function setLocation(url)
				{

					// variables

					var b = false,
						o,
						s ;

					//

						switch(url.charAt(0))
						{
								case constant('CHARACTERS').SLASH: b = true; s = url ; break ;
								case constant('CHARACTERS').HASH: b = true; s = constant('CHARACTERS').SLASH + url; break ;
								default: s = url;
						}

						o = {href: url} ;

						if(! b) this.triggerEvent(this.EVENT_CLOSE, o) ;
						else this.triggerEvent('refer', o) ;
						
						if(isSet('assign', constant('GLOBAL_OBJECT'))) { constant('GLOBAL_OBJECT').location.assign(s) ; }
						else { constant('GLOBAL_OBJECT').location = s ; }

				},
				onTransition: function onTransition(listener) { org.meta.logic.event.EventTarget.invoke('addListener', this, [this.EVENT_TRANSITION, listener]) ; },
				onClose: function onClose(listener) { org.meta.logic.event.EventTarget.invoke('addListener', this, [this.EVENT_CLOSE, listener]) ; }
		}
}