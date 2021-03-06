const User = require('../models/userModel');
const Plate = require('../models/plateModel');
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk')
const fs = require('fs');
const { findByIdAndDelete } = require('../models/userModel');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});


//option below to save directly to disk
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
      
        req.file.filename = `user-${req.user._id}-${req.body.username}-${Date.now()}.jpeg`;
      
        if(process.env.NODE_ENV === 'development'){
            await sharp(req.file.buffer)
            .rotate()
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/users/${req.file.filename}`);
        } else if(process.env.NODE_ENV === 'production'){
            await sharp(req.file.buffer)
            .rotate()
            .resize(500, 500)
            .toFormat('jpeg')
            .toBuffer()
            .then(buffer=>{
              req.file.buffer = buffer});
        }
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
    // console.log(`...updating user: ${req.params.id}`);

    // console.log(req.params.id);
    // console.log(req.body);
    // console.log(req.file);
    // console.log(req.body);

    const { name, username, email, photo } = req.body;
    // console.log(`name: ${name} username: ${username} email: ${email}`);

    try {
        
        // 1) if there is no new photo on request object, user has not updated photo. Use previously existing photo path.
        if(photo === "undefined") {
            const user = await User.findById(req.params.id);
            const oldphoto = user.photo;
            req.body.photo = oldphoto;
        } else {
            // 2) otherwise use the new photo to update db and delete old photo from filesystem
            
                req.body.photo = req.file.filename
    
            //2a) remove old photo from file system before uploading new photo
                const user = await User.findById(req.params.id);
                const oldphoto = user.photo;
                
                if(process.env.NODE_ENV === 'development'){
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

                if(process.env.NODE_ENV === 'production'){
                    if(oldphoto!=='default-user.jpg'){
                        const params = {
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: `users/${oldphoto}`,
                        }
                    
                        s3.deleteObject(params, (error, data) => {
                            if(error){
                                console.log(`AWS error: ${error}`);
                                res.status(500).send(error)
                            }
                            
                            console.log(`AWS deleted user file successfully`);
                        });
                    }

                }


                // 2b) upload new photo to AWS S3
                if(process.env.NODE_ENV === 'production') {
                    if(req.file.buffer) {
                    
                        const params = {
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: `users/${req.file.filename}`,
                            Body: req.file.buffer
                        }
            
                        const s3upload = await s3.upload(params).promise();
                        console.log(s3upload);
                        console.log(s3upload.Key.split('/')[1]);
                    }
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
    
    try {
        
        //retrieve User to delete User's plates from DB and file system before deleting user
        const user = await User.findById(req.params.id);
        const plates = user.plates;
        const userPhoto = user.photo;
        const plateIDs = plates.map(plate => plate._id);
        const platePhotos = plates.map(plate => plate.photo);

        // 1a) delete User photo and plate photos from filesystem (development)
        if(process.env.NODE_ENV === 'development') {

            if(userPhoto!=='default-user.jpg'){
                const path = `./public/img/users/${userPhoto}`;
                fs.unlink(path, (err) => {
                    if(err) {
                        console.log(err);
                        return
                    }
                });
            }
    
    
            // 1b) delete plate photos from filesystem
            for(let i=0; i<platePhotos.length; i++) {
                const path = `./public/img/plates/${platePhotos[i]}`;
                fs.unlink(path, (err) => {
                    if(err) {
                        console.log(err);
                        return
                    }
                });
            }
        
        }

        // 2a) delete User photo and plate photos from AWS (production)
        if(process.env.NODE_ENV === 'production') {

            if(userPhoto!=='default-user.jpg'){

                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `users/${userPhoto}`,
                }
            
                s3.deleteObject(params, (error, data) => {
                    if(error){
                        console.log(`AWS error: ${error}`);
                        res.status(500).send(error)
                    }
                    
                    console.log(`AWS deleted file successfully`);
                });

            }
    
    
            // 2b) delete plate photos from AWS
            for(let i=0; i<platePhotos.length; i++) {
                const path = `./public/img/plates/${platePhotos[i]}`;

                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `plates/${platePhotos[i]}`,
                }
            
                s3.deleteObject(params, (error, data) => {
                    if(error){
                        console.log(`AWS error: ${error}`);
                        res.status(500).send(error)
                    }
                    
                    console.log(`AWS deleted file successfully`);
                });
            }

        }

        // 3) delete user's Plates from DB
        for(let i=0; i<plateIDs.length; i++) {
            await Plate.findByIdAndDelete(plateIDs[i]);
        };

    
        // 4) delete user from DB 
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
