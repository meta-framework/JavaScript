/*
@identifier org.meta.web.css.CSSStyle
@extend org.meta.Object
@require org.meta.util.StringBuilder, org.meta.web.css.CSS
@description ...
@deprecated renamed to "CSSStyleDeclaration" in keeping with the W3C nomenclature
*/
{
		main: function main(argv) { this.rules = { } ; },
		global:
		{
				WIDTH: 'width',
				HEIGHT: 'height',
				BACKGROUND: 'background'/*
				...
				*/
		},
		local:
		{
				rules: null,
				setProperty: function setProperty(name, value)
				{
						this.rules[name] = value ;
				},
				getProperty: function getProperty(name)
				{
						return this.rules[name] ;
				},
				toRuleString: function toRuleString( )
				{
				
					// variables
					
					var builder = new StringBuilder(null) ;
					
					//

						objectEach(this.rules, function(value, name) {
								builder.append(name)
								.append(':')
								.append(value)
								.append(';') ;
						}) ;

					// return
					
					return builder.build( ) ;

				}
		}
}