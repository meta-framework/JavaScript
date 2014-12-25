/*
@identifier org.meta.web.application.Application
@extend org.meta.Object
@require org.meta.web.URL, org.meta.web.Location, org.meta.web.Session, org.meta.web.css.CSSStyleSheet, org.meta.web.application.Module
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
						session ;
					
					//
// console.log('org.meta.web.application.Application::create') ;
						application = new this((session = Session.create(DEFAULT_WINDOW)), CSSStyleSheet.create(DEFAULT_DOCUMENT, CSSStyleSheet.RESET_STYLE)) ;
					
						/*Listen to internal location changes.*/
						session.onTransition(function(data)
						{
								
							var detail,
								url ;
// console.log('(!) transition-event') ;
// console.dir(data) ;
								detail = data.detail ;
								url = URL.create(detail.new_location.scheme + '//' + detail.new_location.authority + (detail.new_location.fragment || '')) ; // analyze the fragment as a a URL
								application.transition(url) ;

						}) ;
					
						/**/
						session.onClose(function( ) { application.destroy( ) ; }) ;

					// return
					
					return application ;

				}
		},
		local:
		{
				/**@type org.meta.web.Session*/
				session: null,
				/**@type org.meta.web.Location*/
				location: null,
				/**
				* The active module.
				*
				* @type <? extend org.meta.web.application.Module>
				*/
				module: null,
				/**
				* A map of locations to type identifiers.
				* @type Object
				*/
				modules: null,
/*@quickanddirty*/
path: null,
query: null,
aspect: null,
				destroy: function destroy( )
				{

						this.session.destroy( ) ;
						this.style.destroy( ) ;
						
						Application.super.invoke('destroy', this) ;

				},
				setModule: function setModule(module)
				{
				
					// preconditions

						assert(! this.module, 'Illegal State: Module already defined.') ;
						assert(isInstanceOf(Module, module), 'Invalid Argument: Argument for formal parameter "module" must be Module.') ;
					
					//
					
						this.module = module ;

				},
				/**
				* @param (Boolean) static Boolean flag indicating whether the module constructor can be undefined.
				* @contract Clears an existing module object from the `module` property and optionally destroys and undefines this module. The return value ought to indicate a successful removal.
				* @todo Might try/catch the module removal and return `false` on error.
				* @todo Implement configurable module caching behavior.
				*/
				removeModule: function removeModule(static)
				{
// console.log('Application#removeModule') ;
					// variables
					
					var module,
						identifier ;
					
					//
					
						if((module = this.module))
						{

								identifier = module.constructor.getType( ) ;
							
								if(! static) undefine(identifier) ;

								module.destroy( ) ;

								this.module = null ;
							
								// return
							
								return true ;
						
						}
					
					// return
					
						return false ;

				},
				getModule: function getModule( ) { return this.module ; },
				mapModule: function mapModule(path, properties)
				{
					
					// preconditions
					
						assert(! isSet(path, this.modules), 'Illegal State: Path is already mapped to module (path=%s)', path) ;
					
					//
					
						this.modules[path] = properties ;
					
				},
				unmapModule: function unmapModule(path) { delete this.modules[path] ; },
				switchModule: function switchModule(properties)
				{
				
					// variables
					
					var application = this,
						identifier,
						callback ;
					
					//
console.log('(!) module-transition (from=%s, to=%s)', typeOf(this.module), properties.identifier) ;
						callback = function(constructor) {
								application.removeModule(properties.static || false) ;
								application.setModule(constructor.create( )) ;
								application.getModule( )
								.draw(application.style) ;
						} ;
// console.log('\t> is-defined (%s): %s', identifier, isDefined(identifier)) ;
						identifier = properties.identifier ;
						
						if(! isDefined(identifier)) require(identifier, callback) ;
						else callback(constructorOf(identifier)) ;

				},
				/**@param (org.meta.web.URL) url A url instance describing the referal.*/
				transition: function transition(url)
				{
// console.log('(!) transition-event (%s)', url.toURIString( )) ;
					// variables
					
					var properties ;
					
					//

						/*Identify the type of internal referal: (1) module change, (2) parameter change, (3) aspect change. Module changes are changes to the file path within the new location, parameter changes are changes to the query component with constant file path and aspect changes are changes to the fragment modifier component with constant file path and query*/
						if(url.getPath( ) !== this.path) // module change
						{
						
								if((properties = this.modules[url.getPath( )]))	{ this.switchModule(properties) ; return ; }
								else error('Unmapped module (path=%s).', url.getPath( )) ;

						}
						else
						{
						
								if(url.getQuery( ) !== this.query) { console.log('(!) parameter-change (from=%s, to=%s)', this.query, url.getQuery( )) ; return ; } // parameter change
								else if(url.getFragment( ) !== this.aspect) console.log('(!) parameter-change (from=%s, to=%s', this.aspect, url.getFragment( )) ; // aspect change
						
						}

				},
				/*@deprecated*/
				_transition: function transition(url)
				{
 console.log('Application#transition(%s)', url) ;
					// variables
					
					var u,
						path,
						identifier,
						application = this ;

					//
					
						u = URL.create(url) ; // analyze the given URL
						path = u.getPath( ) ;
					
//						url = URL.create(path) ;
// console.log('\t> module-identifier: "%s"', this.modules[path]) ;
						if((identifier = this.modules[path]))
						{
						
								if((constructor = constructorOf(identifier))) this.switchModule(constructor) ;
								else require(identifier, function( ) { application.switchModule(constructorOf(identifier)) ; }) ;
							
						}

				}
		}
}