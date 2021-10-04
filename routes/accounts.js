const { User, validateUser, Child, Activity } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


// Get ALL Users
router.get("/", async(req, res)=>{
    try{
        const user = await User.find();

        return res
        .send(user);
    } catch(ex){
        return res.status(500).send(`Internal Server Error:${ex}`);
    }
});

//Get User by ID(ParentID)
router.get('/:userId', async(req,res)=>{
    try{
        const users = await User.findById(req.params.userId);
        if (!users) return res.status(400).send(`The User with ID of "${req.params.user}" does not exist.`);
        
        return res
        .send(users);
    } catch(ex){
        return res.status(500).send(`Internal Server Error:${ex}`);
    }
})


//Creating a New User(Teacher Register)
router.post("/", async (req, res) => {
    try {

    let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).send(error);
    
    const salt = await bcrypt.genSalt(10)
        user = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: await bcrypt.hash(req.body.password, salt),
        });
 
        await user.save();
        const token = user.generateAuthToken();
        
        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send(user);
    
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// Deleting User(Parent)
router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        if(!user)
            return res.status(400).send(`The User with ID of "${req.params.userId}" does not exist.`);
        return res.send(user);       
    } catch(ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Child Routes

//Get Entire Classroom
router.get("/:userId/children", async (req, res)=>{

    try {
        const child = await Child.find();
        return res.send(child);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Get Child by ID
router.get("/:userId/children/:childrenId", async (req, res)=>{

    try {
        const child = await Child.find();
        return res.send(child);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})
router.post("/:userId/children", async(req, res)=>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user)
            return res
                .status(400)
                .send(`The User with Id of "${req.params.userId}" does not exist.`);
                let child = new Child({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    allergies: req.body.allergies,
                   glasses: req.body.glasses,
                   stock: req.body.stock
                });
        user.children.push(child);
        await user.save();
        return res.send(user.children);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

//Deleting a Child from Parent
router.delete("/:userId/children/:childrenId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user)
        return res
          .status(400)
          .send(`The user with id "${req.params.userId}" does not exist.`);
      let children = user.children.id(req.params.childrenId);
      if (!children)
        return res
          .status(400)
          .send(
            `The Child with id of "${req.params.childrenId}" does not exist.`
          );
      children = await children.remove();
      await user.save();
      return res.send(children);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  }); 

// Routes for Activities

//Get Activity
router.get("/:userId/activities/:activitiesId", async (req, res)=>{

    try {
        const activity = await Activity.find();
        return res.send(activity);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
})

//Creating Activities for Parents
// router.post("/activities", async (req, res) => {
//     try {
//         activity = new Activity({
//             Location: req.body.Location,
//             ActivityName: req.body.ActivityName,
//             ActivityDate: req.body.ActivityDate
//         });

//         return res.send(activity)
//     } catch (ex) {
//         return res.status(500).send(`Internal Server Error: ${ex}`);
//     }
// });


module.exports = router;