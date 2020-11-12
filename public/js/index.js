import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login, signup, logout, updateMe, updatePassword } from './login';
// import { plates } from '../../dev-data/data/plates-dev';
import { createPlate, deletePlate, updatePlate } from './plate';
import { addToWeek, removeFromWeek } from './week';

const loginForm = document.querySelector('.form__login-input');
const signUpForm = document.querySelector('.form__login-signup');
const updateMeForm = document.querySelector('.form__login-update');
const updatePasswordForm = document.querySelector('.form__login-password');
const createPlateForm = document.querySelector('.form__createPlate-addPlate')
const logOutBtn = document.querySelector('.navbar__link-logout');
const deletePlateBtn = document.querySelector('.deletePlateBtn');
const updatePlateForm = document.querySelector('.form__createPlate-updatePlate');
// const IDinput = document.getElementById('plateID');

const selectPlateBtn = document.querySelectorAll('.card').forEach(item =>{
    item.addEventListener('click', e => {
        // e.preventDefault();
        // console.log(item.firstElementChild.id)
        let IDinput = document.getElementById(item.firstElementChild.id);
        // console.log(IDinput.value);
        if(e.target.localName=='ion-icon'){
            addToWeek(IDinput.value);
        } 
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


if(updatePasswordForm) {
    // console.log('found login form');
    updatePasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        console.log(currentPassword,newPassword, passwordConfirm);
        updatePassword(currentPassword, newPassword, passwordConfirm);
    });
}

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

if(updateMeForm) {
    // console.log('found createPlateForm');
    updateMeForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('user_id').value;
        const formData = new FormData();  //need this for multipart enctype for form in order to handle image types
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('photo', document.getElementById('photo').files[0]);
        console.log(document.getElementById('name').value);
        console.log(document.getElementById('email').value);
        console.log(document.getElementById('photo').value);
        console.log(formData);
        for (var p of formData) {
            console.log(p);
        }
        updateMe(formData,id);
    });
}

if(createPlateForm) {
    // console.log('found createPlateForm');
    createPlateForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData();  //need this for multipart enctype for form in order to handle image types
        formData.append('name', document.getElementById('plateName').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('recipe', document.getElementById('recipe').value);
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


if(deletePlateBtn) {
    // console.log('found signup form');
    deletePlateBtn.addEventListener('click', e => {
        e.preventDefault();
        console.log('delete button clicked');
        // console.log(e.target.id)
        deletePlate(e.target.id);
    });
} 



if(updatePlateForm) {
    // console.log('found createPlateForm');
    updatePlateForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('plate_id').value;
        const formData = new FormData();  //need this for multipart enctype for form in order to handle image types
        formData.append('name', document.getElementById('plateName').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('recipe', document.getElementById('recipe').value);
        formData.append('photo', document.getElementById('photo').files[0]);
        console.log(formData);
        updatePlate(formData,id);
    });
}