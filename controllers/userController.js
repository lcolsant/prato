
const User = require('../models/userModel');



exports.getAllUsers = async (req, res) => {
    
    try {
        
        const users = await User.find();
        
        res.status(200).json({
            status:'success',
            results: users.length,
            data: {
                users: users
            }
        }); 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving users from MongoDB..', err
        });
    }
}


exports.getUser = async (req, res) => {
    
    try {
        
        const user = await User.findById(req.params.id);
        
        res.status(200).json({
            status:'success',
            data: {
                user: user
            }
        }); 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving user from MongoDB..', err
        });
    }
}

exports.createUser = (req, res) => {
    
    res.status(500).json({
        status:'error',
        message: 'Please use /signup instead.'
    });

}


exports.updateUser = async (req, res) => {
    
    console.log(req.params.id);
    console.log(req.body);
    
    try {
    
        const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body, {new:true, runValidators:true});


        res.status(201).json({
            status:'success',
            data:{
                message: 'Updated user successfully!',
                data: updatedUser,
            }
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 saving to MongoDB..', err
        });
    }

}



exports.deleteUser = async (req, res) => {
    
    console.log(req.params.id);
    console.log(req.body);
    
    try {
    
        await User.findByIdAndDelete(req.params.id);


        res.status(204).json({
            status:'success',
            data:null
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 deleting user in MongoDB..', err
        });
    }

}



    //Alt approach to saving document
    // const newUser = new User ({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password,
    //     passwordConfirm: req.body.passwordConfirm 
        
    // });

        
    // newUser.save().then(doc=>{
    //     console.log('created a new User successfully...');
    //     console.log(doc);
        
    //     res.status(200).json({
    //         status:'success',
    //         data: {
    //             message: 'created a User successfully...',
    //             data: newUser,
    //         }
    //     });
    // }).catch(err=>{
    //     console.log('ERROR 💥 saving to MongoDB... ', err);
    // })
   
      

