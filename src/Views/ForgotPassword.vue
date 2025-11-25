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
// Cài đặt và import axios nếu chưa có: npm install axios
import axios from 'axios'; 

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const API_BASE_URL = 'https://userservice-latest-p29g.onrender.com'; // Thay thế bằng URL Backend thực tế

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        // Gửi yêu cầu POST đến Endpoint ForgotPassword
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
            email: email.value
        });
        
        // Xử lý phản hồi thành công từ Backend
        successMessage.value = response.data.message || `Password reset link sent to email ${email.value}. Please check your mailbox.`;
        email.value = ''; 

    } catch (error) {
        // Lỗi từ API (4xx, 5xx) hoặc lỗi mạng
        console.error('API Error:', error);
        
        let message = 'Error sending request. Please try again later.';
        
        if (error.response && error.response.data && error.response.data.message) {
            // Lấy thông báo lỗi cụ thể từ Backend (ví dụ: "Email không tồn tại")
            message = error.response.data.message;
        }

        errorMessage.value = message;
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