const API_BASE = 'http://localhost:3000/api/v1';

const myForm = document.querySelector('#my-form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const msg_username = document.getElementById('msg_username');
const msg_email = document.getElementById('msg_email');
const msg_dup = document.getElementById('msg_dup');
const msg_password = document.getElementById('msg_password');

myForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    try {
        e.preventDefault();

        if (username.value === '') {
            msg_username.style.color = 'chocolate';
            msg_username.style.background = 'beige';
            msg_username.innerHTML = 'Please Enter Username!';
            setTimeout(() => msg_username.remove(), 3000);
        } else if (email.value === '') {
            msg_email.style.color = 'chocolate';
            msg_email.style.background = 'beige';
            msg_email.innerHTML = 'Please Enter Email!';
            setTimeout(() => msg_email.remove(), 3000);
        } else if (password.value === '') {
            msg_password.style.color = 'chocolate';
            msg_password.style.background = 'beige';
            msg_password.innerHTML = 'Please Enter Password!';
            setTimeout(() => msg_password.remove(), 3000);
        } else {
            // console.log(username.value, email.value, password.value);

            objUser = {
                username: username.value,
                email: email.value,
                password: password.value,
                // student_parent: studentParentPhone.value
            };

            // console.log(objUser);

            let res = await axios.post(`${API_BASE}/auth/signup`, objUser);
            // let res = await axios.post('/signup', objUser);
            

            // console.log(res.data);

            window.location.replace('login.html');
        }



    } catch (err) {
        console.log('err');
        msg_dup.style.color = 'chocolate';
        msg_dup.style.background = 'beige';
        msg_dup.innerHTML = 'Sorry, the Email already Exists!';
        setTimeout(() => msg_dup.remove(), 3000);
        
    }
}