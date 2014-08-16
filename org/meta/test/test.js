/*
@package org.meta.test
@require org.meta.standard, org.meta.web.css, org.meta.web.dom.html
@provide Test, Unit, Case
*/
{
		Test:
		{
				extend: 'org.meta.standard.Object',
				main: function main(name, root, style)
				{

						this.name = name ;
						this.root = root ;
						this.style = style ;

						this.current = null ;
						this.branches = [ ] ;
						this.units = { } ;
						this.report = { } ;
						
				},
				global:
				{
						create: function create(name)
						{

							// variables

							var container, section, content,
								s,
								e,
								h, 
								c,
								d,
								t ;
							
							//

								s = org.meta.web.css.CSSStyleSheet.create({media: org.meta.web.css.CSSStyleSheet.MEDIA_SCREEN, type: org.meta.web.css.CSSStyleSheet.MIME_TYPE}) ;

								org.meta.web.css.CSS.applyResetStyle(s) ;
								org.meta.web.css.CSS.applyGenericStyle(s) ;

								s.addRuleBlock('*.element-text', 'line-height: 1.2em;') ;
								s.addRuleBlock('.element-text.format-color-success', 'color: #44aa44') ;
								s.addRuleBlock('.element-text.format-color-failure', 'color: #aa4444') ;
								s.addRuleBlock('.element-text.format-color-high', 'color: #aa8844') ;
								s.addRuleBlock('.element-text.format-color-low', 'color: #4444aa') ;
								s.addRuleBlock('*.element-table', 'color: #191919; font-size: 0.85em;') ;
								s.addRuleBlock('.element-table thead', 'padding: 1em') ;
								s.addRuleBlock('.element-table th .element-text', 'font-weight: bold') ;
								s.addRuleBlock('.element-table th, .element-table td', 'padding: 1em') ;
								s.addRuleBlock('.element-table thead th:first-of-type', 'text-align: left') ;
								s.addRuleBlock('.element-table tbody td', 'text-align: center;') ;
								s.addRuleBlock('.element-table tbody td:first-of-type', 'text-align: left') ;
								s.addRuleBlock('.section', '') ;
								s.addRuleBlock('.section-header', 'padding: 1em 2em') ;
								s.addRuleBlock('.section-header .element-text', '@.element-text.format-size-large; @.element-text.format-family-sfdefault; @.element-text.format-uppercase; color: #7d7d7d') ;
								s.addRuleBlock('.section-header .element-text.format-subheader', '@.element-text.format-size-medium') ;
								s.addRuleBlock('.section-header .element-text.format-subsubheader', 'font-size: 1.25em') ;
								s.addRuleBlock('.section-content', 'border-left: 0.5em solid #7d7d7d') ;

								container = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper'}) ;
								e = container.getContentElement( ) ;
								e.setClass('element-block layout-wrapper section') ;
								e.setAttribute('id', 'test-reports') ;

								h = org.meta.web.dom.html.HTMLHeader.create('summary', {class: 'element-block layout-wrapper section-header'})
								.attach(container) ;
								h.getContentElement( )
								.setClass('element-text') ;
/*
								section = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section', id: 'test-reports'})
								.attach(container) ;

								h = org.meta.web.dom.html.HTMLHeader.create('summary', {class: 'element-block layout-wrapper section-header'})
								.attach(section) ;
								h.getContentElement( )
								.setClass('element-text') ;

								content = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section-content'})
								.attach(section) ;
								content.getContentElement( )
								.setClass('element-block layout-wrapper section') ;
								
//								section = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section'})
//								.attach(content) ;
								
								h = org.meta.web.dom.html.HTMLHeader.create('environment', {class: 'element-block layout-wrapper section-header'})
								.attach(section) ;
								h.getContentElement( )
								.setClass('element-text format-subheader') ;
								
								content = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section-content'})
								.attach(section) ;
			
								/*Add a column set for environment information.*

								d = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper'})
								.attach(content) ;
								d.getContentElement( )
								.setClass('element-block layout-column-wrapper') ;

								e = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-column', style: 'width: 20%;'}) ;
								org.meta.web.dom.html.HTMLLabel.create('Current Date')
								.attach(e) ;
								c.addColumn(e) ;
								
								e = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-column', style: 'width: 80%;'}) ;
								org.meta.web.dom.html.HTMLParagraph.create(new Date( ).toUTCString( ))
								.attach(e) ;
								c.addColumn(e) ;
								
								c = org.meta.web.dom.html.HTMLColumnContainer.create({class: 'element-block layout-wrapper'})
								.attach(content) ;
								c.getContentElement( )
								.setClass('element-block layout-column-set') ;

								e = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-column', style: 'width: 20%;'}) ;
								l = org.meta.web.dom.html.HTMLLabel.create('User Agent')
								.attach(e) ;
								l.setClass('element-text format-weight-bold') ;
								c.addColumn(e) ;
								
								e = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-column', style: 'width: 80%;'}) ;
								org.meta.web.dom.html.HTMLParagraph.create(Meta.constant('DEFAULT_VIEW').navigator.userAgent)
								.attach(e) ;
								c.addColumn(e) ;

								section = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-wrapper section'})
								.attach(container) ;
								h = org.meta.web.dom.html.HTMLHeader.create('overview', {class: 'element-block layout-wrapper section-header'})
								.attach(section) ;
								h.getContentElement( )
								.setClass('element-text format-header') ;
						
								content = section.append(org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-wrapper section-content', id: 'test-overview'})) ;
								
								section = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-wrapper section'})
								.attach(content) ;

								h = org.meta.web.dom.html.HTMLHeader.create('units', {class: 'element-block layout-wrapper section-header'})
								.attach(section) ;
								h.getContentElement( )
								.setClass('element-text format-subheader') ;
								
								content = org.meta.web.dom.html.HTMLContainerElement.create({class: 'element-block layout-wrapper section-content', id: 'unit-tests'})
								.attach(section) ;
								
								/*Append upon window load.*/

								if(! Meta.constant('DEFAULT_DOCUMENT').body) window.onload = function( ) { org.meta.web.dom.DOM.append(Meta.constant('DEFAULT_DOCUMENT').body, container.root) ; } ;
								else org.meta.web.dom.DOM.append(Meta.constant('DEFAULT_DOCUMENT').body, container.root) ;

							// return
							
							return new this(name, container, s)

						}
				},
				local:
				{
						destroy: function destroy( )
						{

								this.style.destroy( ) ;
								this.root.destroy( ) ;

								this.super.destroy.call(this) ;							

						},
						beginBranch: function beginBranch(name) { this.branches[this.branches.length] = name ; this.units[name] = [ ] ; this.current = name ; },
						endBranch: function endBranch( ) { this.current = null ; return this ; },
						test: function test(unit)
						{
						
							// variables
							
							var division,
								d,
								h ;
								
							//
/*
								division = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section-content'}) ;
Meta.log('unit-test-container: %s', org.meta.web.dom.html.HTML.find(this.root.root, '#unit-tests').iterable.get(0)) ;
								org.meta.web.dom.DOM.append(
										org.meta.web.dom.html.HTML.find(this.root.root, '#unit-tests')
										.iterable
										.get(0),
										division.root
								) ;

								d = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section', title: unit.name})
								.attach(division) ;
								
								h = org.meta.web.dom.html.HTMLHeader.create(unit.name, {class: 'element-block layout-wrapper section-header'}) ;
								h.getContentElement( )
								.setClass('element-text format-subsubheader') ;
								h.attach(d) ;
								
								d = org.meta.web.dom.html.HTMLDivision.create({class: 'element-block layout-wrapper section-content'})
								.attach(d) ;

								/*Iterate over test cases.*

								Meta.each(unit.cases, function(item, index) {

									// variables
									
									var h,
										e,
										o,
										t1, t2 ;
									
									//
									
										h = org.meta.web.dom.html.HTMLHeader.create('Case #' + (index + 1), {class: 'element-block layout-wrapper section-header'}) ;
										h.getContentElement( )
										.setClass('element-text format-subsubheader') ;
										h.attach(c) ;
/*
										t1 = content.append(
												org.meta.web.dom.html.HTMLTable.create({class: 'element-table variant-blocktable'})
										) ;
										t1.addRow(
												org.meta.web.dom.html.HTMLLabel.create('Semantic Profile', {class: 'element-text variant-bold'}),
												(t2 = org.meta.web.dom.html.HTMLTable.create({class: 'element-table'}))
										) ;
										
										t2.addColumn(org.meta.web.dom.html.HTMLLabel.create('Execution Context', {class: 'element-text text-family-sfdefault text-weight-bold'})) ;
										t2.addColumn(org.meta.web.dom.html.HTMLLabel.create('Input Parameter', {class: 'element-text text-family-sfdefault text-weight-bold'})) ;
										
										t2.addRow(
												org.meta.web.dom.html.HTMLParagraph.create(Meta.print(c.context)),
												org.meta.web.dom.html.HTMLParagraph.create(Meta.print(c.input))
										) ;

										/*Semantic profile.*
										
										content.append(
												org.meta.web.dom.html.HTMLElement.parse(
														'<div class="element-block section-content block-column-wrapper">'
														+ '<div style="width: 20%"><p class="element-text text-family-sfdefault">Semantic Profile</p></div>'
														+ '<div id="' + unit.name + '-#' + index + '-semantics" style="width: 80%"></div>'
														+ '</div>'
												)
										) ;

										//... function signature

										t = content.find('*[id~="' + unit.name + '-#' + index + '-semantics"]')
										.append(
												org.meta.web.dom.html.HTMLTable.create({style: {table: 'element-table variant-blocktable'}})
										) ;

										t.addColumn(org.meta.web.dom.html.HTMLLabel.create('Execution Context')) ;
										t.addColumn(org.meta.web.dom.html.HTMLLabel.create('Input Parameter')) ;

										t.addRow(
												org.meta.web.dom.html.HTMLParagraph.create(Meta.print(c.context)),
												org.meta.web.dom.html.HTMLParagraph.create(Meta.print(c.input))
										) ;

										/*Performance profile.*
										
										o = c.profile(unit.subject) ;
										b = o.correct ;
										
										content.append(
												org.meta.web.dom.html.HTMLElement.parse(
														'<div class="element-block section-content">'
														+ '<div class="element-block box-column-wrapper">'
														+ '<div style="width: 20%"><p class="element-text text-family-sfdefault">Performance Profile</p></div>'
														+ '<div id="' + unit.name + '-performance" style="width: 80%"></div>'
														+ '</div>'
														+ '</div>'
												)
										) ;
/*
										t = content.find('*[id="' + unit.name + '-performance"]')
										.append(org.meta.test.Table.create(this.root.getOwner( ))) ;
										
										t.addRow('time (average.)', o.time[2]) ;
										t.addRow('time (minimum)', o.time[0]) ;
										t.addRow('time (maximum)', o.time[1]) ;
										
										/*Add a row to the report table for this test case.*

										org.meta.test.Table.invoke(
												'addRow',
												t,
												[
														'<span class="element-text text-family-msdefault">' + Meta.print(o.context) + '</span>',
														'<span class="element-text text-family-msdefault">' + Meta.print(o.input, {length: 50}) + '</span>',
														'<span class="element-text text-family-msdefault">' + Meta.print(o.result, {depth:1, length: 50}) + '</span>',
														'<span class="element-text variant-' + (b ? 'success">correct</span>' : 'failure">erroneous</span>'),
														'time (avg.): ' + o.time[2] + 'ms<br/>(<span class="element-text variant-low">' + o.time[0] + 'ms</span> to <span class="element-text variant-high">' + o.time[1] + 'ms</span>)'
												]
										) ;

								}, this) ;
*/						
						}
				}
		},
		Unit:
		{
				extend: 'org.meta.standard.Object',
				main: function main(name, subject, signature, cases)
				{

						this.name = name ;
						this.subject = subject ;
						this.signature = signature ;
						this.cases = cases ;

				},
				global:
				{
						create: function create(name, subject, signature/*, case...*/)
						{
							
							// variables
							
							var a ;
							
							//
							
								/*Parse input signature*/
														
								if((a = signature.input))
								{
								
										signature.input = [ ] ;
								
										Meta.each(
												a,
												function(value, index)
												{
												
													// variables
													
													var	o = { },
														i = 0 ;
													
													//
													
														if((i = value.indexOf('?')) !== -1) o.optional = true ;
														else if((i = value.indexOf('*')) !== -1) o.optional = true, o.length = -1 ;
														
														o.type = value.substring(0, i) ;
														
														signature.input[signature.input.length] = o ;
												
												}
										) ;
										
								}

								a = Array.prototype.slice.call(arguments, 3) ;
								
							// return

							return new this(name, subject, signature, a) ;
						
						}
				},
				local:
				{
						length: function length( ) { return typeof this.cases === 'undefined' ? 0 : this.cases.length ; },
/*@deprecated*/
/*@todo: remove*/
						addCase: function addCase(result, parameter)
						{ throw 'Deprecated' ;

							// preconditions

								if(arguments.length > 2 && ! (parameter instanceof Array)) throw 'IllegalArgumentError: expected second argument to be Array.' ;
							
							//

								if(arguments.length === 2 && ! (parameter instanceof Array)) this.cases[this.cases.length] = [result, [parameter]] ;
								else this.cases[this.cases.length] = [result, parameter] ;
							
							//
							
							return this ;
						
						}

				}
		},
		Case:
		{
				extend: 'org.meta.standard.Object',
				main: function main(settings)
				{
						this.signature = settings.signature || {output: 'Void'} ;
						this.context = settings.context ;
						this.input = settings.input ;
						this.constraint = settings.constraint || org.meta.test.Case.DEFAULT_CONSTRAINT ;
						this.cycles = settings.cycles || org.meta.test.Case.DEFAULT_PROFILING_CYCLES ;
				},
				global: {
						DEFAULT_CONSTRAINT: function(profile) { return ! profile.error ; },
						DEFAULT_PROFILING_CYCLES: 100
				},
				local: {
						signature: null,
						context: null,
						input: null,
						constraint: null,
						profile: function profile(subject)
						{
						
							// variables
							
							var profile = { } ;
							
							//
							
								this.profileSemantics(subject, profile) ;
								this.profileTime(subject, profile) ;
							
							// return
							
							return profile ;
							
						},
						profileSemantics: function profileSemantics(subject, profile)
						{
						
							// variables
							
							var o,
								a,
								i,
								s ;
							
							//

								profile.input = this.input ;
								profile.context = this.context ;
								
								if((a = this.signature.input))
								{
								
										o = a[0] ;
										
										for(var i1 = -1, i2 = this.input.length, i3 = 0 ; ++i1 < i2 ; )
										{
										
												/*React to a type change.*/

												if((s = Meta.typeOf(this.input[i1])) === o.type) continue ;
												else
												{
												
														
												
												}
										
										}
												
								}

								try { o = subject.apply(this.context, this.input) ; }
								catch(error)
								{
								
										/*Test if the signature allows this error.*/

										//...
										
										profile.error = error ;

									// return
										
										return ;
										
								}
								
								if(Meta.typeOf(o) !== this.signature.output) 
								profile.output = o ;
								profile.correct = this.constraint.call(null, profile) ;

						},
						profileTime: function profileTime(subject, profile)
						{

							// variables
							
							var o,
								a,
								d,
								time, aggregate = 0, low = Number.MAX_VALUE, high = 0 ;
							
							//

								o = this.context ;
								a = this.input ;

								for(var i1 = -1, i2 = this.cycles ; ++i1 < i2 ; )
								{

										d = new Date( ) ;
										
										subject.apply(o, a) ;
										
										time = Math.ceil(Date.now( ) - d.getTime( )) ;
										aggregate += time ;

										if(time > high) high = time ;
										else if(time < low && time >= 0) low = time ;
								
								}

								profile.time = [low, high, aggregate / this.cycles] ;

						}
				}
		}
}