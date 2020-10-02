import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login, signup, logout } from './login';
// import { plates } from '../../dev-data/data/plates-dev';
import { createPlate } from './plate';
import { addToWeek, removeFromWeek } from './week';

const loginForm = document.querySelector('.form__login-input');
const signUpForm = document.querySelector('.form__login-signup');
const createPlateForm = document.querySelector('.form__createPlate-addPlate')
const logOutBtn = document.querySelector('.navbar__link-logout');
// const IDinput = document.getElementById('plateID');

const selectPlateBtn = document.querySelectorAll('.card').forEach(item =>{
    item.addEventListener('click', e => {
        e.preventDefault();
        // console.log(item.firstElementChild.id)
        let IDinput = document.getElementById(item.firstElementChild.id);
        console.log(IDinput.value);
        addToWeek(IDinput.value);
    });
});

const selectRow = document.querySelectorAll('.row__btn').forEach(item =>{
    item.addEventListener('click', e => {
        e.preventDefault();
        // console.log(item.firstElementChild.id)
        let removePlate = document.getElementById(item.firstElementChild.id);
        console.log(removePlate.value);
        removeFromWeek(removePlate.value);
    });
});



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
    // console.log('found createPlateForm');
    createPlateForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData();  //need this for multipart enctype for form in order to handle image types
        formData.append('name', document.getElementById('plateName').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('photo', document.getElementById('photo').files[0]);
        createPlate(formData);
    });
}

if(logOutBtn){
    // console.log('found logOutBtn');
    logOutBtn.addEventListener('click', e => {
        e.preventDefault();
        logout()
    });
}