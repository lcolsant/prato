const Plate = require('../models/plateModel');
const multer = require('multer');
const User = require('../models/userModel');
const { updateUser } = require('./userController');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

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
    
    const { name, description } = req.body;
    console.log(`name:, description`)

    console.log(`name: ${name} description: ${description}`);
    const photo = 'default-plate.jpg'

    try {

        if(req.file.filename){
            console.log(`Filename in create plate: ${req.file.filename}`)
            photo = req.file.filename
        } 
    } catch(err) {
        console.log('Req.file doesn\'t exist')
        // console.log(err);
    }
    
    // console.log(req.file);
    // console.log(req.body);
    // console.log(req.user)
    // console.log(res.locals.user)

    // const { name, description } = req.body;
    
    const userID = req.user._id;
    console.log(`userID: ${userID}`)

    
    try {
    
        const newPlate = await Plate.create({
            name,
            description,
            photo,
            user:req.user._id
        });
        
        console.log(`newPlate._id: ${newPlate._id}`)
        console.log(`newPlate: ${newPlate}`)
        
        //add plate to User's plates array
        console.log(`adding to user: ${userID}`);

        const updatedUser = await User.findByIdAndUpdate(
            userID, 
            { $push: { plates: newPlate._id } },
            {new:true}
         );

         console.log(updatedUser);
        
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
    
    console.log(req.params.id);
    console.log(req.body);
    
    try {
    
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