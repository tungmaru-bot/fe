<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-form-card">
        <div v-if="!passwordReset">
          <h2 class="card-header">Reset Password</h2>
          <p class="instruction">Your token has been verified. Please enter a new password.</p>

          <form @submit.prevent="resetPassword">
            <input 
              v-model="newPassword" 
              type="password" 
              placeholder="New password (at least 6 characters)" 
              required
            />
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirm New Password" 
              required
            />

            <p v-if="newPassword !== confirmPassword && confirmPassword.length > 0" class="error-message">
                Confirmation password does not match.
            </p>

            <button type="submit" class="btn-primary" :disabled="newPassword !== confirmPassword">
              Confirm Password Change
            </button>
          </form>
        </div>

        <div v-else class="success-message">
          <p> Success!</p>
          <p>Your password has been updated. You can log in now.</p>
          <router-link to="/login" class="back-link">Go to Login page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  props: {// lấy token từ url
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      passwordReset: false,
    };
  },
  mounted() {
    console.log("Token received from URL:", this.token);//Gọi API để kiểm tra tính hợp lệ của token ngay khi trang load
  },
  methods: {
    resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      axios.post('/api/reset-password', {//GỌI API ĐỂ ĐẶT LẠI MẬT KHẨU
        token: this.token,
        password: this.newPassword
        })
      this.passwordReset = true;
      setTimeout(() => {//Chuyển hướng người dùng về trang Đăng nhập
        this.$router.push('/login');
      }, 3000);
      
    },
  },
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