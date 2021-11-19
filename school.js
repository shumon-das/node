const EventEmmiter = require('events');

class School extends EventEmmiter{
    exampleOne(){
        console.log("this is example one for node event");

        // event lisetener
        this.emit('firstEvent', {
            parameter1:'Hello ', 
            parameter2: 'I am node Js'
        });
    }
}

module.exports = School;