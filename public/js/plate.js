import axios from 'axios';

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
            alert('Created plate successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 1000);
        }
    
    } catch (err) {
        alert('Error creating plate!')
        console.log(err)
    
    }
}