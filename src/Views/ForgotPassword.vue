<template>
  <div class="login-container">
    <div class="login-form-card">
      <h2 class="ui header">Quên Mật Khẩu</h2>
      <p class="instruction">
        Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu.
      </p>
  
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
            <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                required 
                v-model="email"
                :disabled="isLoading"
            > 
        </div>
        
        <button type="submit" class="btn-primary btn-send" :disabled="isLoading">
          {{ isLoading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
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
        ← Quay lại Đăng nhập
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; 

const email = ref('');
const isLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// URL Backend của bạn (Đã bỏ dấu gạch chéo ở cuối để tránh lỗi //)
const API_BASE_URL = 'https://userservice-latest-p29g.onrender.com'; 

const handleSubmit = async () => {
  // 1. Reset trạng thái
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
    // 2. Gửi yêu cầu POST
    // Lưu ý: dùng .trim() để xóa khoảng trắng thừa nếu copy/paste
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
    email: email.value.trim() 
    });
    
    // 3. Xử lý thành công
    // Nếu backend trả về JSON { message: "..." } thì lấy, không thì tự điền
    successMessage.value = response.data.message || `Link reset đã được gửi tới ${email.value}. Hãy kiểm tra hộp thư!`;
    
    } catch (error) {
    console.error('API Error:', error);
    
    // 4. Xử lý lỗi (Quan trọng)
    let message = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    
    if (error.response && error.response.data) {
        // Trường hợp Backend trả về chuỗi trần (ví dụ: "User not found.")
        if (typeof error.response.data === 'string') {
            message = error.response.data;
        } 
        // Trường hợp Backend trả về JSON object (ví dụ: { message: "Lỗi rồi" })
        else if (error.response.data.message) {
            message = error.response.data.message;
        }
    }

    // Dịch lỗi sang tiếng Việt cho thân thiện
    if (message.includes("User not found")) {
        message = "Email này chưa được đăng ký trong hệ thống.";
    } else if (message.includes("Google account")) {
        message = "Tài khoản này đăng ký bằng Google, không thể reset mật khẩu.";
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