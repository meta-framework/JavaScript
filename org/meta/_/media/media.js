Pulse.declare("pulse.media") 
.define(  {

		name: "Player",
		package: "pulse.media",
		type: Pulse.STRING_OBJECT_TYPE_ABSTRACT,
		prototype: "pulse.ui.Module",
		global: {

				PLAYER_STATE_IDLE: -1,
				PLAYER_STATE_READY: 0,
				PLAYER_STATE_LOADING: 1, 
				PLAYER_STATE_LOADED: 2,
				PLAYER_STATE_PLAYING: 3,
				PLAYER_STATE_PAUSED: 4,
				PLAYER_STATE_STOPPED: 5,
				PLAYER_STATE_FINISHED: 6,

				PLAYER_ERROR_INVALID_REQUEST: 0,
				PLAYER_ERROR_NOT_FOUND: 1,
				PLAYER_ERROR_RESTRICTED: 2,
				
				PLAYER_TYPE_AUTOR: "auto",
				PLAYER_TYPE_FLASH: "flash",
				PLAYER_TYPE_HTML5: "html5"

		},
		public: {
				load: function load(resource)
				{

					// set variables
					
					var o ;
					var s ;
					
					// set this

						this.pushState(pulse.ui.Module.STATE_READY,this.components) ;

						o = this.properties.player.object ;
						s = this.properties.player.methods.load ;

						this.properties.resource = resource ;

						o[s].call(o,resource) ;
						
					// return this
					
					return this ;

				},
				play: function play( )
				{

					// set: variables

					var i ;
					var o ;
					var s ;

					// set this
					
						this.pushState(pulse.ui.Module.STATE_READY,this.components) ;

						o = this.properties.player.object ;
						s = this.properties.player.methods.play ; 

						o[s].call(o) ;

					// return this
					
					return this ;

				},
				pause: function pause( )
				{

					// set variables
					
					var i ;
					var o ;
					var s ;

					// set this

						o = this.properties.player.object ;				
						s = this.properties.player.methods.pause ;
				
						o[s].call(o) ;


					// return this 
					
					return this ;

				},
				stop: function stop( )
				{

					// set variables
					
					var i ;
					var o ;
					var s ;

					// set this
			
						this.pushState(pulse.ui.Module.STATE_IDLE,this.components) ;

						o = this.properties.player.object ;				
						s = this.properties.player.methods.stop ;
				
						o[s].call(o) ;

					// return this 
					
					return this ;

				},
				toggle: function toggle( )
				{

					// set this
		
						if( this.isPaused( ) ) { this.play( ) ;	}
						else if( this.isPlaying( ) ) { this.pause( ) ; }

					// return this
					
					return this
						
				},
				pause: function pause( )
				{

					// set variables
					
					var o ;
					var s ;

					// set this

						o = this.properties.player.object ;
						s = this.properties.player.methods.pause ;
						
						o[s].call(o) ;
						
					// return this
					
					return this ;

				},
				/**
				* Jump to the time index in ms of the loaded video.
				* @param time (Integer) Positive `Integer` indicating the time index to jump to. 
				* @return this
				*/
				jump: function jump(time)
				{

					// set variables
					
					var i ;
					var o ;
					var s ;

					// set this

						if(  
								( i = this.getPlayerState( ) )  ===  pulse.media.Player.PLAYER_STATE_PLAYING  ||
								i === pulse.media.Player.PLAYER_STATE_PAUSED || i === pulse.media.Player.PLAYER_STATE_STOPPED ||
								i === pulse.media.Player.PLAYER_STATE_LOADED
						)
						{

								s = this.properties.player.methods.jump ;
								
								o[s].call(o,time) ;

						}
						
					// return this
					
					return this ;

				},
				volume: function volume(level)
				{
				
					// set variables

					var i ;
					
					// set player
					
						i = Math.round( (level * 100) ) ;

						o = this.properties.player.object ;
						s = this.properties.player.methods.volume ;
						
						o[s].call(o,i) ;
						
					// return this
					
					return this ;

				},
				time: function time( )
				{
				
					// set variables
					
					var i = -1;
					var o ;
					var s ;
					
					// set i
					
						o = this.properties.player.object ;
						s = this.properties.player.methods.time ;
						
						i = o[s].call(o) ;
					
					// return i
					
					return i ;

				},
				duration: function duration( )
				{
				
					// set variables
					
					var i = -1 ;
					var o ;
					var s ;
					
					// set i
					
						o = this.properties.player.object ;
						s = this.properties.player.methods.duration ;
						
						i = o[s].call(o) ;
						
					// return i
					
					return i ;

				},
				isPaused: function isPaused( )
				{
					return (this.properties.state === pulse.media.Player.PLAYER_STATE_PAUSED) ;
				},
				isPlaying: function isPlaying( )
				{
					return (this.properties.state === pulse.media.Player.PLAYER_STATE_PLAYING) ;
				},
				getPlayerState: function getPlayerState( )
				{
					return this.properties.state ;
				},
				setPlayerState: function setPlayerState(state)
				{
				
					// set this
					
						this.properties.state = state ;
						this.onPlayerStateChange(  { state: state }  ) ;
					
					// return this
					
					return this ;

				},
				/**
				* Bind the handler specification to the playerReady Event.
				*/				
				playerReady: function playerReady(object)
				{
					
					// set this

					return this.addHandler("playerReady",object) ;

				},
				/**
				* Call the handlers bound to the playerReady Event.
				*/				
				onPlayerReady: function onPlayerReady(error)
				{

					// set this

					return this.callHandler("playerReady",error) ;

				},
				/**
				* Bind the handler specification to the playerError Event.
				*/				
				playerError: function playerError(object)
				{
					
					// set this

					return this.addHandler("playerError",object) ;

				},
				/**
				* Call the handlers bound to the playerError Event.
				*/				
				onPlayerError: function onPlayerError(error)
				{

					// set this

					return this.callHandler("playerError",error) ;

				},
				/**
				* Bind a handler specification to the stateChange Event.
				*/				
				stateChange: function stateChange(object)
				{
					
					// set this

					return this.addHandler("stateChange",object) ;

					// return this
					
					return this ;

				},
								
				/**
				* Call the handlers bound to the stateChange Event.
				*/				
				onStateChange: function onStateChange(event)
				{

					// set ?
					
					return this.callHandler("stateChange",event) ;

				},
				playerStateChange: function playerStateChange(handler)
				{
				
					// set this
					
					return this.addHandler("playerStateChange",handler) ;

				},
				onPlayerStateChange: function onPlayerStateChange(event)
				{

					// set ?
					
					return this.callHandler("playerStateChange",event) ;

				},
				destroy: function destroy( )
				{
				
						if(!! this.properties.schedule) { this.properties.schedule.close( ) ; }
					
					return this ;
				
				}
		},
		local: {
				components: null,
				setPlayerContainer: function setPlayerContainer(parameter)
				{

					Pulse.error("Method is abstract") ;
				
				},
				setSchedule: function( )
				{
				
					// set variables
					
					var s ;
					
					// set this
					
						this.properties.schedule = pulse.logic.Schedule( 500, { repeatable: true, auto_repeat: true } )
						.add(  {
								target: this,
								action: function( ) {

										d = this.time( ) / this.duration( ) ;

										this.components.progress.shiftHandle(  { x: d, y: d }  ) ;
										
								}
						}  ) ;
						
						this.playerStateChange(  {
								target: this,
								action: function(event) {
						
										i = event.state ;
										
										if(i === pulse.media.Player.PLAYER_STATE_PLAYING) {
												
												if( this.properties.schedule.isPaused( ) ) { this.properties.schedule.resume( ) ; }
												else { this.properties.schedule.run( ) ; }

										}
										else if(i === pulse.media.Player.PLAYER_STATE_PAUSED || i === pulse.media.Player.PLAYER_STATE_STOPPED) {
												this.properties.schedule.pause( ) ;
										}

								}
						}  ) ;
					
					// return this
					
					return this ;
				
				},
				setVolumeControl: function setVolumeControl(parameter)
				{
				
					// set variables
					
					var s ;
					
					// set ?
					
						if( !! (s = parameter.root) ) {
								
								pulse.dom.Document.select(this.root)
								.find(s) ;
								
								this.components.volume = pulse.ui.Gauge(
										pulse.dom.Document.getCurrent( ),
										parameter
								) 
								.adjust(  {
										target: this,
										action: function(event) { this.volume(event.level) ; },
								}  )
								.setState(pulse.ui.Module.STATUS_IDLE) ;
								
						}
					
					// return this
					
					return this ;
				
				},
				setProgressControl: function setProgressControl(parameter)
				{

					// set variables
					
					var s ;
					
					// set ?
					
						if( !! (s = parameter.root) ) {

								pulse.dom.Document.select(this.root)
								.find(s) ;

								this.components.progress = pulse.ui.Slider(
										pulse.dom.Document.getCurrent( ),
										parameter
								)
								.slide(  {
										start: {
												target: this,
												action: function(event) { this.pause( ) ; }
										},
										stop: {
												target: this,
												action: function(event) {

													var i ;
													
														i = this.duration( ) * event.levels.x ;

														this.jump(i)
														.play( ) ;

													return true ;

												}
										}
								}  ) ;

						}
						
					// return this
					
					return this ;

				},
				setMenuControl: function setMenuControl(parameter)
				{
					
					// set variables
					
					var n1, n2 ;
					var i1, i2 ;
					
					// set ?
					
						n1 = pulse.dom.Document.select(this.root)
						.find(parameter.root)
						.getCurrent( ) ;
						
						n2 = pulse.dom.Document.find("//*[text()]")
						.getCurrent( ) ;

						this.components.menu = pulse.ui.Button(n1)
						.toggle(  {
								on: {
									target: this,
									action: function(node) {
									
										var i1, i2 ;

											pulse.dom.Document.select(node)
											.text(this.parameter.menu_control_text.on) ;
											
											d1 = this.components.box.getHeight( ) ;
											d2 = this.components.box.getWidth( ) ;
											
											this.components.box.morph(  { height: (0.90 * d1), width: (0.90 * d2), duration: 240 }  )
											.stop(  {
													target: this,
													action: function(node) {
														
														var o ;
														var d ;
														
															d = this.components.box.getHeight( ) ;

															o = pulse.ui.CSS.PROPERTY_ADAPTERS.BOX_SHADOW(
																	null,
																	{
																			"box-shadow-blur": (d * .02),
																			"box-shadow-right": (d * .01),
																			"box-shadow-bottom": (d * .01),
																			"box-shadow-color": "rgb(25,25,25)"
																	}
															) ;

															pulse.dom.Document.setStyle(o) ;

													}
											}  ) ;

									},
									parameter: n2
								},
								off: {
									target: this,
									action: function(node) {
									
										var n ;
										var o ;
										var d1, d2 ;

											pulse.dom.Document.select(node)
											.text(this.parameter.menu_control_text.off) ;
											
											n = this.components.box.getRoot( ) ;
											
											o = pulse.ui.CSS.PROPERTY_ADAPTERS.BOX_SHADOW(
													null,
													{
															"box-shadow-blur": 0,
															"box-shadow-right": 0,
															"box-shadow-bottom": 0
													}
											) ;
											
											pulse.dom.Document.select( this.components.box.getRoot( ) )
											.parent( ) ;
											
											d1 = pulse.dom.Document.getHeight( ) ;
											d2 = pulse.dom.Document.getWidth( ) ;
											
											pulse.dom.Document.select(n)
											.setStyle(o) ;

											this.components.box.morph(  { height: d1, width: d2, duration: 240 }  ) ;

									},
									parameter: n2
								}
						}  ) ;
					
					// return this
					
					return this ;

				}
		}

}  ) ;