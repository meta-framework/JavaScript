/*
@identifier org.meta.web.application.Application
@extend org.meta.Object
@require org.meta.web.URL, org.meta.web.Location, org.meta.web.Session, org.meta.web.css.CSSStyleSheet
@description An abstract type specifying the basic operations and attributes of a web application. A web application is modelled as a finite state machine whose states map to location URLs and whose transitions are identified by location changes. Ideally, the  states of the web application's machine model are supposed to be modular functions of the application.
*/
{
		main: function main(session, style)
		{

			//

				this.session = session ;
				this.style = style ;

				this.modules = { } ;

		},
		global:
		{
				/**
				* The standard application creation operation.
				*/
				create: function create( )
				{
// console.log('org.meta.web.application.Application::create') ;
					// variables
					
					var application,
						session,
						style ;
					
					//

						application = new this((session = Session.create( )), (style = CSSStyleSheet.create(CSSStyleSheet.RESET_STYLE))) ;

						session.onBegin(function( ) {
console.log('(!) session-begin') ;
								/*Listen to location changes.*/
								session.onTransition(function(event) { application.transition(event) ; }) ;
								
								/*Transition to the initial location./
								application.transition(Location.toURL( )) ;
*/
						}) ;
						session.onClose(function( ) {
console.log('(!) session-close') ;
								/*Destroy the application on session close (this implies logic bound to destruction of a `Session` object)*/
								application.destroy( ) ;
						}) ;

					// return
					
					return application ;

				}
		},
		local:
		{
				/**@type org.meta.web.Session*/
				session: null,
				/**
				* A map of locations to type identifiers.
				* @type Object
				*/
				modules: null,
				destroy: function destroy( )
				{

						this.session.destroy( ) ;
						
						Application.super.invoke('destroy', this) ;

				},
				mapModule: function mapModule(path, identifier)
				{
					
					// preconditions
					
						assert(! isSet(path, this.modules), 'Illegal State: Path is already mapped to module (path=%s)', path) ;
					
					//
					
						this.modules[path] = identifier ;
					
				},
				unmapModule: function unmapModule(path) { delete this.modules[path] ; },
				switchModule: function switchModule(constructor)
				{
console.log('Application#switchModule (from=%s, to=%s)', typeOf(this.module), constructor.reflect.identifier) ;
// console.log('(!) module-imported') ;
if((old = this.module)) old.destroy( ) ;
this.module = constructor.create( )  ;
this.module.draw(this.style) ;
				},
				transition: function transition(path)
				{
// console.log('(!) transition-event: %s', path) ;
					// variables
					
					var url,
						identifier,
						application = this ;
					
					//
					
						url = URL.create(path) ;
// console.log('\t> file-path: "%s"', url.getPath( )) ;
						if((identifier = this.modules[url.getPath( )]))
								if((constructor = constructorOf(identifier))) switchModule(constructor) ;
								else require(identifier, function( ) { application.switchModule(constructorOf(identifier)) ; }) ;

				}
		}
}