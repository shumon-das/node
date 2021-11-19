const _ = require('lodash');
const EventEmmiter = require('events');

const emmiter = new EventEmmiter();

// event
emmiter.on('firstEvent', ({parameter1, parameter2}) => {
    console.log(parameter1 + parameter2);
    console.log('lodash test result is : ' + _.last([1,2,3]));
});


// event lisetener
emmiter.emit('firstEvent', {parameter1:'Hello ', parameter2: 'I am node Js'});




