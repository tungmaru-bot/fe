<template>
  <div class="login-wrapper">
    <h2>Đăng nhập hệ thống</h2>
    <div id="google-btn"></div>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

// 1. Điền Client ID của bạn vào đây
const CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com"; 

// 2. URL Backend trên Render
const BACKEND_URL = "https://userservice-latest-p29g.onrender.com/api/auth/google-login";

const error = ref("");

onMounted(() => {
  // Load thư viện Google
  const script = document.createElement('script');
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  
  script.onload = () => {
    if (window.google) {
      // Khởi tạo
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse
      });

      // Hiển thị nút bấm
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: "outline", size: "large", width: 250 } 
      );
    }
  };
  document.head.appendChild(script);
});

// Hàm xử lý khi người dùng login thành công
const handleCredentialResponse = async (response) => {
  try {
    console.log("Google ID Token:", response.credential);

    // Gửi token về Backend
    const res = await axios.post(BACKEND_URL, {
      IdToken: response.credential // Backend C# yêu cầu trường này
    });

    // Thành công!
    console.log("Server trả về:", res.data);
    alert("Đăng nhập thành công: " + res.data.message);
    
    // Lưu token và chuyển trang
    localStorage.setItem("token", res.data.token);
    // router.push('/'); // Uncomment dòng này nếu muốn chuyển trang

  } catch (err) {
    console.error(err);
    error.value = "Lỗi xác thực với Server!";
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