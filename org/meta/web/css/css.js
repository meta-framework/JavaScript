/*
@identifier org.meta.web.css.CSS
@extend org.meta.Object
@require org.meta.web.dom.html.HTML
@todo: add style adapters and utility functions for typical element stylings.
@todo add full list of media queries
*/
{
		global:
		{
				PROPERTY_MARGIN: 'margin',
				PROPERY_WIDTH: 'width',
				PROPERTY_HEIGHT: 'height',
				PROPERTY_BACKGROUND: 'background',
				MIME_CSS: 'text/css',
				MEDIA_SCREEN: 'screen',
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
				*/
				RULE_TYPE_STYLE: 1,
				RULE_TYPE_CHARSET: 2, // @charset
				RULE_TYPE_IMPORT: 3, // @import
				RULE_TYPE_MEDIA: 4, // @media
				RULE_TYPE_FONT_FACE: 5, // @font-face
				RULE_TYPE_PAGE_RULE: 6, // @page
				RULE_TYPE_KEYFRAMES_RULE: 7, // @keyframes
				RULE_TYPE_KEYFRAME_RULE: 8, // @keyframe
				RULE_TYPE_NAMESPACE_RULE: 9,
				RULE_TYPE_COUNTER_STYLE_RULE: 11,
				RULE_TYPE_SUPPORTS_RULE: 12,
				RULE_TYPE_DOCUMENT_RULE: 13,
				RULE_TYPE_FONT_FEATURE_VALUES: 14,
				RULE_TYPE_VIEWPORT_RULE: 15,
				RULE_TYPE_REGION_STYLE: 16,
				/**
				* Return the the number of rule blocks associated with the given `CSSStyleSheet` object.
				*
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
				* @return (Integer)
				*/
				lengthOf: (function( ) {
				
					//

						if(IE_VERSION === -1.0) return function lengthOf(sheet) { return sheet.cssRules.length } ;
						else return function lengthOf(sheet) { return sheet.rules.length } ;
				
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
				* @return (CSSRule) The css rule object for the given index
				*/
				ruleAt: (function( ) {
						
					//
					
						if(! IS_IE) return function ruleAt(sheet, index) { return sheet.cssRules.item(index) ; }
						else
error('Unsupported Operation') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871
				*/
				insertRule: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function insertRule(sheet, rule, index) { return sheet.insertRule(rule, index) ; }
						else error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871
				* @todo rework: polyfill requires selector and rule block split for
				*/
				addRule: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function addRule(sheet, rule)
						{

							// variables
							
							var i ;
							
							//

								sheet.insertRule(rule, (i = CSS.lengthOf(sheet))) ;
								
							// return

							return i ;
							
						}
						else error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.deleteRule
				*/
				removeRule: (function( ) {
					
					//
					
						if(IE_VERSION >= 9.0 || ! IS_IE) return function removeRule(sheet, index) { sheet.deleteRule(index) ; } ;
						else return function removeRule(sheet, index) { sheet.removeRule(index) ; } ;

				})( ),
				/**
				* @param (CSStyleDeclaration) style A CSSStyleDeclaration instance.
				* @todo polyfill
				* @deprecated refactored into CSSStyleDeclaration
				*/
				_setBackground: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function addBackground(style, selector,  properties)
						{
						
								if(isObject(properties)) style.addRules(selector, {
										'background-attachment': properties.attachment || 'scroll',
										'background-position': properties.position || 'top left',
										'background-repeat': properties.repeat || 'no-repeat',
										'background-size': properties.size || 'contain',
										'background-image': properties.image || 'transparent'
								}) ;
								else if(isString(properties)) style.setRule(selector, {'background': properties}) ;
								else throw new TypeError('Invalid Argument: Argument for formal parameter "properties" must be string or object.') ;
						}
						else
error('Not implemented') ;
				})( ),
				/**
				* @param (CSStyleDeclaration) style A `CSSStyleDeclaration` instance.
				* @todo polyfill
				* @deprecated refactored into CSSStyleDeclaration
				*/
				_setShadow: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function addShadow(style, properties)
						{
						
							// variables
							
							var property ;
							
							//
							
								if(isObject(properties)) property = (properties.inset ? 'inset ' : '') + properties.offset + ' ' + properties.blur + ' ' + properties.color ;
								else if(isString(properties)) property = properties ;
								else throw new TypeError('Invalid Argument: Argument for formal parameter "properties" must be string or object.') ;
							
								style.addRules(selector, {
										'-moz-box-shadow': property,
										'-webkit-box-shadow': property,
										'box-shadow': property
								}) ;

						}
						else
error('Not implemented') ;
				})( )
		}
}