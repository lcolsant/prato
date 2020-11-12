import axios from 'axios';
import {showAlert} from './alert';


export const createPlate = async (data) => {
    console.log('In createPlate...');
    console.log(data);

    try {

        const res = await axios({
            method: 'post',
            url: '/api/v1/plates',
            data: data
        });

        if(res.data.status == 'success') {
            // showAlert('success', 'Logged in successfully!');
            showAlert('success','Created plate successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }
    
    } catch (err) {
        alert('Error creating plate!')
        console.log(err)
    
    }
}

export const deletePlate = async (data) => {
    console.log('In deletePlate...');
    console.log(data);

    try {

        const res = await axios({
            method: 'delete',
            url: `/api/v1/plates/${data}`,
        });

        console.log(res.status);

        if(res.status == 204) {
            showAlert('success','Deleted plate successfully!');
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }
    
    } catch (err) {
        alert('Error deleting plate!');
        console.log(err);
    
    }
}


export const updatePlate = async (data,id) => {
    try {

        const res = await axios({
            method: 'patch',
            url: `/api/v1/plates/${id}`,
            data: data
        });

        if(res.data.status == 'success') {
            showAlert('success','Updated plate successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }


    } catch (err) {
        alert('Error updating plate!');
        console.log(err);
    }
}
