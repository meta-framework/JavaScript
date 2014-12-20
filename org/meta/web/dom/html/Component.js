/*
@abstract
@identifier org.meta.web.dom.html.Component
@extend org.meta.web.dom.Component
@require org.meta.web.css.CSSStyle, org.meta.web.dom.html.HTML
*/
{
		main: function main(root)
		{
				this.root = root ;
				this.style = new CSSStyle(null) ;
				this.children = [ ] ;
		},
		global:
		{
				create: function create( )
				{
						error('Unsupported Operation: Abstract type.') ;					
				}
		},
		local:
		{
				destroy: function destroy( )
				{
				
						/*Destroy the style object.*/
						this.style.destroy( ) ;
					
						/*Destroy all child components.*/
						this.children.forEach(function(component) { component.destroy( ); }) ;
				
						Component.super.destroy.call(this) ;
				
				},
				/**
				* Set the component's initial style.
				*/
				draw: function draw(style)
				{
				
						style.addStyleRule(
								'#' + this.getID( ),
								this.style.toRuleString( )
						) ;

				},
				/**
				* Update this component's current style.
				*/
				redraw: function draw(style)
				{
					//..
				},
				setAttribute: function setAttribute(name, value) { HTML.setAttribute(this.root, name, value) ; },
				getAttribute: function getAttribute(name, value) { return HTML.getAttribute(this.root, name) ; },
				removeAttribute: function removeAttribute(name) { return HTML.removeAttribute(this.root, name) ; },
				hasAttribute: function hasAttribute(name) { return HTML.hasAttribute(this.root, name) ; },
				setID: function setID(id) { HTML.setAttribute(this.root, 'id', id) ; },
				getID: function getID( ) { return HTML.getAttribute(this.root, 'id') ; },
				setClass: function setClass(name) { HTML.setClass(this.root, name) ; },
				getClass: function getClass( ) { return	HTML.getClass(this.root) ; },
				addClass: function addClass(name) { HTML.addClass(this.root, name) ; },
				removeClass: function removeClass(name) { HTML.removeClass(this.root, name) ; },
				toggleClass: function toggleClass(name) { HTML.toggleClass(this.root, name) ; }
		}
}