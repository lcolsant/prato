import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login, signup } from './login';
import { plates } from '../../dev-data/data/plates-dev';

const loginForm = document.querySelector('.form__login-input');
const signUpForm = document.querySelector('.form__login-signup');
const createPlateForm = document.querySelector('.form__createPlate-addPlate')


if(loginForm) {
    // console.log('found login form');
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email,password)
        login(email, password);
    });
} 


if(signUpForm) {
    // console.log('found signup form');
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        console.log(name,email,password, passwordConfirm)
        signup(name, email, password, passwordConfirm);
    });
} 

if(createPlateForm) {
    console.log('found createPlateForm');
    createPlateForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();  //need this for multipart enctype for form in order to handle image types
        form.append('name', document.getElementById('plateName').value)
        form.append('description', document.getElementById('description').value)
        form.append('photo', document.getElementById('photo').files[0])

        //SEND data here
        //create plates.js and export a function to send to here
    });
}