const Plate = require('../models/plateModel');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const { updateUser } = require('./userController');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require('fs');
// const sendEmail = require('../utils/email');
const Email = require('../utils/email');
const AppError = require('../utils/appError');



// const multerStorage = multer.diskStorage({
//     destination: (req,file, cb) => {
//         cb(null, 'public/img/plates');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         file.filename = `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`;
//         cb(null, `user-${req.user._id}-${req.body.name}-${Date.now()}.${ext}`)
//     }
// });

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Must upload an image.'),false)
    }
}

// const upload = multer({ dest: 'public/img'})
const multerStorage = multer.memoryStorage();


const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPlatePhoto = upload.single('photo');

exports.resizePlatePhoto = async (req, res, next) => {
    try{

        if (!req.file) return next();
        
      
        req.file.filename = `user-${req.user._id}-${req.body.name}-${Date.now()}.jpeg`;
      
        await sharp(req.file.buffer)
        //   .resize(2000, 1333)  //3:2 ratio common for images
        //   .resize(1500, 2000)  //2:3 ratio common for images
        //   .resize(750, 1000)  //2:3 ratio common for images
        //   .resize(320, 200)  //2:3 ratio common for images
          .resize(640,400)  //1.6:1 ratio
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/plates/${req.file.filename}`);
      
        next();
    }catch(err){
        console.log(err);
        new Error('Error resizing photo');
    }
  };



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

        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(user.week.length<7){

            const updatedUser = await User.findByIdAndUpdate(
                decoded.id, 
                { $push: { week: req.params.id } },
                {new:true}
             );
             res.status(200).json({
                 status:'success',
                 data: {
                     user: updatedUser
                 }
             })
        }else {
            throw new AppError('Error 💥 must have less than 7 plates per week',400);
        }

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message: 'Error 💥 must have less than 7 plates per week', err
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

exports.updateWeek = async (req, res) => {

    try {

        const {draggedID, droppedID} = req.body;

        // console.log(`In updateWeek controller`);
        // console.log(draggedID);
        // console.log(droppedID);
        
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
        const week = user.week;
        for(let i=0;i<week.length;i++){
            console.log(week[i].name);
        }

        temp2 = week[draggedID];
        console.log(temp2);
        //remove dragged element from array
        week.splice(draggedID,1);
        //add dragged element before dropped element
        week.splice(droppedID,0,temp2);


        // console.log('updated week:')
        // for(let i=0;i<week.length;i++){
        //     console.log(week[i].name);
        // }

        
        //empty User's current week array in DB
        await User.findByIdAndUpdate(
            decoded.id, 
            { $set: { week: [] } },
            {new:true}
        );

        //create a newly mapped array with only the plate IDs
        const week_id = week.map(el=>{
            return el._id});
        
        
        //update User's week array in DB with newly ordered plate IDs from mapped array
        await User.findByIdAndUpdate(
            decoded.id, 
            { $push: { week: {$each: week_id }}},
            {new:true}
        );
    
         res.status(200).json({
             status:'success',
             data: null,
         });

    } catch(err) {
        res.status(404).json({
            status:'fail',
            message: 'Error 💥 updating week..', err
        });
    }
}


exports.emailWeek = async (req, res) => {

    try {
        const token = req.headers.cookie.split('=')[1]
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id);
        console.log(user)
        
        //use code below for non-class based email option
        // await sendEmail({
        //     email: user.email,
        //     name: user.name.split(' ')[0],
        //     subject: 'Prato - Your week!',
        //     week: user.week,
        //     type: 'week'
        // });

        const url = `${req.protocol}://${req.get('host')}`

        await new Email(user, url).sendWeek();


        res.status(200).json({
            status:'success',
            data: null,
        });

    }catch (err) {
        res.status(404).json({
            status:'fail',
            message: 'Error 💥 sending email..', err
        });
    }
}