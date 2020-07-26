
const User = require('../models/userModel');


exports.getAllUsers = async (req, res) =>{
    
    try{
        
        const users = await User.find();
        
        res.status(200).json({
            status:'sucess',
            results: users.length,
            data: {
                users: users
            }
        }); 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving plates from MongoDB..', err
        });
    }
}


exports.getUser = async (req, res) =>{
    
    try{
        
        const user = await User.findById(req.params.id);
        
        res.status(200).json({
            status:'sucess',
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

exports.createUser = async (req, res) => {
    
    console.log(req.body);
    
    try {
    
        const newUser = await User.create(req.body);


        res.status(201).json({
            status:'sucess',
            data:{
                message: 'Created a new user sucessfully!',
                data: newUser,
            }
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 saving to MongoDB..', err
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
    //         status:'sucess',
    //         data: {
    //             message: 'created a User sucessfully...',
    //             data: newUser,
    //         }
    //     });
    // }).catch(err=>{
    //     console.log('ERROR 💥 saving to MongoDB... ', err);
    // })
   
      

