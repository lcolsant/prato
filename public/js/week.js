import axios from 'axios';
import {showAlert} from './alert'


export const addToWeek = async (plateID) => {
    
    try{
        const res = await axios({
            method:'POST',
            url:`/api/v1/plates/${plateID}`,
            data: {
                id: plateID,
            }
        });

        if(res.data.status == 'success'){
            showAlert('success', 'Added plate to week!');
            // console.log(res.data);
        }

    }catch (err) {
        showAlert('error', 'Error adding plate to week.' );
    }
}

export const removeFromWeek = async (plateID) => {
    
    try{
        const res = await axios({
            method:'delete',
            url:`/api/v1/plates/remove/${plateID}`,
            data: {
                id: plateID,
            }
        });

        if(res.data.status == 'success'){
            // showAlert('success', 'Removed plate from week!');
            location.assign('/week');
        }

    }catch (err) {
        showAlert('error', 'Error removing plate from week.' );
    }
}

