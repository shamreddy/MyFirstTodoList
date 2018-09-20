import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Todos = new Meteor.Collection('todos');

if(Meteor.isClient){

 Meteor.subscribe('todos');

    Todos._collection.insert({
            'todo' : 'Task set 1 Completed by 09/2018',
            'description': 'Cleanding'
        });

	Todos._collection.insert({
            'todo' : 'Task set 2 Completed by 10/2018',
            'description': 'Sorting'
        });

	Template.main.helpers({

        todos:function(){
        	return Todos.find({},{sort:{todo:-1}});
        }
	});

	Template.main.events({

		"submit.new-todo": function(event){
			var text = event.target.text.value;
			
			Meteor.call('addTodo', text);


           event.target.text.value = '';

			return false;
		},

		"click.toggle-check" : function(){
			Meteor.call('setChecked', this._id, !this.checked);
		},

		"click.delete-todo": function(){
			
			Meteor.call('deleteTodo', this._id);
		
           }
	});

	Template.main.onRendered(function(){

		 $('.form-control').validate({
        rules: {
            text: {
                
                minlength: 6
            }
        }
    });

	});

	Accounts.ui.config({

      passwordSignupFields: "USERNAME_ONLY"

	});


}


if(Meteor.isServer){

	Meteor.publish('todos', function(){
		if(!this.userID()){
			return Todos.find();
         }else{
         	return todos.find({userID: this.userID});
         }
		
	})

}

Meteor.methods({
	addTodo: function(text){
		
		Todos._collection.insert({
                 'todo' : text,
                 'description': 'Maintaning',
                 
                 
			});
	},

	deleteTodo: function(todoId){

        var todo = Todos._collection.findOne(todoId);
		if(todo.userID!==Meteor.userID){
			throw new Meteor.Error('Not-Autherized');
		}
           Todos._collection.remove(todoId);
	},

	setChecked: function(todoId, setChecked){

		var todo = Todos._collection.findOne(todoId);
		if(todo.userID!==Meteor.userID){
			throw new Meteor.Error('Not-Autherized');
		}
		Todos._collection.update(todoId, {$set:{checked: setChecked}});
	}
})

