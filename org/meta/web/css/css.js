/*
@identifier org.meta.web.css.CSS
@extend org.meta.Object
@require org.meta.util.Tokenizer, org.meta.web.dom.html.HTML
@todo: add style adapters and utility functions for typical element stylings.
@todo add full list of media queries
*/
{
		global:
		{
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
					
						if(IE_VERSION === -1.0) return function ruleAt(sheet, index) { return sheet.cssRules.item(i1) ; }
						else
error('Unsupported Operation') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871
				*/
				insertRule: (function( ) {
						if(IE_VERSION >= 9.0 || IE_VERSION === -1.0) return function insertRule(sheet, rule, index) { return sheet.insertRule(rule, index) ; }
						else error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535871
				* @todo rework: polyfill requires selector and rule block split for
				*/
				addRule: (function( ) {
						if(IE_VERSION >= 9.0 || IE_VERSION === -1.0) return function addRule(sheet, rule)
						{

							// variables
							
							var i ;
							
							//

								sheet.insertRule(rule, (i = CSS.lengthOf(sheet))) ;
								
							// return

							return i ;
							
						}
						else error('Not implemented') ;
						/*
						else return function addRule(sheet, rule)
						{
						
							// variables
							
							var i ;
							
							//

								sheet.addRule((i = CSS.lengthOf(sheet)), rule) ;
								
							// return

							return i ;
							
						}*/
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.deleteRule
				*/
				removeRule: (function( ) {
					
					//
					
						if(IE_VERSION >= 9.0 || IE_VERSION === -1) return function removeRule(sheet, index) { sheet.deleteRule(index) ; } ;
						else return function removeRule(sheet, index) { sheet.removeRule(index) ; } ;

				})( )
		}
}