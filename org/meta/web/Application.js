/*
@identifier org.meta.web.Application
@extend org.meta.logic.event.EventTarget
@require org.meta.web.URL, org.meta.web.Location, org.meta.web.Session, org.meta.web.css.CSSStyleSheet, org.meta.web.dom.html.HTML, org.meta.web.dom.Module, org.meta.web.dom.Component, org.meta.data.collections.LinkedList
@description An abstract type specifying the basic operations and attributes of a web application. A web application is modelled as a finite state machine whose states map to location URLs and whose transitions are identified by location changes. Ideally, the  states of the web application's machine model are supposed to be modular functions of the application.
*/
{
		main: function main(session, style)
		{

			//

				this.session = session ;
				this.style = style ;

				this.modules = LinkedList.create({sort: LinkedList.SORT_CUSTOM, comparator: function(a, b) {
						return LinkedList.DEFAULT_COMPARATOR(a.path, b.path) ; // rank by comparing paths of the module descriptors
				}}) ;

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
						session.onTransition(function(event)
						{

							var split,
								state ;

//								url = URL.create(detail.new_location.scheme + '//' + detail.new_location.authority + (detail.new_location.fragment || '')) ; // analyze the fragment as a a URL
//								url = event.detail.new_location ;
								split = event.detail.new_location
								.split('#') ; // quick parsing of the fragment identifier (assuming valid URL)
								
								if((state = Session.parseState(split[1]))) application.transition(state.path, state.parameter) ;
								else
error('!') ;

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
				* The logical path of the current module.
				*/
				path: null,
				/**
				* The current parameter.
				*/
				parameter: null,
				/**
				* The current aspect.
				*/
				aspect: null,
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
				destroy: function destroy( )
				{
					
					//
					
						this.session.destroy( ) ;
						this.style.destroy( ) ;

						if(this.module) this.module.destroy( ) ;
						
						Application.super.invoke('destroy', this) ;

				},
				mapModule: function mapModule(properties)
				{
					
					// preconditions
					
						assert(! this.modules.contains(properties.path), 'Illegal State: Path is already mapped to module (path=%s)', properties.path) ;
					
					//
					
						this.modules.add(properties) ;
					
				},
				switchModule: function switchModule(properties)
				{
				
					// variables
					
					var self = this ;

					//

						require(properties.identifier, function(constructor) {
						
							// variables
							
							var module,
								title ;
							
							//
							
								if((module = self.module))
								{
								
										module.deactivate( ) ;
								
										if(! properties.static) undefine(module.constructor.getType( )) ;
								
										module.destroy( ) ; 
										self.module = null ;
								
								}
								
								if((title = properties.title)) DEFAULT_DOCUMENT.title = title ; // modify the title

								module = self.module = constructor.create(DEFAULT_DOCUMENT) ; // create and set an instance for the new module
/*
								HTML.append(module.target, HTML.findFirst(DEFAULT_DOCUMENT, 'body')) ;
*/
								module.activate( ) ;
								module.drawModule(this.style) ;

						}) ;

				},
				/**
				* Switch from one state to another.
				*
				* @contract This operation must handle (1) conditional module type retrieval; (2) module creation, destruction and replacement; ...
				*
				* @param (String) path A string identifying the logical path of the module to transition to.
				* @param (Object) parameter The parameter characterizing the transition.
				*/
				transition: function transition(path, parameter)
				{

					// variables
					
					var state,
						path,
						parameter,
						aspect ;
					
					//
					
						/*Analyze the fragment part of the destination URL.*/
						if(path !== this.path) // logical path has changed
						{

								if((properties = this.modules.find(function(element) { return element.path === path ; }))) // there is a module descriptor mapped to this path
								{
								
										this.path = path ; // update the path
										this.switchModule(properties) ;
										
								}
								else
alert('!') ;

						}
						else
						{
error('Not implemented.') ;
						}

				}
		}
}