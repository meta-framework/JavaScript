/*
@identifier org.meta.web.Template
@extend org.meta.Object
@description An object wrapper for a DOM template.
*/
{
		/**
		* @param (Document) document The document containing the DOM template.
		*/
		main: function main(document)
		{
				this.document = document ;
		},
		global:
		{
				importDefinition: function importDefinition(definition, template)
				{
				},
				/**
				* @param (Node) definition A processing instruction node containing the template macro definition
				*/
				parseDefinition: function parseDefinition(definition)
				{
				},
				/**
				* @param (String) parameter The definition's formal parameter list
				*/
				parseDefinitionParameter: function parseDefinitionParameter(parameter)
				{
				},
				/**
				* @param (String) parameter The definition body.
				*/
				parseDefinitionBody: function parseDefinitionBody(body)
				{
				},
				addToScope: function addToScope(scope, binding/*...*/)
				{
				},
				removeFromScope: function removeFromScope(scope, binding/*...*/)
				{
				}
		},
		local:
		{
				build: function build( )
				{
				}
		}
}