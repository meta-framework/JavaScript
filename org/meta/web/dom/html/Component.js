/*
@abstract
@identifier org.meta.web.dom.html.Component
@extend org.meta.web.dom.Component
@require org.meta.web.css.CSSStyle, org.meta.web.dom.html.HTML
*/
{
		main: function main(root, style, layout)
		{

				this.root = root ;
				this.style = style ;
				this.layout = layout ;

				this.children = [ ] ;

		},
		global:
		{
				/**
				* @param (String) type The element type for this component's root node.
				*/
				create: function create(root, layout)
				{
				
					// variables
					
					var component ;
					
					//

						component = new this(root, new CSSStyle(null), layout) ;
						component.setID(Component.createComponentID(component)) ;
						component.setClass(Component.createComponentClass(component)) ;

					// return
					
						return component ;
					
				},
				createComponentID: function createComponentID(component) { return component.constructor.getName( ) + '-' + createID( ) ; },
				createComponentClass: function createComponentClass(component) { return component.constructor.getType( ).replace(/\./g, '-') ; }
		},
		local:
		{
				style: null,
				destroy: function destroy( )
				{
// console.log('org.meta.web.dom.html.Component#destroy') ;
						/*Destroy the style object.*/
						this.style.destroy( ) ;
				
						org.meta.web.dom.html.Component.super.invoke('destroy', this) ; // implies queued child component destruction
				
				},
				/**
				* Set the default---potentially permanent---style of a component for this type.
				*
				* @contract This operation sets the default style for a component of this type using a class name shared by instances of this component type.
				*
				* @param (CSSStyleSheet) sheet The style sheet to post this component's style rules to.
				*/
				draw: function draw(sheet)
				{

					// variables
					
					var selector ;
					
					//

						selector = '.' + Component.createComponentClass(this) ;
					
						if(! sheet.hasStyleRule(selector)) sheet.addStyleRule(selector, this.style.toRuleString( )) ;

				},
				/**
				* Update this component's style.
				*
				* @contract This operation is ought to contain the logic for additional---potentially impermanent---style properties.
				*
				* @param (CSSStyleSheet) sheet The style sheet to post this component's updated style rules to.
				*/
				redraw: function draw(sheet)
				{
					//..
				},
				setAttribute: function setAttribute(name, value) { HTML.setAttribute(this.root, name, value) ; },
				getAttribute: function getAttribute(name, value) { return HTML.getAttribute(this.root, name) ; },
				removeAttribute: function removeAttribute(name) { return HTML.removeAttribute(this.root, name) ; },
				hasAttribute: function hasAttribute(name) { return HTML.hasAttribute(this.root, name) ; },
				setID: function setID(id) { HTML.setAttribute(this.root, 'id', id) ; },
				getID: function getID( ) { return HTML.getAttribute(this.root, 'id') ; },
				hasClass: function hasClass(name) { return HTML.hasClass(this.root, name) ; },
				setClass: function setClass(name) { HTML.setClass(this.root, name) ; },
				getClass: function getClass( ) { return	HTML.getClass(this.root) ; },
				addClass: function addClass(name) { HTML.addClass(this.root, name) ; },
				removeClass: function removeClass(name) { HTML.removeClass(this.root, name) ; },
				toggleClass: function toggleClass(name) { HTML.toggleClass(this.root, name) ; }
		}
}