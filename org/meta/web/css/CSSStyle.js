/*
@identifier org.meta.web.css.CSSStyle
@extend org.meta.Object
@require org.meta.util.StringBuilder, org.meta.web.css.CSS
@description ...
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
						assert(! isSet(name, this.constructor.prototype), 'Illegal Argument: Invalid style property name (%s)', name) ;
						this.rules[name] = value ;
				},
				getProperty: function getProperty(name)
				{
						assert(! isSet(name, this.constructor.prototype), 'Illegal Argument: Invalid style property name (%s)', name) ;
						return this.rules[name] ;
				},
				toRuleString: function toRuleString( )
				{
				
					// variables
					
					var builder = new StringBuilder(null) ;
					
					//

						objectEach(this.rules, function(value, name) {
								if(! isSet(name, CSSStyle.prototype))
								{

										builder.append(name)
										.append(':')
										.append(value)
										.append(';') ;
								}
						}) ;

					// return
					
					return builder.build( ) ;

				}
		}
}