/*
@abstract
@identifier org.meta.web.dom.html.Component
@extend org.meta.web.dom.Component
@require org.meta.util.StringBuilder, org.meta.web.dom.html.HTML
*/
{
		main: function main(root, style, layout)
		{

				this.target = root ;
				this.style = style ;
				this.layout = layout ;

//				this.children = [ ] ;

		},
		global:
		{
				/**
				* @param (String) type The element type for this component's root node.
				* @abstract
				*/
				create: function create(document, layout) { },
				createComponentID: function createComponentID(component) { return component.constructor.getType( ).replace(/\./g, '-') + '_' + createID( ) ; },
				createComponentIDSelector: function createComponentIDSelector(component) { return '#' + component.getID( ) ; }, // use the "id" attribute rather than calling Component::createComponentID since the resultant string of this operation is unique (and will not match a given "id" attribute)
				createComponentClass: function createComponentClass(component) { return component.constructor.getType( ).replace(/\./g, '-') ; },
				createComponentClassSelector: function createComponentClassSelector(component) { return '.' + Component.createComponentClass(component) ; } // do not use the "class" attribute since there may be volatile class names in addition to the class identifier for the component
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
				* @todo removed style rules need to be removed from the style sheet as well.
				*/
				draw: function draw(sheet)
				{
// console.log('%s#draw', this.constructor.getType( )) ;
					//
/*@qnd*/
objectEach(this.style.rules, function(rule, selector) {
		if(! sheet.hasStyleRule(selector))
		{
			var builder = new StringBuilder('') ;
				objectEach(rule, function(v, k) {
						builder.append('%s:', k)
						.append(v)
						.append(';') ;
				}) ;
				sheet.addStyleRule(selector, builder.build( )) ;
		}
}) ;
				},
				/**
				* Update this component's style.
				*
				* @contract This operation is ought to contain the logic for additional---potentially impermanent---style properties. Existing style data are not to be cleared when this operation is called.
				*
				* @param (CSSStyleSheet) sheet The style sheet to post this component's updated style rules to.
				*/
				redraw: function draw(sheet)
				{
					//..
				},
				setAttribute: function setAttribute(name, value) { HTML.setAttribute(this.target, name, value) ; },
				getAttribute: function getAttribute(name, value) { return HTML.getAttribute(this.target, name) ; },
				removeAttribute: function removeAttribute(name) { return HTML.removeAttribute(this.target, name) ; },
				hasAttribute: function hasAttribute(name) { return HTML.hasAttribute(this.target, name) ; },
				setID: function setID(id) { HTML.setAttribute(this.target, 'id', id) ; },
				getID: function getID( ) { return HTML.getAttribute(this.target, 'id') ; },
				hasClass: function hasClass(name) { return HTML.hasClass(this.target, name) ; },
				setClass: function setClass(name) { HTML.setClass(this.target, name) ; },
				getClass: function getClass( ) { return	HTML.getClass(this.target) ; },
				addClass: function addClass(name) { HTML.addClass(this.target, name) ; },
				removeClass: function removeClass(name) { HTML.removeClass(this.target, name) ; },
				toggleClass: function toggleClass(name) { HTML.toggleClass(this.target, name) ; }
		}
}