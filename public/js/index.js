import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login } from './login';

const loginForm = document.querySelector('.form__login-input');

if(loginForm) {
    console.log('found login form');
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email,password)
        login(email, password);
    });
} 

else(console.log('login form not found'))
