/*
@identifier org.meta.web.application.Application
@type abstract
@extend org.meta.logic.application.Application
@require org.meta.web.Session, org.meta.web.Request
@description An abstract type specifying the basic operations and attributes of a web application. A web application is modelled as a finite state machine whose states map to URLs and whose transitions are identified by URL changes. The states of the web application's machine model are supposed to be modular functions of the application, i.e. independent use cases.
*/
{
		main: function main(session)
		{

			//

				this.session = session ;

		},
		global:
		{
				/**
				* The standard application creation operation.
				*/
				createApplication: function createApplication( )
				{
				
					// variables
					
					var application,
						s,
						t ;
					
					//
					
						application = new this((s = Session.create( ))) ;
						
						/*@todo the initial URL might not be '/'*/
						s.onTransition(EventListener.create(function(event) { alert(stringFormat('transition-url: "%s"', event.url)) ; })) ;
						s.onReady(EventListener.create(function( ) { s.transition('/') ; })) ;
/*@deprecated:
						r = Request.create(null, Request.ATTRIBUTE_ASYNCHRONOUS & Request.ATTRIBUTE_CACHE & Request.ATTRIBUTE_FLAG) ;
						r.setMIMEType(Request.MIME_JAVASCRIPT) ;
						r.setHeader(Request.HTTP_ACCEPTS, 'application/javascript;q=0.8, text/html,application/xhtml+xml,application/xml;q=0.8,* /*;q=0.7') ;
						
						application = this((s = Session.create( )), r) ;
						
						application.onReady(
								EventListener.create(function( ) {
										s.onEvent(Session.EVENT_REFER, EventListener.create(function(event) { application.transition(event.href) ; })) ;
										s.refer(s.getLocation( )) ;
								}),
								EventListener.ATTRIBUTES_EXECUTE_ONCE
						) ;
						application.onEvent(EventTarget.EVENT_UNLOAD, EventListener.create(function( ) { application.destroy( ) ; })) ;
*/
					// return
					
					return application ;

				}
		},
		local:
		{
				/**@type org.meta.web.Session*/
				session: null,
				/**
				* The active controller.
				* @type org.meta.web.AppController
				*/
				active: null,
				destroy: function destroy( )
				{

						this.session.destroy( ) ;
						this.target.destroy( ) ;
						
						if(this.super.destroy) this.super.destroy.call(this) ;

				},
				transition: function transition(url)
				{
				
					// variables
					
					var r ;
					
					//
					
						this.request.setURI(url) ;
						this.request.onDone(new EventListener(function( ) {}), EventListener.ATTRIBUTES_EXECUTE_ONCE) ;
						this.request.onError(new EventListener(function( ) {}), EventListener.ATTRIBUTES_EXECUTE_ONCE) ;
						this.request.send( ) ;
				
				}
		}
}