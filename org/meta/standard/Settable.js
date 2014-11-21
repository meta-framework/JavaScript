/*
@identifier org.meta.standard.Settable
@type abstract
@extend org.meta.standard.Object
@description An abstract type providing standard implementation of a state machine as well as an attribute bit map and related utility functions.
*/
{
		local: {
				state: 0,
				attributes: 0,
				/**
				* Return a string representation of the object inclduing the values of the `state` and `attribute` properties.
				*/
				toString: function toString( ) { return stringFormat('[object %s[state=%s, attributes=%s]]', this.constructor.reflect.name, this.state, this.attributes) ; },
				setState: function setState(state) { this.state = state ; },
				getState: function getState( ) { return this.state ; },
				setAttribute: function setAttribute(attribute)
				{

					//
					
						this.attributes |= attribute ;

					// return
					
					return this ;

				},
				hasAttribute: function hasAttribute(attribute)
				{
					return ((this.attributes & attribute) !== 0) ;
				},
				/**@todo: test*/
				removeAttribute: function removeAttribute(attribute)
				{
					
					//
					
						this.attributes &= ~(~this.attributes | attribute) ;
								
					// return
					
					return this ;

				}
		}
}