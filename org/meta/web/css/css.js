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
				*/
				addRule: (function( ) {
					
					//
					
						if(IE_VERSION >= 9.0 || IE_VERSION === -1.0) return function addRule(sheet, block)
						{

							// variables
							
							var i ;
							
							//

								sheet.insertRule(block, (i = CSS.lengthOf(sheet))) ;
								
							// return

							return i ;
							
						}
						else return function addRule(sheet, block)
						{
						
							// variables
							
							var i ;
							
							//

								sheet.addRule((i = CSS.lengthOf(sheet)), block) ;
								
							// return

							return i ;
							
						}

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