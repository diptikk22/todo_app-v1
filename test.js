const express = require("express");
const fs = require("fs");
const app = express();


app.use(express.json());            

const port = 8000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
});

// local 
let tasks = [
    {
        id: 1,
        title: "NodeJs",
        description: "Complete the course for this..",
    }
]


// Read-- API 
app.get("/tasks", (req, res) => {
    res.send({
        success: true,
        message: "data fetched successfully",
        data: tasks
    })
})


// Create-- API
app.post("/tasks", (req, res) => {
    let description = req.body.description
    if (description){
        tasks.push({
            id:(tasks.length +1).toString(),
            description: description
        })
        res.send({
            success:true,
            message:"data added successfully"
        })
    } else{
        res.send({
            success:false,
            message: "important fields empty......",
            errors:[
                {
                    feild:"description",
                    message:"This field cannot be null"
                }
            ]
        })
    }
})



// Delete-- API 
app.delete("/tasks/:id", (req, res) =>{
    let id = req.params.id;
    let newTasks = tasks.filter(el => el.id != id)
    tasks = newTasks
    res.send({
        success:true,
        message:"sucessfully deleted"
    })
})



// Update-- API
// --- findByIndexAndUpdate ---- findIndex
