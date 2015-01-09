/*
@identifier org.meta.web.css.CSSStyleDeclaration
@extend org.meta.Object
@require org.meta.util.StringBuilder, org.meta.web.css.CSS
@description An object wrapper for a native `CSSStyleDeclaration` object (or equivalent).
@link https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration, http://msdn.microsoft.com/de-de/library/ff975068%28v=vs.85%29.aspx
@todo Add an operation that returns a scoped style element (https://developer.mozilla.org/de/docs/Web/HTML/Element/style#A_scoped_stylesheet )
*/
{
		main: function main(declaration) { this.declaration = declaration ; },
		global:
		{
				/**
				* @param (Object) properties ...
				* @todo polyfill
				*/
				backgroundFor: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function backgroundFor(properties)
						{
						
								return {
										'background-attachment': properties.attachment || 'scroll',
										'background-position': properties.position || 'top left',
										'background-repeat': properties.repeat || 'no-repeat',
										'background-size': properties.size || 'contain',
										'background-image': properties.image || 'transparent'
								} ;
						}
						else
error('Not implemented') ;
				})( ),
				/**
				* @param (Object) properties ...
				* @todo polyfill
				*/
				shadowFor: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function shadowFor(properties)
						{
						
							// variables
							
							var property ;
							
							//
							
								property = (properties.inset ? 'inset ' : '') + properties.offset + ' ' + properties.blur + ' ' + properties.color ;
							
							// return

								return {
										'-moz-box-shadow': property,
										'-webkit-box-shadow': property,
										'box-shadow': property
								} ;

						}
						else
error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow
				* @todo polyfill
				*/
				textShadowFor: (function( ) {
						if(! IS_IE || IE_VERSION >= 10.0) return function textShadowFor(properties)
						{
							
							//
							
								return {
										'text-shadow': stringFormat(
												'%s %s %s %s',
												properties['offset-right'] || 0,
												properties['offset-bottom'] || 0,
												properties['blur-radius'] || 0,
												properties['color'] || 'black'
										)
								}
						}
error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/de/docs/Web/CSS/border
				* @todo border radius
				* @todo polyfill
				*/
				borderFor: function borderFor(properties)
				{
				
					// variables
				
					var width, color, style ;
					
					//
					
						width = properties.width || '0' ;
						color = properties.color || 'transparent' ;
						style = properties.style || 'none' ;

						return {
								'border-top-width': properties['top-width'] || width,
								'border-top-color': properties['top-color'] || color,
								'border-top-style': properties['top-style'] || style,
								'border-right-width': properties['right-width'] || width,
								'border-right-color': properties['right-color'] || color,
								'border-right-style': properties['right-style'] || style,
								'border-bottom-width': properties['bottom-width'] || width,
								'border-bottom-color': properties['bottom-color'] || color,
								'border-bottom-style': properties['bottom-style'] || style,
								'border-left-width': properties['left-width'] || width,
								'border-left-color': properties['left-color'] || color,
								'border-left-style': properties['left-style'] || style,
						}

				}
		},
		local:
		{
				rules: null,
				declaration: null,
				/**
				* @contract Set the given rule replacing an existing one.
				*/
				setRule: function setRule(selector, name, value, modifier)
				{
					
					// variables
					
					var rules, rule ;
					
					//

						if(! (rules = this.rules)) rules = this.rules = { } ;
						if(! (rule = rules[selector])) rule = rules[selector] = { } ;
					
						rule[name] = modifier ? value + ' !' + modifier : value ;

				},
				/**
				* @contract Set the given rule not replacing an existing one.
				*/
				addRule: function setRule(selector, name, value, modifier)
				{
					
					// variables
					
					var rules, rule ;
					
					//

						if(! (rules = this.rules)) rules = this.rules = { } ;
						if(! (rule = rules[selector])) rule = rules[selector] = { } ;
						if(! rule[name]) rule[name] = modifier ? value + ' !' + modifier : value ;

				},
				/**
				* @contract Set rules in the rule set but do not replace existing ones.
				*/
				addRules: function addRules(selector, rule_set)
				{
				
					// variables
					
					var rules, rule ;
					
					//
					
						if(! (rules = this.rules)) rules = this.rules = { } ;

						if((rule = rules[selector])) objectMerge(rule, rule_set, false) ;
						else this.rules[selector] = rule_set ;

				},
				/**
				* @contract Set rules in the rule set replacing existing ones.
				*/
				setRules: function setRules(selector, rule_set)
				{
					
					// variables
					
					var rules, rule ;
					
					//

						if(! (rules = this.rules)) rules = this.rules = { } ;

						if((rule = rules[selector])) objectMerge(rule, rule_set, true) ;
						else this.rules[selector] = rule_set ;

				},
				/**
				*
				*/
				getRule: function getRule(selector)
				{
						if(this.rules) return this.rules[selector] ;
						else return null ;
				},
				removeRule: function removeRule(selector)
				{
						if(this.hasRule(selector)) delete this.rules[selector] ;
				},
				hasRule: function hasRule(selector) { return isSet(selector, this.rules) ; },
				/**
				* @contract Use the CSSStyleDeclaration object's operations to set a style property. On an HTML element this will set the "style" attribute.
				*/
				declareProperty: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function declareProperty(name, value, modifier)
						{
								this.declaration.declareProperty(name, value, modifier) ;
						}
						else return function declareProperty(name, value, modifier)
						{
								this.declaration[name] = modifier ? value + ' !' + modifier : value ;
						}

				})( ),
				/**
				* @contract Retrieve the value of the property for the given name using the CSSStyleDeclaration object's operations. On an HTML element this will return the value of the property as declared in the "style" attribute.
				*/
				getDeclaredProperty: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function getProperty(name)
						{
								this.declaration.getPropertyValue(name) ;
						}
						else return function getProperty(name)
						{
								return this.declaration[name] ;
						}
				})( ),
				/**
				*/
				getDeclaredStyle: (function( ) {
						if(IE_VERSION >= 9.0 || ! IS_IE) return function getDeclaredStyle( )
						{
								return this.declaration.cssText ;
						}
						else return function getDeclaredStyle( )
						{
error('Not implemented') ;
						}
				})( ),
				/**
				* @contract Construct a CSS style string from the rules stored within this CSSStyleDeclaration instance.
				*/
				toStyleString: function toStyleString( )
				{
				
					// variables
					
					var builder = new StringBuilder(null) ;
					
					//

						objectEach(this.rules, function(selector, properties) {
								builder.append(selector)
								.append('{')
								objectEach(properties, function(v, k) {
										builder.append(k)
										.append(':')
										.append(v)
										.append(';') ;
								}) ;
								builder.append('}') ;
						}) ;

					// return
					
					return builder.build( ) ;

				}
		}
}