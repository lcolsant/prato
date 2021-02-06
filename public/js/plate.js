import axios from 'axios';
import {showAlert} from './alert';


export const createPlate = async (data) => {

    try {

        const res = await axios({
            method: 'post',
            url: '/api/v1/plates',
            data: data
        });

        if(res.data.status == 'success') {
            showAlert('success','Created plate successfully!');
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }
    
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

export const deletePlate = async (data) => {

    try {

        const res = await axios({
            method: 'delete',
            url: `/api/v1/plates/${data}`,
        });

        if(res.status == 204) {
            showAlert('success','Deleted plate successfully!');
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }
    
    } catch (err) {
        showAlert('error', err.response.data.message);
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
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err);
    }
}
