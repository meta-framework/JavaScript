/*
@identifier org.meta.web.dom.html.Container
@extend org.meta.web.dom.html.Component
@require org.meta.web.dom.html.HTML, org.meta.web.css.CSSStyle
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
						return Container.super.create.apply(this, [HTML.createElement(document, 'div'), layout])
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
						this.style.setProperty('display', 'block') ;
						this.style.setProperty('position', 'relative') ;

						if((this.layout & Container.LAYOUT_COVER) !== 0)
						{

								this.setWidth('100%') ;
								this.setHeight('100%') ;
							
								if((this.layout & Container.LAYOUT_COVER_WIDTH) !== 0) this.setHeight('auto') ;
								if((this.layout & Container.LAYOUT_COVER_HEIGHT) !== 0) this.setWidth('auto') ;

						}
						if((this.layout & Container.LAYOUT_ALIGN) !== 0)
						{
						
								this.style.setProperty('margin', '0 auto') ;
							
								if((this.layout & Container.LAYOUT_ALIGN_LEFT) !== 0) this.style.setProperty('margin-left: 0') ;
								if((this.layout & Container.LAYOUT_ALIGN_RIGHT) !== 0) this.style.setProperty('margin-right: 0') ;
							
						}

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
				setWidth: function setWidth(value)
				{
						this.style.setProperty(CSSStyle.WIDTH, value) ;
				},
				getWidth: function getWidth( )
				{
						this.style.getProperty(CSSStyle.WIDTH) ;
				},
				setHeight: function setHeight(value)
				{
						this.style.setProperty(CSSStyle.HEIGHT, value) ;
				},
				getHeight: function getHeight( )
				{
						this.style.getProperty(CSSStyle.HEIGHT) ;
				},
				setBackground: function setBackground(value)
				{
						this.style.setProperty(CSSStyle.BACKGROUND, value) ;
				},
				getBackground: function getBackground( )
				{
						this.style.getProperty(CSSStyle.BACKGROUND) ;
				}
		}
}