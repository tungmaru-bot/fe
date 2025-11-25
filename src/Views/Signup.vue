<template>
<div class="login-container">
    <div class="login-form-card">
        <h2 class="ui header">Create new account</h2>
    
        <form @submit.prevent="handleSignup">
            <input 
                type="text" 
                placeholder="Your name (4-16 chars)" 
                required 
                v-model="name"
                minlength="4"
                maxlength="16"
            > 
            
            <input type="email" placeholder="Email" required v-model="email"> 
            
            <input 
                type="password" 
                placeholder="Password (6-20 chars)" 
                required 
                v-model="password"
                minlength="6"
                maxlength="20"
            > 
            
            <input 
                type="password" 
                placeholder="Confirm password" 
                required 
                v-model="confirmPassword"
                minlength="6"
                maxlength="20"
            > 
            
            <button type="submit" class="btn-primary btn-signup">Sign up</button>
        </form>
        
        <div class="divider"></div>

        <router-link to="/login" class="forgot-password-link">
            Already have account ? Sign in
        </router-link>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser, loginUser } from '../authState'; 
import Swal from 'sweetalert2';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;// kiểm tra định dạng mail 
    return re.test(email);
};

const handleSignup = () => {

    if (name.value.length < 4 || name.value.length > 16) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid name',
            text: 'Username must be between 4 and 16 characters.',
        });
        return;
    }

    if (password.value.length < 6 || password.value.length > 20) {
        Swal.fire({
            icon: 'warning',
            title: 'Weak password',
            text: 'Password must be between 6 and 20 characters long.',
        });
        return;
    }

    if (password.value !== confirmPassword.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Passwords do not match',
            text: 'Confirm password does not match the entered password.',
        });
        return;
    }

    const result = registerUser(name.value, email.value, password.value);// gọi hàm đăng ký

    if (result.success) { // tự động đăng nhập 
        loginUser(email.value, password.value);

        Swal.fire({
            title: 'Success!',
            text: 'Registration successful. Redirecting...',
            icon: 'success',
            timer: 1500, 
            showConfirmButton: false
        }).then(() => {
            router.push('/'); 
        });
        
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Registration error',
            text: result.message, 
        });
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px); 
    background-color: var(--background-color);
    padding: 20px;
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

.login-form-card h2 {
    text-align: center;
    margin-bottom: 20px;
    color: var(--text-color);
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
    background-color: var(--secondary-color, #42b72a); 
    color: white;
    font-size: 20px;
    font-weight: bold;
    height: 48px;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
}

.btn-primary.btn-signup:hover {
    background-color: #36a420;
}

.divider {
    border-bottom: 1px solid var(--border-color);
    margin: 20px 0;
}

.forgot-password-link {
    color: var(--facebook-blue, #1877F2);
    font-size: 14px;
    text-align: center;
    text-decoration: none;
    margin-bottom: 5px;
}
.forgot-password-link:hover {
    text-decoration: underline;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
}
</style>