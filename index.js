const _ = require('lodash');
const School = require('./school');

const school = new School();
// event
school.on('firstEvent', ({parameter1, parameter2}) => {
    console.log(parameter1 + parameter2);
});

school.exampleOne();





