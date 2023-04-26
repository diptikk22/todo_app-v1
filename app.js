// core modules
const express = require("express");
const fs = require("fs");


const app = express();
// creating the middleware [ if we will rmeove this middleware and the we will get undefined in the console]
app.use(express.json());            // express.json is the middleware


//reading the data form the file
const tasks = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tasks-simple.json`)
    );

// GETTING data
app.get('/api/v1/tasks', (req, res) =>{
    res.status(200).json({
        // we will use Jsend formatting
        status: 'success',
        result: tasks.length,
        data: {
            tasks
        },
    });
});

// GETTING specific Tasks by id 
// responding to the URL parameters -- to get the task by the number -- for getting specific task-- we can also set the optional variable as well -with this- '/api/v1/tasks/:id/:name?'
app.get('/api/v1/tasks/:id', (req, res) =>{
    const id = req.params.id * 1;                       // to convert the id to integer 
    const task = tasks.find(el => el.id === id)          // to get exactly what we are looking for   

    // if id is not found in the tasks it will throw an error --- validation
    //(id > tasks.length)
    if(!task) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        // we will use Jsend formatting
        status: 'success',
        data: {
            task
        },
    });
});


// CREATING the new tasks in the file 
app.post('/api/v1/tasks', (req, res) => {
    // to automatically increment the ids for new tasks  
    const newId = tasks[tasks.length-1].id + 1;
    const newTask = Object.assign({id: newId,...req.body, task_status:'ongoing'});

    tasks.push(newTask);
    
    // now we will use the asyc as we are in the call back and we dont wanna block it 
    fs.writeFile(`${__dirname}/dev-data/data/tasks-simple.json`, JSON.stringify(tasks, null, 2), err => {
        res.status(201).json({
            status: 'success',
            data: {
                task: newTask
            }
        });                 // 201 stands for created 
    });                     // we can send only one response 
});


// UPDATING the data 
app.patch('/api/v1/tasks/:id', (req, res) => {
    // to check the validity of the id 
    if(req.params.id * 1 > tasks.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    // Finding the object
    let task_status = req.body.task_status;
    let id = req.params.id;
    let obj = tasks.find(el => el.id == id);
    obj.task_status = task_status;                  

    // changing async wont work????
    fs.writeFileSync(`${__dirname}/dev-data/data/tasks-simple.json`, JSON.stringify(tasks, null, 2));
    res.status(200).json({
        status: 'success',
        data: {
            task: '<Updated data -- status of the object>'
        }
    })
});


// Deleting the tasks from the file 
app.delete('/api/v1/tasks/:id', (req, res) => {
    // to check the validity of the id 
    let id = req.params.id * 1;
    let a = Boolean(tasks.find(item => item.id == id));
    if (!a) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid Id'
        });
    }
    // logic to delete -- array funtion filter
    id = req.params.id;
    let newTasks = tasks.filter(el => el.id != id)
    
    // chnaging async wont work????
    fs.writeFileSync(`${__dirname}/dev-data/data/tasks-simple.json`, JSON.stringify(newTasks, null, 2));

    // 204 means no content 
    res.status(204).json({
        status: 'success',
        data: null,
        message: `<The task with ${id} has been deleted>`
    })
});


// to start the server 
const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});
