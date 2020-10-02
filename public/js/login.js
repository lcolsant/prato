import axios from 'axios';
import {showAlert} from './alert'

export const login = async (email, password) => {
    console.log(`in login...${email} ...${password}`);
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
            // alert('Logged in successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 800);
        }
    } catch (err) {
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
        alert('Error logging out!')
    }
}

export const signup = async (name, email, password, passwordConfirm) => {
    console.log(`in signup...${name}...${email} ...${password}...${passwordConfirm}`);
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
            // showAlert('success', 'Logged in successfully!');
            alert('Sign up successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 1500);
        }
    } catch (err) {
        alert('Error signing up!')
        console.log(err)
        // showAlert('error', err.response.data.message);
    }
};

