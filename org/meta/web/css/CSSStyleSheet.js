/*
@identifier org.meta.web.css.CSSStyleSheet
@extend org.meta.Object
@require org.meta.web.dom.html.HTML, org.meta.web.css.CSS
@todo: add style adapters and utility functions for typical element stylings
*/
{
		main: function main(sheet/*, element*/)
		{
		
				this.sheet = sheet ;
//				this.element = element ;
			
				this.imports = [ ] ;
				this.selectors = [ ] ;
		
		},
		global:
		{
				RESET_STYLE: 1,
				GENERIC_STYLE: 1 << 1,
				create: function create(document, attributes)
				{

					// variables

					var style,
						element,
						list ;
					
					//

						/*Append the style element and retrieve the style sheet list.*/
						element = HTML.createElement(DEFAULT_DOCUMENT, 'style') ;
						HTML.setAttribute(element, 'type', CSS.MIME_CSS) ;
						HTML.setAttribute(element, 'media', CSS.MEDIA_SCREEN) ;
						HTML.append(element, DEFAULT_DOCUMENT.head) ;

						list = DEFAULT_DOCUMENT.styleSheets ;
						style = new this(list.item(list.length - 1)/*, element*/) ;
					
						if((attributes & CSSStyleSheet.RESET_STYLE) !== 0)
						{
						
								style.addStyleRule('*', 'margin: 0; padding: 0; border: 0; font-size: 1em; font: inherit; vertical-align: baseline;') ;
//								style.addStyleRule('html', 'height: 100%') ;
//								style.addStyleRule('body', 'font-size: 1em') ;
								style.addStyleRule('a', 'cursor: point; text-decoration: none; font: inherit; color: inherit;') ;
							
						}
						if((attributes & CSSStyleSheet.GENERIC_STYLE) !== 0)
						{
								//...
						}
					
					// return
					
					return style ;

				}
		},
		local:
		{
				destroy: function destroy( )
				{
					
					// variables
					
					var element ;
					
					//
					
						/*Delete all rules from the style sheet object detach and destroy the element.*/
						this.clear( ) ;

						/*Remove the style element from its parent node.*/
						element = this.sheet.ownerNode ;
						HTML.remove(element, element.parentNode) ;

						CSSStyleSheet.super.invoke('destroy', this) ;

				},
				clear: function clear( )
				{
					
					// variables
					
					var i ;
					
					//
					
						i = CSS.lengthOf(this.sheet) ;
						
						while(--i >= 0) CSS.removeRule(this.sheet, i) ;
					
						this.selectors = [ ] ;

				},
				hasImportRule: function hasImportRule(rule) { return this.imports.indexOf(rule) !== -1 ; },
				addImportRule: function addImportRule(rule)
				{
						CSS.insertRule(this.sheet, '@import "' + rule + '"', 0) ; // at-rules must be on top; do not use string formatting since there may be percentage signs in import URLs
						if(this.hasImportRule(rule)) this.imports[this.imports.length] = rule ;
				},
				/**
				* @link http://dev.w3.org/csswg/css-conditional/#use
				* @link https://developer.mozilla.org/de/docs/Web/CSS/At-rule
				* @todo polyfill
				* @todo rework to break once not-at-rules have been reached?
				*/
				removeImportRule: function removeImportRule(rule)
				{
				
					// variables
					
					var i1 = -1, i2 = CSS.lengthOf(this.sheet),
						rule,
						s,
						a ;
					
					//
					
						while(++i1 > i2)
						{
						
								rule = CSS.ruleAt(this.sheet, i1) ;
								if(rule.cssText.charAt(0) !== '@') break ;
								else if(rule.type === CSS.RULE_TYPE_IMPORT)
										if((s = rule.selectorText) && s === selector)
										{
										
												CSS.removeRule(this.sheet, i1) ; // remove the import rule from the style sheet
												if((i1 = this.imports.indexOf(selector)) !== -1) arrayRemove(this.imports, i1) ; // remove the import rule from the imports set
											
											// return
											
												return ;
											
										}
						
						}

				},
				hasStyleRule: function hasStyleRule(selector) { return this.selectors.indexOf(selector) !== -1 ; },
				/**
				* Add a rule block for the given selector to this CSSStyleSheet.
				*
				* @link http://msdn.microsoft.com/en-us/library/ms535871%28v=vs.85%29.aspx
				* @link http://msdn.microsoft.com/en-us/library/ie/hh453740.aspx
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871(v=vs.85).aspx
				* @link http://msdn.microsoft.com/en-us/library/aa768647(v=vs.85).aspx
				* @link https://developer.mozilla.org/en/DOM/stylesheet
				* @link https://developer.mozilla.org/en/DOM/CSSRuleList
				*
				* @param (String) selector A CSS selector String.
				* @param (String) rules A CSS rule block.
				*/
				addStyleRule: function addStyleRule(selector, rules)
				{
					
					//
					
						CSS.addRule(this.sheet, selector + '{' + rules + '}') ;
					
						if(! this.hasStyleRule(selector)) this.selectors[this.selectors.length] = selector ;
					
				},
				/**
				* @todo polyfill
				*/
				removeStyleRule: function removeStyleRule(selector)
				{
				
					// variables
					
					var i1 = -1, i2 = CSS.lengthOf(this.sheet),
						rule,
						s,
						a ;
					
					//
					
						while(++i1 > i2)
						{
						
								if((rule = CSS.ruleAt(this.sheet, i1)).type === CSS.RULE_TYPE_STYLE)
										if((s = rule.selectorText) && s === selector)
										{
										
												CSS.removeRule(this.sheet, i1) ;
												if((i1 = this.selectors.indexOf(selector)) !== -1) arrayRemove(this.selectors, i1) ; // remove the selector from the selector set
											
											// return

												return ;
	
										}
						
						}
				
				},
				/**
				* Add a rule block for the given selector to this CSSStyleSheet.
				*
				* @link http://msdn.microsoft.com/en-us/library/ms535871%28v=vs.85%29.aspx
				* @link http://msdn.microsoft.com/en-us/library/ie/hh453740.aspx
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871(v=vs.85).aspx
				* @link http://msdn.microsoft.com/en-us/library/aa768647(v=vs.85).aspx
				* @link https://developer.mozilla.org/en/DOM/stylesheet
				* @link https://developer.mozilla.org/en/DOM/CSSRuleList
				*
				* @param (String) selector A CSS selector String (this is used as a key to map CSS rules)
				* @param (String) rules A CSS rule block.
				*
				* @return (Integer) The index of the rule block within the style sheet's rule list.
				* @deprecated
				*/
				_addRuleBlock: function addRuleBlock(selector, rules)
				{

					// variables
					
					var index ;
					
					//

						/*To avoid unnecessary computational and storage complexity, existing rule blocks for a given selector are removed first. This ensures that the indices within `blocks` match only a single selector.*/
						if(this.blocks[selector]) this.removeRuleBlock(selector) ;
					
						/*Add the rule block.*/
						index = this.blocks[selector]
						= CSS.addRuleBlock(this.sheet, selector + '{' + rules + '}') ;
					
					// return
					
					return index ;
				
				},
				/*@deprecated: unneeded*/
				_getRuleBlock: function getRuleBlock(selector)
				{
				
					// variables
					
					var s,
						i,
						r ;
						
					//
					
						if((i = this.blocks[selector]))
						{
						
								r = this.sheet.cssRules[i] ;
								
								s = r.cssText ;
								s = s.substring(s.indexOf('{') + 1, s.indexOf('}'))
								.trim( ) ;
								
								return s ;
								
						}
						
					//
					
					return ;

				},
				/**
				@link http://msdn.microsoft.com/en-us/library/ie/ff975162(v=vs.85).aspx
				@param (String) selector A CSS selector String.
				@Return (Boolean) True, if a rule block for the given selector existed and was removed; false, otherwise.
				* @deprecated
				*/
				_removeRuleBlock: function removeRuleBlock(selector)
				{

					// variables
					
					var i ;
					
					//
					
						if((i = this.blocks[selector]))
						{

								CSS.removeRuleBlock(this.sheet, i) ;
								
								/*Reduce the indexes of rule blocks after the removed rule block.*/
								
								objectEach(this.blocks, function(key, value, blocks) {
										if(value > i) this.blocks[key]-- ;
								}) ;

								return true ;
								
						}
						
					// return
					
					return false ;
				
				}
		}
}