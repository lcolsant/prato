import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login, signup, logout, updateMe, updatePassword, deleteMe } from './login';
// import { plates } from '../../dev-data/data/plates-dev';
import { createPlate, deletePlate, updatePlate } from './plate';
import { addToWeek, removeFromWeek, updateWeek, emailWeek } from './week';

const loginForm = document.querySelector('.form__login-input');
const signUpForm = document.querySelector('.form__login-signup');
const updateMeForm = document.querySelector('.form__login-update');
const updatePasswordForm = document.querySelector('.form__login-password');
const createPlateForm = document.querySelector('.form__createPlate-addPlate')
const logOutBtn = document.querySelector('.navbar__link-logout');
const deletePlateBtn = document.querySelector('.deletePlateBtn');
const updatePlateForm = document.querySelector('.form__createPlate-updatePlate');
const emailPlates = document.querySelector('.email');
const deleteAccount = document.querySelector('.form__update__deleteAccount');


const selectPlateBtn = document.querySelectorAll('.card').forEach(item =>{
    item.addEventListener('click', e => {
        let IDinput = document.getElementById(item.firstElementChild.id);
        if(e.target.localName=='ion-icon'){
            addToWeek(IDinput.value);
        } 
    });
});


const selectRow = document.querySelectorAll('.row__btn').forEach(item =>{
    item.addEventListener('click', e => {
        e.preventDefault();
        let removePlate = item.firstElementChild.id;
        console.log(item.firstElementChild.id);
        removeFromWeek(removePlate);
    });
});


if(updatePasswordForm) {
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
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
} 


if(signUpForm) {
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
    logOutBtn.addEventListener('click', e => {
        e.preventDefault();
        logout()
    });
}


if(deletePlateBtn) {
    deletePlateBtn.addEventListener('click', e => {
        e.preventDefault();
        console.log('delete button clicked');
        // console.log(e.target.id)
        deletePlate(e.target.id);
    });
} 

if(emailPlates) {
  emailPlates.addEventListener('click', e => {
      e.preventDefault();
      emailWeek();
  });
} 

if(deleteAccount) {
  deleteAccount.addEventListener('click', e => {
      e.preventDefault();
      deleteMe(e.target.value);

  });
} 



if(updatePlateForm) {
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


//Draggable feature on week page

window.addEventListener("load", function(){
    var items = document.querySelectorAll("#sortlist li"),
        dragged = null;
  
    for (let i of items) {
      // DRAG START - YELLOW HIGHLIGHT DROPZONE
      // Highlight all except the one being dragged
      i.addEventListener("dragstart", function () {
        dragged = this;
        for (let j of items) {
          if (j != dragged) { j.classList.add("hint"); }
        }
      });
  
      // Drag Enter - add light red highlight
      i.addEventListener("dragenter", function () {
        if (this != dragged) { this.classList.add("active"); }
      });
  
      //DRAG LEAVE - REMOVE RED HIGHLIGHT
    //   i.addEventListener("dragleave", function () {
    //     this.classList.remove("active");
    //   });
  
      //Drag over - prevent default drop behavior
      i.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
  
      // Drop - determine position of dragged and dropped element
      i.addEventListener("drop", function (e) {
        e.preventDefault();
        if (this != dragged) {
          let all = document.querySelectorAll("#sortlist li"),
              draggedpos = 0, droppedpos = 0;
          for (let it=0; it<all.length; it++) {
            if (dragged == all[it]) { draggedpos = it; }
            if (this == all[it]) { droppedpos = it; }
          }
          if (draggedpos < droppedpos) {
            this.parentNode.insertBefore(dragged, this.nextSibling);
          } else {
            this.parentNode.insertBefore(dragged, this);
          }
        //    console.log(dragged.attributes.id);
        //    console.log(this.attributes.id);

           const draggedID = dragged.attributes.id.value;
           const droppedID = this.attributes.id.value;
           updateWeek(draggedID, droppedID);
        }
      });
  
      // DRAG END - REMOVE ALL HIGHLIGHT
      i.addEventListener("dragend", function () {
        for (let j of items) {
          j.classList.remove("hint");
          j.classList.remove("active");
        }
      });
    }
  });