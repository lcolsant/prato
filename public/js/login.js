import axios from 'axios';
import {showAlert} from './alert'

export const login = async (email, password) => {
    
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(res.data.status == 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/plates');
            }, 800);
        }
    } catch (err) {
        console.log(err.response.data.message);
        showAlert('error', err.response.data.message);
        
    }
};


export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        // if ((res.data.status == 'success')) location.reload(true);
        if ((res.data.status == 'success')) location.assign('/');
    } catch (err) {
        console.log(err.response);
        showAlert('error', err.response.data.message);

    }
}

export const signup = async (name, email, password, passwordConfirm) => {
    
    try {

        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });


        if(res.data.status == 'success') {
            showAlert('success', 'Created account successfully!');
            // console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 1500);
        }
    } catch (err) {
        let error = {...err.response.data}
        // console.log('caught error login.js')
        showAlert('error', error.message);
        
    }
};

export const updateMe = async (data,id) => {

    console.log(id);
    console.log('in updateMe:');

    // for (var p of data) {
    //     console.log(p);
    // }
    try {

        const res = await axios({
            method: 'patch',
            url: `/api/v1/users/${id}`,
            data: data
        });

        if(res.data.status == 'success') {
            showAlert('success','Updated user successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 2000);
        }


    } catch (err) {
        alert('Error updating user!');
        console.log(err);
    }
}

export const updatePassword = async (currentPassword, newPassword, passwordConfirm) => {

    try {

        const res = await axios({
            method: 'patch',
            url: `/api/v1/users/`,
            data: {
                currentPassword,
                newPassword,
                passwordConfirm
            }
        });

        if(res.data.status == 'success') {
            showAlert('success','Updated password successfully!');
        }


    } catch (err) {
        alert('Error updating user!');
        console.log(err);
    }
}

export const deleteMe = async (id) => {

    try {

        const res = await axios({
            method: 'delete',
            url: `/api/v1/users/${id}`,
        });

        console.log(res.status);

        if(res.status == 204) {
            showAlert('success','Account successfully deleted!');
            window.setTimeout(() => {
                location.assign('/');
            }, 2000);
        }

    } catch (err) {
        alert('Error deleting account!');
        console.log(err);
    }
}
