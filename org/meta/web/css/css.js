/*
@package org.meta.web.css
@require org.meta.standard, org.meta.web.dom.html 
@provide CSSStyleSheet
*/
{
/*@todo: add style adapters and utility functions for typical element stylings.*/
		CSS:
		{
				extend: 'org.meta.standard.Object',
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				local:
				{
				
						/**
						* Return the the number of rule blocks associated with the given `CSSStyleSheet` object.
						*
						* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
						* @return (Integer)
						*/
						lengthOf: (function( ) {
						
							//

								switch(Meta.constant('IE_VERSION'))
								{
								
										/*Not IE.*/
										
										case -1: return function lengthOf(sheet) { return sheet.cssRules.length } ;
										
										default: return function lengthOf(sheet) { return sheet.rules.length } ;

								}
						
						})( ),
						/**
						* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule
						*/
						addRuleBlock: (function( ) {
							
							// variables
							
							var version ;
							
							//
							
								if((version = Meta.constant('IE_VERSION')) >= 9.0 || version === -1)
										return function addRuleBlock(sheet, block)
										{

											// variables
											
											var i ;
											
											//

												sheet.insertRule(block, (i = org.meta.web.css.CSS.lengthOf(sheet))) ;
												
											// return

											return i ;
											
										}
								else
										return function addRuleBlock(sheet, block)
										{
										
											// variables
											
											var i ;
											
											//

												sheet.addRule((i = org.meta.web.css.CSS.lengthOf(sheet)), block) ;
												
											// return

											return i ;
											
										}

						})( ),
						/**
						* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.deleteRule
						*/
						removeRuleBlock: (function( ) {
						
							// variables
							
							var version ;
							
							//
							
								if((version = Meta.constant('IE_VERSION')) >= 9.0 || version === -1)
										return function removeRuleBlock(sheet, index) { sheet.deleteRule(index) ; } ;
								else
										return function removeRuleBlock(sheet, index) { sheet.removeRule(index) ; } ;

						})( ),
						processRuleBlock: function processRuleBlock(rules, sheet)
						{

							// variables
							
							var result = '' ;
							
							//

								new org.meta.standard.Tokenizer(rules)
								.tokenize(
										';',
										function(rule, index) {
										
											// variables
											
											var s ;
											
											//
											
												s = rule.trim( ) ;

												if(s.charAt(0) === Meta.constant('CHARACTERS').AT) s = sheet.getRuleBlock(s.substring(1)) ;

												result += (index > 0 ? ';' : '') + s ;
												
										}
								) ;
								
							// return

							return result ;
						
						},
						/**
						* @link http://meyerweb.com/eric/tools/css/reset/
						*/
						applyResetStyle: function applyResetStyle(sheet)
						{

							//
/*@note: generally a selector '<class-name> <class-name>' is preferrable to a selector '<class-name> [>\s] <element-name>' because it is independent of the element structure.*/
								sheet.addRuleBlock(
										'html, body, div, span, applet, object, iframe,'
										+ 'h1, h2, h3, h4, h5, h6, p, blockquote, pre,'
										+ 'a, abbr, acronym, address, big, cite, code,'
										+ 'del, dfn, em, img, ins, kbd, q, s, samp,'
										+ 'small, strike, strong, sub, sup, tt, var,'
										+ 'b, u, i, center,'
										+ 'dl, dt, dd, ol, ul, li,'
										+ 'fieldset, form, label, legend,'
										+ 'table, caption, tbody, tfoot, thead, tr, th, td,'
										+ 'article, aside, canvas, details, embed,'
										+ 'figure, figcaption, footer, header, hgroup,'
										+ 'menu, nav, output, ruby, section, summary,'
										+ 'time, mark, audio, video',
										'margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline;'
								) ;
								
								sheet.addRuleBlock('article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section', 'display: block') ;
								sheet.addRuleBlock('body', 'line-height: 1') ;
								sheet.addRuleBlock('ol, ul', 'list-style: none') ;
								sheet.addRuleBlock('blockquote, q', 'quotes: none') ;
								sheet.addRuleBlock('blockquote:before, blockquote:after, q:before, q:after', 'content: ""; content: none') ;
								sheet.addRuleBlock('table', 'border-collapse: collapse; border-spacing: 0') ;

						},
						/**
						* Add rules for generic element styles (e.g. blocks, boxes, tables).
						*
						* This closely follows the YAML pattern.
						*
						* @link http://www.yaml.de
						*/
						applyGenericStyle: function applyGenericStyle(sheet)
						{
						
							//
/*@note: generally a selector '<class-name> <class-name>' is preferrable to a selector '<class-name> [>\s] <element-name>' because it is independent of the element structure.*/
								sheet.addRuleBlock('.element-block', 'display: block; position: relative') ;
								sheet.addRuleBlock('.element-box', 'display: block; position: relative; top: 0; height: 0; width: 0') ;
								sheet.addRuleBlock('.element-table', 'display: table; border-collapse: collapse; border-spacing: 0') ;
								sheet.addRuleBlock('.element-inline', 'display: inline; position: relative') ;
								sheet.addRuleBlock('.element-text', 'display: inline; position: relative; line-height: inherit; font-size: inherit; color: inherit; text-transform: inherit; font-variant: inherit; -moz-user-select: -moz-none; cursor: default') ;
								sheet.addRuleBlock('.element-clearfloat', 'clear: both') ;
								sheet.addRuleBlock('.element-image', '') ;
								
								/*Block elements (containers with varying dimension determined bottom-up by content).*/

								sheet.addRuleBlock('.element-block.layout-container', 'margin: 0; padding: 0') ;
//								sheet.addRuleBlock('.element-block.layout-content', 'display: inline') ;
								sheet.addRuleBlock('.element-block.layout-inline', 'display: inline-block; width: 0; height: 100%') ;
								sheet.addRuleBlock('.element-block.layout-cover', 'height: 100%; width: 100%') ;
								sheet.addRuleBlock('.element-block.layout-cover-height', 'width: auto; height: 100%') ;
								sheet.addRuleBlock('.element-block.layout-cover-width', 'width: 100%; height: auto') ;
								sheet.addRuleBlock('.element-block.layout-align-center', 'margin-left: auto; margin-right: auto') ;
								sheet.addRuleBlock('.element-block.layout-align-right', 'margin-left: 0; margin-right: auto') ;
								sheet.addRuleBlock('.element-block.layout-align-right', 'margin-left: auto; margin-right: 0') ;
								sheet.addRuleBlock('.element-block.layout-overflow-horizontal', 'overflow-x: auto ; overflow: hidden') ;
								sheet.addRuleBlock('.element-block.layout-overflow-vertical', 'overflow-y: auto ; overflow: hidden') ;
								
								sheet.addRuleBlock('.element-block.layout-column-container', 'display: table; width: 100%; table-layout: fixed') ;
								sheet.addRuleBlock('.element-block.layout-column-container .layout-column:first-of-type', 'float: left') ;
								sheet.addRuleBlock('.element-block.layout-column-container .layout-column:last-of-type', 'float: right') ;
								sheet.addRuleBlock('.element-block.layout-column', '@.element-block.layout-inline') ;
								
								/*Box elements (containers with arbitrary fixed dimension and position. Dimension is determined top-down by specifying explicit width and height).*/
								
								//..
								
								/*Image elements.*/
/*@todo: wrap this in a method `createBackground`*/
								/*
								.background-cover {
										background: url('*') no-repeat; /*@note To modify this for a given background: copy, rename (!) and replace the asterisk '*' with the desired background's image URL.*
										background-size: cover;
										background-position: center center;
										-ms-filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(Src=\'*\',SizingMethod=scale)';
										filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(Src='*',SizingMethod=scale);
								}
								*/
								
								sheet.addRuleBlock('.element-image.layout-cover-width', 'height: auto !important; width: 100% !important; margin-top: auto !important; margin-bottom: auto !important') ;
								sheet.addRuleBlock('.element-image.layout-cover-height', 'height: 100% !important; width: auto !important; margin-left: auto !important; margin-right: auto !important') ;
	
								/*Table elements.*/
								
								sheet.addRuleBlock('.element-table.layout-blocktable', 'table-layout: fixed; width: 100%') ;
								sheet.addRuleBlock('.element-table.layout-row', 'display: table-row') ;
								sheet.addRuleBlock('.element-table.layout-header, .element-table.layout-field', 'display: table-cell') ;
								
								/*Text elements.*/

								sheet.addRuleBlock('.element-text.format-bold', 'font-weight: bold') ;
								sheet.addRuleBlock('.element-text.format-italic', 'font-style: italic') ;
								sheet.addRuleBlock('.element-text.format-uppercase', 'text-transform: uppercase') ;
								sheet.addRuleBlock('.element-text.format-family-sfdefault', 'font-family: Tahoma, Verdana, Helvetica, Arial, sans-serif') ;
								sheet.addRuleBlock('.element-text.format-family-rmdefault', 'font-family: Georgia, Palatino, Garamond, Times, serif') ;
								sheet.addRuleBlock('.element-text.format-family-msdefault', 'font-family: Monaco, "Courier New", Courier, monospace') ;
								sheet.addRuleBlock('.element-text.format-size-tiny', 'font-size: 0.5em') ;
								sheet.addRuleBlock('.element-text.format-size-small', 'font-size: 0.75em') ;
								sheet.addRuleBlock('.element-text.format-size-normal', 'font-size: 1em') ;
								sheet.addRuleBlock('.element-text.format-size-medium', 'font-size: 2em') ;
								sheet.addRuleBlock('.element-text.format-size-large', 'font-size: 3em') ;
								sheet.addRuleBlock('.element-text.format-color-default',  'color: #191919') ;
								
								sheet.addRuleBlock('.element-text.layout-align-center', 'text-align: center') ;
								sheet.addRuleBlock('.element-text.layout-align-left', 'text-align: left') ;
								sheet.addRuleBlock('.element-text.layout-align-right', 'text-align: right') ;
								
						}
				}
		},
		CSSStyleSheet:
		{
				extend: 'org.meta.standard.Object',
				main: function main(sheet, element)
				{
				
						this.sheet = sheet ;
						this.element = element ;
						
						this.blocks = { } ;
				
				},
				global:
				{
						MIME_TYPE: 'text/css',
						MEDIA_SCREEN: 'screen',
						create: function create(attributes)
						{

							// variables

							var sheet,
								e,
								d,
								l ;
							
							//
	
								/*Create a script element in order to force creation of a `CSSStyleSheet` Object.*/

								e = org.meta.web.dom.html.HTMLElement.create('style', attributes, null) ;
								d = Meta.constant('DEFAULT_DOCUMENT') ;

								org.meta.web.dom.DOM.append(d.head, e.root) ;

								/*Get a reference to the style sheets collection of the default document.*/
								
								l = d.styleSheets ;
								
								sheet = new this(l.item(l.length - 1), e) ;


							// return

							return sheet ;

						}
				},
				local:
				{
						destroy: function destroy( )
						{

							// variables
							
							var i ;
							
							//
							
								/*Delete all rules from the style sheet object detach and destroy the element.*/
								
								this.clear( ) ;

								org.meta.web.dom.DOM.remove(
										Meta.constant('DEFAULT_DOCUMENT').head,
										this.element.root
								) ;

								this.element.destroy( ) ;
								
								this.super.destroy.call(this) ;

						},
						clear: function clear( )
						{
							
							// variables
							
							var i ;
							
							//
							
								i = org.meta.web.css.CSS.lengthOf(this.sheet) ;
								
								while(--i >= 0) org.meta.web.css.CSS.removeRuleBlock(this.sheet, i) ;
/*
										if(typeof this.sheet.deleteRule !== 'undefined') this.sheet.deleteRule(i) ;
										else if(typeof this.sheet.removeRule !== 'undefined') this.sheet.removeRule(i) ;
*/						
						},
						/**
						* Add a rule block for the given selector to this CSSStyleSheet.
						* 
						* Rule blocks may be referenced using the syntax '@<selector>' (e.g '@.element-block'). The rules identified by the selector will be _copied_ to the rule block for the given selector. This implies that rules which are dependant on the selector of the referenced rule block (e.g. descendant or pseudo-class selectors) won't apply since the selector is not the same.
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
						* @return (Integer) The index of the rule block within the StyleSheet's rule list.
						*/
						addRuleBlock: function addRuleBlock(selector, rules)
						{

							// variables
							
							var index,
								s ;
							
							//

								/*To avoid unnecessary computational and storage complexity, existing rule blocks for a given selector are removed first. This ensures that the indices within `blocks` match only a single selector.*/
							
								if(this.blocks[selector]) this.removeRuleBlock(selector) ;
								
								/*Expand rule references.*/
								
								s = org.meta.web.css.CSS.processRuleBlock(rules, this) ;
								
								/*Add the rule block.*/

								index = this.blocks[selector] = org.meta.web.css.CSS.addRuleBlock(this.sheet, selector + '{' + s + '}') ;
								
							// return
							
							return index ;
						
						},
						getRuleBlock: function getRuleBlock(selector)
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
						*/
						removeRuleBlock: function removeRuleBlock(selector)
						{

							// variables
							
							var i ;
							
							//
							
								if((i = this.blocks[selector]))
								{

										org.meta.web.css.CSS.removeRuleBlock(this.sheet, i) ;
										
										/*Reduce the indices of rule blocks after the removed rule block.*/
										
										Meta.each(this.blocks, function(key, value, blocks) {
												if(value > i) blocks[key]-- ;
										}) ;

										return true ;
										
								}
								
							// return
							
							return false ;
						
						}
				}
		}
}