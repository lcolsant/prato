const Plate = require('../models/plateModel');



exports.getAllPlates = async (req, res) =>{
    
    try{
        
        const plates = await Plate.find();
        //Plate.findOne( {_id: req.params.id } )
        
        res.status(200).json({
            status:'sucess',
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



exports.getPlate = async (req, res) =>{
    
    try{
        
        const plate = await Plate.findById(req.params.id);
        
        res.status(200).json({
            status:'sucess',
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
    
    console.log(req.body);
    
    try {
    
        const newPlate = await Plate.create(req.body);


        res.status(201).json({
            status:'sucess',
            data:{
                message: 'Created a new plate sucessfully!',
                data: newPlate,
            }
        });

    } catch (err){
        res.status(400).json({
            status: 'fail',
            message: 'Error 💥 saving to MongoDB..', err
        });
    }

}