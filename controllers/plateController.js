const Plate = require('../models/plateModel');
const multer = require('multer');
const User = require('../models/userModel');
const { updateUser } = require('./userController');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, 'public/img/plates');
    },
    filename: (req, file, cb) => {
        //user-[user.id]-[timestamp].jpeg
        const ext = file.mimetype.split('/')[1];
        file.filename = `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`;
        // console.log(`Filename: ${file.filename}`);
        cb(null, `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`)
        // cb(null, `user-testUser-${Date.now()}.${ext}`)
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Must upload an image.'),false)
    }
}

// const upload = multer({ dest: 'public/img'})

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPlatePhoto = upload.single('photo');



exports.getAllPlates = async (req, res) => {
    
    try {
        
        const plates = await Plate.find();
        //Plate.findOne( {_id: req.params.id } )

        res.status(200).json({
            status:'success',
            results: plates.length,
            data: {
                plates: plates
            }
        }); 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving plates from MongoDB..', err
        });
    }
}



exports.getPlate = async (req, res) => {
    
    try {
        
        const plate = await Plate.findById(req.params.id);
        
        res.status(200).json({
            status:'success',
            data: {
                plate: plate
            }
        }); 
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 retrieving plate from MongoDB..', err
        });
    }
}



exports.createPlate = async (req, res) => {

    
    console.log('creating plate...');
    
    const { name, description, recipe } = req.body;

    console.log(`name: ${name} description: ${description} recipe: ${recipe}`);
    var photo = 'default-plate.jpg'

    try {

        if(req.file.filename){
            console.log(`Filename in create plate: ${req.file.filename}`)
            photo = req.file.filename
        } 
    } catch(err) {
        console.log('Req.file doesn\'t exist')
        // console.log(err);
    }
    
    
    const userID = req.user._id;
    console.log(`userID: ${userID}`)

    
    try {
    
        const newPlate = await Plate.create({
            name,
            description,
            recipe,
            photo,
            user:req.user._id
        });
        
        console.log(`newPlate._id: ${newPlate._id}`)
        console.log(`newPlate: ${newPlate}`)
        
        //add plate to User's plates array
        // console.log(`adding to user: ${userID}`);

        const updatedUser = await User.findByIdAndUpdate(
            userID, 
            { $push: { plates: newPlate._id } },
            {new:true}
         );

        //  console.log(updatedUser);
        
        res.status(201).json({
            status:'success',
            data:{
                message: 'Created a new plate successfully!',
                data: newPlate,
            }
        });

    } catch (err){
        res.status(400).json({
            status: 'fail',
            message: 'Error 💥 saving plate to MongoDB..', err
        });
    }

}



exports.updatePlate = async (req, res) => {
    
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.file);


    console.log('from controller...updating plate...');
    
    const { name, description, recipe, photo } = req.body;

    console.log(`name: ${name} description: ${description} recipe: ${recipe}`);
    // const photo = 'default-plate.jpg'
        
    try {
        
        //if there is no new photo on request object, user has not updated photo. Use previously existing photo path.
        if(photo === "undefined") {
            const plate = await Plate.findById(req.params.id);
            const oldphoto = plate.photo;
            req.body.photo = oldphoto;
        } else {
            // otherwise use the new photo to update db and delete old photo from filesystem
                console.log(`Filename in update plate: ${req.file.filename}`)
                req.body.photo = req.file.filename
    
                //remove old photo from file system before setting updated photo
                const plate = await Plate.findById(req.params.id);
                const oldphoto = plate.photo;
                if(oldphoto!=='default-plate.jpg'){
                    const path = `./public/img/plates/${oldphoto}`;
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
    
    //update MongoDB with all new request properties    
    try {
    
        const updatedPlate = await Plate.findByIdAndUpdate(req.params.id,req.body, {new:true, runValidators:true});

        res.status(201).json({
            status:'success',
            data:{
                message: 'Updated plate successfully!',
                data: updatedPlate,
            }
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 saving to MongoDB..', err
        });
    }

}


exports.deletePlate = async (req, res) => {
    console.log('in plate controller');
    console.log(req.params.id);
    // console.log(req.body);
    
    try {
        const token = req.headers.cookie.split('=')[1];
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        //remove from user's week before deleting plate
        await User.findByIdAndUpdate(
            decoded.id, 
            { $pullAll: { week: [req.params.id] } },
            {new:true}
         );

        //remove from user's plates array before deleting plate
         await User.findByIdAndUpdate(
            decoded.id, 
            { $pullAll: { plates: [req.params.id] } },
            {new:true}
         );
        
         //remove old photo from file system
         const plate = await Plate.findById(req.params.id);
         const oldphoto = plate.photo;
         if(oldphoto!=='default-plate.jpg'){
             const path = `./public/img/plates/${oldphoto}`;
             fs.unlink(path, (err) => {
                 if(err) {
                     console.log(err);
                     return
                 }
             });
         }

         //delete plate from MongoDB
        await Plate.findByIdAndDelete(req.params.id);


        res.status(204).json({
            status:'success',
            data:null
        });

    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: 'Error 💥 deleting plate in MongoDB..', err
        });
    }
}


exports.addToWeek = async (req, res) => {

    try {

        // console.log(`In addToWeek controller: ${req.params.id}`);
        // console.log(req.headers.cookie);
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // console.log(`UserID: ${decoded.id}`)

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id, 
            { $push: { week: req.params.id } },
            {new:true}
         );
    
        //  console.log(`Updated User: ${updatedUser}`);

         res.status(200).json({
             status:'success',
             data: {
                 user: updatedUser
             }
         })
    } catch(err) {
        res.status(404).json({
            status:'fail',
            message: 'Error 💥 saving plate to week..', err
        });
    }
}

exports.removeFromWeek = async (req, res) => {

    try {

        // console.log(`In removeFromWeek controller: ${req.params.id}`);
        // console.log(req.headers.cookie);
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // console.log(`UserID: ${decoded.id}`)

        await User.findByIdAndUpdate(
            decoded.id, 
            { $pullAll: { week: [req.params.id] } },
            {new:true}
         );
    
         res.status(200).json({
             status:'success',
             data: null,
         });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message: 'Error 💥 removing plate from week..', err
        });
    }
}