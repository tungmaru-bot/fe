<template>
  <div class="login-container">
    <div class="login-form-card">
      
      <div v-if="!isSuccess">
        <h2 class="ui header">Đặt Lại Mật Khẩu</h2>
        <p class="instruction">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleResetPassword">
          <div class="input-group">
            <input 
              v-model="newPassword" 
              type="password" 
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" 
              required
              :disabled="isLoading"
            />
          </div>
          
          <div class="input-group">
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Xác nhận mật khẩu mới" 
              required
              :disabled="isLoading"
            />
          </div>

          <p v-if="newPassword !== confirmPassword && confirmPassword.length > 0" class="warning-text">
             Mật khẩu xác nhận không khớp.
          </p>

          <button 
            type="submit" 
            class="btn-primary" 
            :disabled="isLoading || newPassword !== confirmPassword || newPassword.length < 6"
          >
            {{ isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu' }}
          </button>
        </form>
      </div>

      <div v-else class="success-view">
        <h2 class="success-header">Thành Công!</h2>
        <p>Mật khẩu của bạn đã được cập nhật.</p>
        <p>Đang chuyển về trang đăng nhập trong giây lát...</p>
        
        <router-link to="/login" class="btn-primary btn-link">
          Đăng nhập ngay
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Dùng hook của Vue Router
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Khai báo biến
const newPassword = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const isSuccess = ref(false);
const token = ref('');

// URL Backend (Lưu ý: Controller là Auth, nên đường dẫn là api/Auth/reset-password)
const API_URL = 'https://userservice-latest-p29g.onrender.com/api/Auth/reset-password';

// Lấy Token từ URL ngay khi trang web tải xong
onMounted(() => {
  // Lấy token từ URL
  let rawToken = route.query.token;

  if (rawToken) {
    // FIX QUAN TRỌNG: Nếu URL biến dấu + thành dấu cách, ta phải đổi lại thành dấu +
    // Vì token mã hóa base64/hex thường không có dấu cách.
    token.value = rawToken.replace(/ /g, "+");
  } else {
    errorMessage.value = "Lỗi: Không tìm thấy Token.";
  }
});

const handleResetPassword = async () => {
  // 1. Kiểm tra cơ bản
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "Mật khẩu xác nhận không khớp.";
    return;
  }
  
  if (!token.value) {
    errorMessage.value = "Token không hợp lệ.";
    return;
  }

  // 2. Reset trạng thái
  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 3. Gọi API
    // Payload phải khớp với DTO trong C# (ResetPasswordRequestDto)
    const payload = {
      token: token.value,
      // Gửi cả 2 trường hợp để dù Backend tên là gì cũng nhận được
      newPassword: newPassword.value, 
      password: newPassword.value,
      confirmPassword: newPassword.value
    };

    const response = await axios.post(API_URL, payload);

    // 4. Xử lý thành công
    isSuccess.value = true;
    
    // Tự động chuyển trang sau 3 giây
    setTimeout(() => {
      router.push('/login');
    }, 3000);

  } catch (error) {
    console.error("Lỗi Reset Password:", error);
    
    // 5. Xử lý lỗi từ Backend trả về
    if (error.response && error.response.data) {
        // Nếu server trả về message string hoặc object
        const msg = error.response.data.message || error.response.data;
        
        if (typeof msg === 'string' && msg.includes("Invalid or expired token")) {
            errorMessage.value = "Link này đã hết hạn hoặc không hợp lệ. Vui lòng xin cấp lại link mới.";
        } else {
            errorMessage.value = msg;
        }
    } else {
        errorMessage.value = "Lỗi kết nối Server.";
    }
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
  padding: 0 20px;
}
.login-content {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 980px;
  margin-top: -100px;
  padding: 0;
}
.login-form-card {
  width: 396px; 
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-header {
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 17px;
  box-sizing: border-box;
}

.btn-primary {
  background-color: #1877f2;
  color: white;
  font-size: 18px;
  font-weight: bold;
  height: 45px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:disabled {
    background-color: #a4c7f0; 
    cursor: not-allowed;
}

.instruction, .success-message {
  text-align: center;
  margin-bottom: 15px;
  font-size: 15px;
  color: #666;
}
.error-message {
    color: #fa383e; 
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 15px;
    text-align: center;
}
.back-link {
    color: #1877f2;
    text-decoration: none;
    font-weight: bold;
    display: block;
    margin-top: 15px;
}
</style>