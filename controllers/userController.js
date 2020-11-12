
const User = require('../models/userModel');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');


// const multerStorage = multer.diskStorage({
//     destination: (req,file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         file.filename = `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`;
//         cb(null, `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`)
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Must upload an image.'),false)
    }
}


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});


exports.uploadUserPhoto = upload.single('photo');


exports.resizeUserPhoto = async (req, res, next) => {
    try{

        if (!req.file) return next();
      
        req.file.filename = `user-${req.user._id}-${req.body.name}-${Date.now()}.jpeg`;
      
        await sharp(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/users/${req.file.filename}`);
      
        next();
    }catch(err){
        console.log(err);
        new Error('Error resizing photo');
    }
  };



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


exports.updateUser = async (req,res) => {
    console.log(`...updating user: ${req.params.id}`);

    console.log(req.params.id);
    console.log(req.body);
    console.log(req.file);

    console.log('from controller...updating user...');
    const { name, email, photo } = req.body;
    console.log(`name: ${name} email: ${email}`);

    try {
        
        //if there is no new photo on request object, user has not updated photo. Use previously existing photo path.
        if(photo === "undefined") {
            const user = await User.findById(req.params.id);
            const oldphoto = user.photo;
            req.body.photo = oldphoto;
        } else {
            // otherwise use the new photo to update db and delete old photo from filesystem
                console.log(`Filename in update plate: ${req.file.filename}`)
                req.body.photo = req.file.filename
    
                //remove old photo from file system before setting updated photo
                const user = await User.findById(req.params.id);
                const oldphoto = user.photo;
                if(oldphoto!=='default-user.jpg'){
                    const path = `./public/img/users/${oldphoto}`;
                    fs.unlink(path, (err) => {
                        if(err) {
                            console.log(err);
                            return
                        }
                    });
                }
            } 
        } catch(err) {
            console.log('Req.file doesn\'t exist')
        } 
        
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
   
      

exports.getMe = async (req, res) => {
    try {
        console.log('in get me...');

        res.status(204).json({
            status:'success',
            data:null
        });

    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 getting user page..', err
        });
    }
}
