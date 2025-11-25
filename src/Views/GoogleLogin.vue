<template>
  <div class="google-auth-container">
    <h2>Đăng nhập bằng Google</h2>
    <p v-if="loading">Đang xác thực...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    
    <button @click="startGoogleLogin" :disabled="loading" class="google-button">
      Đăng nhập bằng Google
    </button>
  </div>
</template>

<script>
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; 
const REDIRECT_URI = encodeURIComponent('http://localhost:8080/auth/callback'); // Phải khớp với Authorized redirect URIs
const SCOPE = encodeURIComponent('openid profile email'); 

// URL để bắt đầu Implicit Grant Flow
const GOOGLE_AUTH_URL = 
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `response_type=token` + // <--- Yêu cầu Access Token trực tiếp (Implicit Flow)
  `&client_id=${GOOGLE_CLIENT_ID}` +
  `&scope=${SCOPE}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&prompt=select_account`;

export default {
  name: 'GoogleAuth',
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  methods: {
    startGoogleLogin() {// Chuyển hướng người dùng đến Google
      window.location.href = GOOGLE_AUTH_URL;
    },
    // Hàm gửi Access Token đến Service 3 (Backend Docker)
    async sendTokenToBackend(accessToken) {
      this.loading = true;
      this.error = null;
      // *** URL của Service 3 đang chạy trong Docker ***
      const SERVICE_3_API = 'http://localhost:5001/api/auth/google-implicit-login'; 

      try {
        const response = await fetch(SERVICE_3_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: accessToken }),// Gửi Access Token nhận được từ Google
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Xác thực backend thất bại');
        }

        const data = await response.json();
        // Backend đã xác thực Access Token và cấp JWT Token ứng dụng
        localStorage.setItem('app-token', data.appToken);
        
        this.$router.push('/'); // Chuyển hướng đến trang chính
        
      } catch (e) {
        this.error = `Lỗi: ${e.message}. Vui lòng thử lại.`;
        console.error("Backend Auth Error:", e);
      } finally {
        this.loading = false;
      }
    },
    // Hàm xử lý URL fragment sau khi Google chuyển hướng về
    handleAuthCallback() {
      const hash = window.location.hash.substring(1);// Đọc URL fragment
      const params = new URLSearchParams(hash.replace(/&/g, '\n'));
      
      const accessToken = params.get('access_token');
      const error = params.get('error');

      if (error) {
        this.error = `Google từ chối đăng nhập: ${error}`;
        this.$router.replace(this.$route.path);// Xóa fragment khỏi URL
        return;
      }

      if (accessToken) {
        this.sendTokenToBackend(accessToken);// Có Access Token, gửi đến backend
        this.$router.replace(this.$route.path); // Xóa Access Token khỏi URL
      }
    }
  },
  mounted() {// Gọi hàm này khi component được mount (để xử lý callback từ Google)
    if (window.location.hash.includes('access_token')) {
      this.handleAuthCallback();
    }
  }
};
</script>

<style scoped>
.google-auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.google-button {
  background-color: #4285F4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
  font-size: 16px;
  transition: background-color 0.3s;
}

.google-button:hover {
  background-color: #3b7ae0;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>