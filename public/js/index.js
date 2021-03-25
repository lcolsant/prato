import '@babel/polyfill';  //allow newer javascript features to work in older browsers
import { login, signup, logout, updateMe, updatePassword, deleteMe } from './login';
import { createPlate, deletePlate, updatePlate } from './plate';
import { addToWeek, removeFromWeek, updateWeek, emailWeek } from './week';
import Sortable from 'sortablejs';
// import { plates } from '../../dev-data/data/plates-dev';

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
        removeFromWeek(removePlate);
    });
});


if(updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
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
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup(name, username, email, password, passwordConfirm);
    });
} 

if(updateMeForm) {
    updateMeForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = document.getElementById('user_id').value;
        const formData = new FormData();  //need this for multipart enctype for form in order to handle image types
        formData.append('name', document.getElementById('name').value);
        formData.append('username', document.getElementById('username1').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('photo', document.getElementById('photo').files[0]);

        // for (var p of formData) {
        //     console.log(p);
        // }
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
        updatePlate(formData,id);
    });
}


//sortablejs feature on week page

let myList = document.getElementById("sortlist");

let sortable = new Sortable(myList,{
  // handle:'.handle',
  animation:200,
  onChoose: function(e){console.log(`element ${e.oldIndex} chosen`)},
  onStart: function(e){ console.log('drag started')},
  onEnd: function(e){ 
    console.log('drag ended');
    console.log(`oldIndex:  ${e.oldIndex}`);
    console.log(`newIndex:  ${e.newIndex}`);
    updateWeek(e.oldIndex, e.newIndex);
  }
});

// window.addEventListener("load", function(){

  //check to see if user device is mobile
    // const mobileAndTabletCheck = function() {
    //   let check = false;
    //   (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    //   return check;
    // };

    // const ismobile = mobileAndTabletCheck();
    // console.log(ismobile ? "mobile" : "non-mobile");



//****************************************************old drag drop code */    
      // var items = document.querySelectorAll("#sortlist li"),
      //     dragged = null;
    
      // for (let i of items) {
      //   // DRAG START - YELLOW HIGHLIGHT DROPZONE
      //   // Highlight all except the one being dragged
      //   i.addEventListener("dragstart", function () {
      //     dragged = this;
      //     for (let j of items) {
      //       if (j != dragged) { j.classList.add("hint"); }
      //     }
      //   });
    
      //   // Drag Enter - add light red highlight
      //   i.addEventListener("dragenter", function () {
      //     if (this != dragged) { this.classList.add("active"); }
      //   });
    
      //   //DRAG LEAVE - REMOVE RED HIGHLIGHT
      // //   i.addEventListener("dragleave", function () {
      // //     this.classList.remove("active");
      // //   });
    
      //   //Drag over - prevent default drop behavior
      //   i.addEventListener("dragover", function (e) {
      //     e.preventDefault();
      //   });
    
      //   // Drop - determine position of dragged and dropped element
      //   i.addEventListener("drop", function (e) {
      //     e.preventDefault();
      //     if (this != dragged) {
      //       let all = document.querySelectorAll("#sortlist li"),
      //           draggedpos = 0, droppedpos = 0;
      //       for (let it=0; it<all.length; it++) {
      //         if (dragged == all[it]) { draggedpos = it; }
      //         if (this == all[it]) { droppedpos = it; }
      //       }
      //       if (draggedpos < droppedpos) {
      //         this.parentNode.insertBefore(dragged, this.nextSibling);
      //       } else {
      //         this.parentNode.insertBefore(dragged, this);
      //       }
      //     //    console.log(dragged.attributes.id);
      //     //    console.log(this.attributes.id);
  
      //        const draggedID = dragged.attributes.id.value;
      //        const droppedID = this.attributes.id.value;
      //        updateWeek(draggedID, droppedID);
      //     }
      //   });
    
      //   // DRAG END - REMOVE ALL HIGHLIGHT
      //   i.addEventListener("dragend", function () {
      //     for (let j of items) {
      //       j.classList.remove("hint");
      //       j.classList.remove("active");
      //     }
      //   });
      // }
      
      //****************************************************old drag drop code */    

  // });