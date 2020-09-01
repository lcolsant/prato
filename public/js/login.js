import axios from 'axios';

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
            // showAlert('success', 'Logged in successfully!');
            alert('Logged in successfully!');
            console.log(res.data)
            window.setTimeout(() => {
                location.assign('/plates');
            }, 1500);
        }
    } catch (err) {
        alert('Error logging in!')
        console.log(err)
        // showAlert('error', err.response.data.message);
    }
};


export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if ((res.data.status == 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        alert('Error logging out!')
    }
}

