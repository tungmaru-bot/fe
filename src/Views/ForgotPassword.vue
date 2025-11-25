<template>
<div class="login-container">
    <div class="login-form-card">
        <h2 class="ui header">Forget password</h2>
        <p class="instruction">
            Enter email to resset password.
        </p>
    
        <form @submit.prevent="handleSubmit">
            <input type="email" placeholder="Enter your email" required v-model="email"> 
            
            <button type="submit" class="btn-primary btn-send" :disabled="isLoading">
                {{ isLoading ? 'Loading...' : 'send request' }}
            </button>
        </form>
        
        <div v-if="successMessage" class="success-message">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
        
        <div class="divider"></div>

        <router-link to="/login" class="back-link">
            return login
        </router-link>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    console.log('Password reset request for:', email.value);

    try {//Gọi API Backend để gửi email đặt lại
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        successMessage.value = `Password reset link sent to email ${email.value}. Please check your mailbox.`;
        email.value = ''; // Xóa email sau khi gửi thành công

    } catch (err) {
        errorMessage.value = 'Error sending request. Please try again later..';
        console.error('API Error:', err);
    } finally {
        isLoading.value = false;
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
    margin-bottom: 5px;
    color: var(--text-color);
}

.instruction {
    text-align: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--text-secondary);
}

.login-form-card input {
    width: 100%;
    padding: 14px 16px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 17px;
    box-sizing: border-box;
}

.btn-primary {
    background-color: var(--facebook-blue, #1877F2); 
    color: white;
    font-size: 17px;
    font-weight: bold;
    height: 40px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
}

.btn-primary:hover:not(:disabled) {
    background-color: #166fe5;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.divider {
    border-bottom: 1px solid var(--border-color);
    margin: 20px 0;
}

.back-link {
    color: var(--facebook-blue, #1877F2);
    font-size: 14px;
    text-align: center;
    text-decoration: none;
}
.back-link:hover {
    text-decoration: underline;
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
.success-message {
    color: green;
    text-align: center;
    margin-top: 10px;
}
</style>