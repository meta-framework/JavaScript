/*
@identifier org.meta.logic.Job
@extend org.meta.logic.event.Runnable
@description An object wrapper for the queue internals. 
@deprecated
*/
{
		main: function main(id) { this.tasks = {next: VOID} },
		global:
		{
				TASK_ASYNC: 1,
				TASK_IMPORTANT: 1 << 1,
				create: function create( )
				{
console.log('Job::create') ;
					// return
					
					return new this(null) ;

				}
		},
		local:
		{
				/**
				* The id of the job on the internal queue.
				* @type String
				*/
				id: null,
				/**@todo make this a Ring structure (object pointing to the first element in a double linked list)*/
				tasks: null,
				/**@deprecated*/
				_destroy: function destroy( )
				{
					
					// variables
					
					var id ;
					
					//
					
						/*Save a reference to the job object's id.*/
						id = this.id ;
					
						/*Destroy this `Job` instance.*/
						org.meta.logic.Job.super.invoke('destroy', this) ;

				},
				/**
				* @contract Add a batch of tasks to the queue and ...
				*/
				start: function start( )
				{
					
					// variables
					
					var job = this,
						a ;
					
					//

						/*Assert state invariants.*/
						this.super.invoke('start', this) ;
					
						/*Create a task list.*/
					
						if((task = this.tasks))
						{
						
								/*Add handlers.*/
								a = [{
...
										paused:
								}] ;

								do { a[a.length] = task ; } while((task = task.next) && task !== this.tasks) ;
						
								/**/
								enqueue.apply(null, a) ;
							
								delete this.tasks ;
							
						}

				},
				/**
				* Add a task to this job.
				*
				* @param (Function) callback A function containing the logic of the task.
				* @param (Boolean) [optional] async Boolean flag indicating an asynchronous task.
				*/
				then: function then(callback, async)
				{
					
					// preconditions
					
						assert(this.getState( ) === Job.STATE_STOPPED || this.getState( ) === Job.STATE_PAUSED, 'Illegal State: Object must be stopped or paused.') ;
					
					// variables
					
					var task ;
					
					//
					
						task = {callback: callback, async: async || false, next: task, previous: task} ;
					
						if(! this.tasks) this.tasks = task ;
						else ringAdd(this.tasks, task) ;
/*
						if(! this.tasks) this.tasks = task ;
						else
						{
						
								/*Add the task at the end of the list.*
								task.previous = this.tasks.previous ;
								task.next = this.tasks ;
								this.tasks.previous.next = task ;
								this.tasks.previous = task ;
							
						}
*/
					// return
					
						return this ;

				}
		}
}