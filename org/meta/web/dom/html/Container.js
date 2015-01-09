/*
@identifier org.meta.web.dom.html.Container
@extend org.meta.web.dom.html.Component
@require org.meta.web.dom.html.HTML, org.meta.web.css.CSS, org.meta.web.css.CSSStyleDeclaration
@description An HTML container element wrapper (vulgo: "DIV wrapper").
*/
{
		global:
		{
				LAYOUT_COVER: 1,
				LAYOUT_COVER_WIDTH: 1 << 1,
				LAYOUT_COVER_HEIGHT: 1 << 2,
				LAYOUT_ALIGN: 1 << 3,
				LAYOUT_ALIGN_LEFT: 1 << 4,
				LAYOUT_ALIGN_RIGHT: 1 << 5,
				create: function create(document, layout)
				{
				
					// variables
					
					var container,
						element ;
					
					//
					
						element = HTML.createElement(document, 'div') ;
						container = new this(element, new CSSStyleDeclaration(element.style), layout)
						container.setAttribute('id', Component.createComponentID(container)) ;
						container.setAttribute('class', Component.createComponentClass(container)) ;
					
					// return

						return container ;

				}
		},
		local:
		{
				/**
				* @param (CSSStyleSheet) sheet The style sheet to post this component's style rules to.
				*/
				draw: function draw(sheet)
				{
// console.log('org.meta.web.dom.html.Container.draw') ;

					// variables
					
					var properties ;
					
					//
					
					
						properties = {
								'display': 'block',
								'position': 'relative'
						} ;

						if((this.layout & Container.LAYOUT_COVER) !== 0)
						{
							
								if((this.layout & Container.LAYOUT_COVER_WIDTH) !== 0){
										properties[CSS.PROPERTY_WIDTH] = '100%' ;
										properties[CSS.PROPERTY_HEIGHT] = 'auto' ;
								}
								if((this.layout & Container.LAYOUT_COVER_HEIGHT) !== 0)
								{
										properties[CSS.PROPERTY_WIDTH] = 'auto' ;
										properties[CSS.PROPERTY_HEIGHT] = '100%' ;
								}

						}

						if((this.layout & Container.LAYOUT_ALIGN) !== 0)
						{
						
								properties[CSS.PROPERTY_MARGIN] = '0 auto' ;
							
								if((this.layout & Container.LAYOUT_ALIGN_LEFT) !== 0) properties['margin-left'] = '0' ;
								if((this.layout & Container.LAYOUT_ALIGN_RIGHT) !== 0) properties['margin-right'] = '0' ;
							
						}
					
						this.style.addRules(Component.createComponentClassSelector(this), properties) ;

						org.meta.web.dom.html.Container.super.invoke('draw', this, sheet)

				},
				/**
				* Update this component's current style.
				* @param (CSSStyleSheet) sheet The style sheet to post this component's style rules to.
				*/
				redraw: function draw(sheet)
				{
					//..
				},
				/**
				* @contract Sets the width property specifically for this component's root element (not the class of elements induced by the type).
				*/
				setWidth: function setWidth(value)
				{
						this.style.setRule(stringFormat('#%s', this.getID( )), 'width', value) ;
				},
				/**
				* @contract Sets the height property specifically for this component's root element (not the class of elements induced by the type).
				*/
				setHeight: function setHeight(value)
				{
						this.style.setRule(stringFormat('#%s', this.getID( )), 'height', value) ;
				},
				setBorderStyle: function setBorderStyle(properties)
				{
						this.style.setRules(stringFormat('#%s', this.getID( )), CSSStyleDeclaration.borderFor(properties)) ;
				},
				/**
				* @contract Sets the background property (or, properties) specifically for this component's root element (not the class of elements induced by the type).
				*/
				setBackgroundStyle: function setBackgroundStyle(properties)
				{
						this.style.setRules(stringFormat('#%s', this.getID( )), CSSStyleDeclaration.backgroundFor(properties)) ;
				},
				/**
				* @contract Sets the box shadow property (or, properties) specifically for this component's root element (not the class of elements induced by the type).
				*/
				setShadowStyle: function setShadowStyle(properties)
				{
						this.style.setRules(stringFormat('#%s', this.getID( )), CSSStyleDeclaration.shadowFor(properties)) ;
				}
		}
}