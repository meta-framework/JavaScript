/*
@identifier org.meta.web.dom.html.Text
@extend org.meta.web.dom.html.Component
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.html.Component
@description Abstract implementation of a text element.
*/
{
		/**
		* @link https://developer.mozilla.org/de/docs/Web/CSS/vertical-align
		*/
		local:
		{
				draw: function draw(sheet)
				{
				
					// variables
					
					var selector ;
					
					//
					
						selector = Component.createComponentClassSelector(this) ;
				
						/*Formatting classes for inline text elements.*/
						this.style.addRule(selector + ' .-underline', 'text-decoration', 'underline') ;
						this.style.addRule(selector + ' .-overline', 'text-decoration', 'overline') ;
						this.style.addRule(selector + ' .-strike', 'text-decoration', 'line-through') ;
						this.style.addRule(selector + ' .-italic', 'font-style', 'italic') ;
						this.style.addRule(selector + ' .-bold', 'font-weight', 'bold') ;
						this.style.addRule(selector + ' .-super', 'vertical-align', 'super') ;
						this.style.addRule(selector + ' .-sub', 'vertical-align', 'sub') ;
				
						org.meta.web.dom.html.Text.super.invoke('draw', this, sheet) ; // relegate call to org.meta.web.dom.html.Container

				},
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/font
				*/
				setFontStyle: function setFont(properties)
				{
						this.style.setRules(
								Component.createComponentIDSelector(this),
								{
										'font-style': properties.style || 'normal',
										'font-variant': properties.variant || 'normal',
										'font-weight': properties.weight || 'normal',
										'font-stretch': properties.stretch || 'normal',
										'font-size': properties.size || '1em',
										'font-family': properties.family || 'serif',
										'line-height': 'normal'
								}
						) ;
				},
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/Reference
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-align (align)
				* @link https://developer.mozilla.org/de/docs/Web/CSS/text-decoration (decoration)
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent (indentation)
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation (orientation)
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow (overflow)
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering (rendering)
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform (transform)
				*/
				setTextStyle: function setTextStyle(properties)
				{
				
					// variables
					
					var o = { } ;
					
					//
					
						o = objectMerge({
								'text-align': properties.align || 'start',
								'text-decoration': properties.decoration || 'none',
								'text-indent': properties.indent || 0,/* not formally defined in CSS3:
								'text-orientation': properties.orientation || 'mixed',*/
								'text-overflow': properties.overflow || 'clip',/* not formally defined in CSS3:
								'text-rendering': properties.rendering || 'auto',*/
								'text-transform': properties.transform || 'none',
								'color': properties.color || 'black'
						},
						CSSStyleDeclaration.textShadowFor({
								'offset-right': properties['shadow-right'],
								'offset-bottom': properties['shadow-bottom'],
								'blur-radius': properties['shadow-blur'],
								'color': properties['shadow-color']
						}),
						true) ;

						this.style.setRules(Component.createComponentIDSelector(this), o) ;

				},
				/**
				* @contract This operation is supposed to replace the text content of the element containing the text data for this text container with the result of parsing the given string.
				* @todo sanitation, parsing instead of `innerHTML` property
				*/
				setFormattedText: function setFormattedText(text)
				{
/*@qnd*/
this.target.innerHTML = text ;
				}
		}
}