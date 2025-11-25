<template>
<div class="login-container">
    <div class="login-form-card">
    
    <form @submit.prevent="handleLogin">
        <input type="text" placeholder="Email " required v-model="email"> 
        
        <input type="password" placeholder="Password" required v-model="password"> 
        
        <button type="submit" class="btn-primary">Sign in</button>
    </form>
    <div class="card-footer">
            <p>
        <span class="text-muted">Don't have account? </span>
        <router-link to="/signup" class="footer-link">
            Create new account
        </router-link>
    </p>
            <p>
                <router-link to="/forgot-password" class="footer-link">Forget password?</router-link>
            </p>
        </div>
        <div class="divider"></div>
<button @click="loginWithGoogle" class="btn-google">
    <i class="google icon"></i> Sign in with google
    </button>
    
    </div>
    
    
</div>
</template>

<script setup> 
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../authState'; 
import Swal from 'sweetalert2';

const router = useRouter()

const email = ref('')
const password = ref('')


const handleLogin = () => {
    const result = loginUser(email.value, password.value);// gọi hàm đăng nhập

    if (result.success) {
        console.log('Login success');
        router.push('/'); // chuyển về trang chủ
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: result.message,
            });
    }
}

const loginWithGoogle = () => {
    console.log('Redirecting to Google Login page...')
    router.push('/Google-login') 
}

</script>

<style>
.login-container {
    display: flex;
    justify-content: center; 
    align-items: center;    
    min-height: calc(100vh - 80px); 

}

.login-content {
display: flex;
justify-content: space-between;
width: 980px; 
margin-top: -100px; 
align-items: flex-start;
padding:  0;
}


.login-message {
width: 400px;
padding-top: 50px;
text-align: left;
}

.login-message h1 {
font-size: 2.8em;
color: var(--facebook-blue);
text-align: left;
margin-bottom: 5px;
}

.login-message p {
font-size: 1.2em;
color: var(--text-color);
}


.login-form-card {
width: 396px;
background-color: var(--card-background);
border-radius: 8px;
box-shadow: var(--shadow-light), 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
padding: 15px;
display: flex;
flex-direction: column;
}


.login-form-card input {
width: 100%;
padding: 14px 16px;
margin-bottom: 10px;
border: 1px solid var(--border-color);
border-radius: 6px;
font-size: 17px;
box-sizing: border-box; 
}


.btn-primary {
background-color: var(--facebook-blue);
color: white;
font-size: 20px;
font-weight: bold;
height: 48px;
margin-top: 10px;
margin-bottom: 10px;
}
.btn-primary:hover {
background-color: #166fe5;
}


.forgot-password-link {
color: var(--facebook-blue);
font-size: 14px;
text-align: center;
text-decoration: none;
margin-bottom: 15px;
}
.forgot-password-link:hover {
text-decoration: underline;
}


.btn-google {
background-color: #db4437; 
color: white;
font-size: 16px;
font-weight: bold;
height: 40px;
margin-top: 10px;
margin-bottom: 15px;
}
.btn-google:hover {
background-color: #c33d31;
}


.divider {
border-bottom: 1px solid var(--border-color);
margin: 20px 0;
}


.btn-secondary {
background-color: var(--secondary-color); 
color: white;
font-size: 17px;
font-weight: bold;
height: 45px;
margin: 0 auto;
padding: 0 15px;
width: 60%; 
}
.btn-secondary:hover {
background-color: #36a420;
}
.login-form-card form {
    display: flex;
    flex-direction: column;}

    .card-footer {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    font-size: 14px;
    color: #666;
}
</style>