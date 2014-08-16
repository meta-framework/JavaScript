/** 
Meta MVC (Model-View-Controller) library set-up script.
@author friedrich alexander kurz, 2012, f.a.kurz@googlemail.com
@legal GNU General Public License, http://www.gnu.org/licenses/gpl-3.0.html
*/

( function( ) {
/*
Meta.require("org.meta.web.Request")
.require("org.meta.web.dom.DOM")
.require("org.meta.web.dom.Path")
.require("org.meta.web.dom.Collection")
.require("org.meta.web.Session") ;

var Request = org.meta.web.Request,
	DOM = org.meta.web.dom.DOM,
	Path = org.meta.web.dom.Path,
	Collection = org.meta.web.dom.Collection,
	Session = org.meta.web.Session ;
*/
/*-----org.meta.ui.mvc.Model-----*/

Meta.define(  {
		name: "MVCTemplate",
		package: "org.meta.ui.mvc",
		prototype: "org.meta.ui.template.Template",
		main: function main(source) { this.source = source ; }
		local: {
				modelTemplate: function modelTemplate( ) { Meta.error("!") ; }
				viewTemplate: function vievtemplate( ) { Meta.error("!") ; }
				controllerTemplate: function controllerTemplate( ) { Meta.error("!") ; }
		}
}  )
.define(  {
		name: "MVCFactory",
		package: "org.meta.ui.mvc",
		global: {
				newInstance: function newInstance(template) { return new this(template) ; }
		},
		local: {
				newModel: function newModel( ) { Meta.error("!") ; }
				newView: function newModel( ) { Meta.error("!") ; }
				newController: function newModel( ) { Meta.error("!") ; }
		}
}  )
.define(  {
		/**
		* The Model Object containing a view's underlying data as well as an abstract specification of its behaviour.
		*/
		name: "Model",
		package: "org.meta.ui.mvc",
		prototype: "org.meta.Object",
		/**Create a `Model`.*/
		main: function main(arguments)
		{

			//

				this.components = [] ;

		},
		global: {
				newInstance: function newInstance(arguments)
				{
Meta.log("Model::newInstance") ;				
					// variables
					
					var m ;
					
					//
					
						m = new this(null) ;
						
					// return
					
					return m ;

				}
		},
		local: {
				components: null,
				logic: null,
				data: null,
				/*Add a model component.*/
				add: function add(component)
				{
				
					// preconditions
					
					Meta.assert(Meta.instanceOf(ModelComponent,component), "Invalid type for parameter component.") ;
					
					//
				
						this.components[this.components.length] = component ;
				
					// return
					
					return this ;

				}
		}
}  ) ;

/*-----org.meta.ui.mvc.View-----*/

Meta.require("org.meta.web.dom.Path")
.require("org.meta.ui.Component") ;

var Path = org.meta.web.dom.Path,
	Component = org.meta.ui.Component ;

Meta.define(  {
		/** The View Object exposing methods to modify the user interface to display the desired view. A `View` essentially is a wrapper `Object` managing `Component`s.*/
		name: "View",
		package: "org.meta.ui.mvc",
		prototype: "org.meta.Object",
		init: function init( )
		{
				this.LINK_PATH = Path.newInstance("a[href]") ;
		},
		/**
		* Create an instance of `org.meta.ui.mvc.View`.
		*/
		main: function main(arguments)
		{
			this.components = [] ;
		},
		global: {
				STATE_READY: 0,
				STATE_BUSY: 1,
				LINK_PATH: null,
				newInstance: function newInstance( )
				{
Meta.log("View::newInstance") ;
					// variables
					
					var v, a, i, o, s, f ;
					
					//
					
						v = new this(null) ;

						/*Bind Links.*/
						/*@ToDo(Create/use org.meta.ui.Link and add as component.)*/
					
						this.LINK_PATH.evaluate(Meta.DEFAULT_DOCUMENT)
						.each(  function(index,link) {

							var s ;
							
								s = DOM.getAttribute(link,"href") ;
								
								if( s.charAt(0) === "/" ) { /*Only internal referrals.*/
								
										DOM.addListener(link, "click", function(event){ Session.redirect(s) ; } )
										.setAttribute(link,"href","javascript:void(0);") ;
								
								}
						
						}  ) ;
						
					// return v
					
					return v ;
				
				}
		},
		local: {
				components: null,
				add: function add(component)
				{
				
					// preconditions
					
					Meta.assert(Meta.instanceOf(Component,component), "Invalid type for parameter component.") ;
				
					//

						this.components[this.components.length] = component ;
						
					// return
					
					return this ;

				},
				getComponentById: function getComponentById(id)
				{
				
					// variables
					
					var i, c ;
					
					//
					
						i = this.components.length ;
						
						while(--i >= 0) {
						
								c = this.components[i] ;
								
								if( c.getId( ) === id ) { break ; }
								
						}
						
						if(i === -1) { c = null ; }
						
					// return
					
					return c ;

				},
				getComponentsByType: function getComponentsByType(type)
				{ Meta.error("Stub") ;
				},
				removeComponentById: function removeComponentById(id)
				{ Meta.error("Stub") ;
				}
		}
}  ) ;

/*-----org.meta.ui.mvc.Controller-----*/

Meta.require("org.meta.logic.Listener")
.require("org.meta.web.Request")
.require("org.meta.web.dom.DOM")
.require("org.meta.ui.mvc.Model")
.require("org.meta.ui.mvc.View") ;

var Listener = org.meta.logic.Listener,
	Request = org.meta.web.Request,
	DOM = org.meta.web.dom.DOM,
	Model = org.meta.ui.mvc.Model,
	View = org.meta.ui.mvc.View ;
	
/*@ToDo(
Make this a factory again. And make the load method part of the constructor, i.e. new Controller("/url"); changes should be bound to Session.redirect. 
Add helper Objects for converting xml mvc descriptions to objects.
)*/

Meta.define(  {
		/**
		*The Controller Object exposing methods to control the view according to a given model.
		*/
		name: "Controller",
		package: "org.meta.ui.mvc",
		prototype: "org.meta.logic.Eventable",
		require: ["org.meta.ui.Component"],
		init: function init( ) {
				this.MVC_PATH = Path.newInstance("#comment[value()^=%s]",{s:"<mvc"}) ;
		},
		/**
		*Create an instance of `org.meta.ui.mvc.Controller`.
		*@return this
		*/
		main: function main(arguments)
		{
Meta.log("Controller::main") ;
			// set this

				this.listeners = [ ] ;
/*
				this.model = Model.newInstance( ) ;
				this.view = View.newInstance( ) ;
				
				/*Apply history push for redirects.*

//				Session.setSessionVariable("org.meta.web.Session.redirect.push",true) ;

				if( (s = Meta.DEFAULT_VIEW.location.pathname) !== "/" ) { Session.redirect(s) ; }
				else if( (s = Meta.DEFAULT_VIEW.location.hash) !== "#/" ) {

						s = s.substr(1) ;
						
						Session.redirect(s) ;

						this.load(s) ;
						
				}

				/*Apply a redirect handler passing the redirect event to Controller#load.*
				
				org.meta.web.Session.onRedirect(  {
						action: function(event,controller) { controller.load(event.href) ; },
						parameter: this
				}  ) ;
				
				/*Apply a load handler.*/


		},
		global: {
				MVC_DOCUMENT: "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><!DOCTYPE mvc[<!ELEMENT mvc (model?,view?,controller?)><!ELEMENT model ANY><!ELEMENT view EMPTY><!ATTLIST view component CDATA #REQUIRED><!ELEMENT controller (handle+)><!ELEMENT handle (parameter+)><!ATTLIST handle name CDATA #REQUIRED><!ATTLIST handle action CDATA #REQUIRED><!ATTLIST handle target CDATA #IMPLIED><!ELEMENT parameter (#PCDATA)>]>"/*"<?xml version=\"1.0\" encoding=\"UTF-8\" ?><!DOCTYPE mvc[ <!ELEMENT mvc (model?,view?,controller?)><!ELEMENT model ANY><!ELEMENT view (listener+)><!ATTLIST view type CDATA #REQUIRED><!ELEMENT listener (action+)><!ATTLIST listener name CDATA #REQUIRED><!ELEMENT action (parameter+)><!ATTLIST action name CDATA #REQUIRED><!ELEMENT parameter (#PCDATA)> ]>"*/,
				MVC_PATH: null,
				newInstance: function newInstance( )
				{
				
					// variables
					
					var c = new this(null), m, v ;
					
					//
							
						/*/

						m = this.model = Model.newInstance( ) ;
						v = this.view = View.newInstance( ) ;
						
						this.constructor.MVC_PATH.evaluate(Meta.DEFAULT_DOCUMENT)
						.each(  function(index,comment) {
								
							var s, d, n, f, c ;

								s = this.constructor.MVC_DOCUMENT
								+ DOM.getText(comment) ;

								d = DOM.parseNode(s) ;
								n = d.documentElement ;
								
								if(  ( a = DOM.findChildren(n,"view") ).length  >  0  ) {
								
										f = this.constructor.viewFromXML( a[0] ) ;
										c = f.newInstance( DOM.parentOf(comment) ) ;

								}
								else { c = org.meta.ui.Component.newInstance( DOM.parentOf(comment) ) ; }
								
								this.view.add(c) ;
								
								// model
								
								Path.newInstance("/controller /*")
								.evaluate(n)
								.each(  function(index,element) {
										
										switch( DOM.nameOf(element) ) {

												case "handle": {
												
														c.addListener( this.constructor.listenerFromXML(element)  ) ;
												
													break ;
														
												}
												default: { Meta.error("Stub.") ; }
										
										}
								
								}, this  ) ;

						}, this  ) ;
*/
					// return c
					
					return c ;

				},
				viewFromXML: function viewFromXML(xml)
				{
				
					// variables
					
					var f = null, s ;
					
					//
					
						s = DOM.getAttribute(xml,"component") ;
						
						try {
						
								Meta.require(s) ;
								
								f = Meta.get(s) ;
								
						}
						catch(e) { Meta.log(e) ; }
					
					// return
				
					return f ;

				},
				listenerFromXML: function listenerFromXML(xml)
				{
				
					var l = null, a, s, o ;
												
						a = [] ;
						
						Meta.each(DOM.findChildren(xml,"parameter"), function(index,parameter) { a[a.length] = DOM.getText(parameter) ; }) ;

						s = DOM.getAttribute(xml,"action") ;
						/*@Note(Target defaults to Controller but may also specify an Object with an id.)*/
						o = DOM.getAttribute(xml,"target") || org.meta.ui.mvc.Controller ;
						
						l = new Listener(
								DOM.getAttribute(xml,"name"),
								{
										action:	function(event,target,action,parameter) {
												org.meta.ui.mvc.Controller.request(target, action, parameter) ;
										},
										parameter: [o,s,a]
								}
						) ;
						
					// return
					
					return l ;

				}
		},
		local: {
				model: null,
				view: null,
				request: function request(target,action,parameter)
				{
Meta.log("Controller.request: %1;",Array.prototype.join.call(arguments,","));
					// return
					
					return this ;

				},
				load: function(uri,post)
				{

					//
Meta.log("Controller.load (%1;)",uri) ;
						new Request(  {method: !! post ? "POST" : "GET", uri: uri, mime: Request.MIME_XML, flag: true}  )
						.onError(  {
								action: function(event,controller) {
										alert( Meta.format(
												"Die Ressource konnte nicht geladen werden (status=%1;,status-name=%2;).",
												this.status( ),
												this.statusText( )
										) ) ;
										Session.redirect("/") ;
								},
								parameter: this
						}  )
						.onDone(  {
								action: function(event,controller) {

									var n ;
									
										/*Replace the current document body with the loaded document's body.*/

										n = Path.newInstance("body")
										.evaluate(this.result( ))
										.item(0) ;

										DOM.replace(Meta.DEFAULT_DOCUMENT.body, DOM.importNode(n,Meta.DEFAULT_DOCUMENT,true)) ;
$("body > div").hide( ).fadeIn(500);

										controller.triggerEvent("load") ;

								},
								parameter: this
						
						}  )
						.send( ) ;

					// return
					
					return this ;
				
				},
				onLoad: function onLoad(listener)
				{
				
					//
					
						this.addListener( new Listener("load",listener,this) ) ;
					
					// return
					
					return this ;
				
				}
		}
}  ) ;

}  )( ) ;