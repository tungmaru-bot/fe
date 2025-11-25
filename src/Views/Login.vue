<template>
<div class="login-container">
    <p v-if="googleError" style="color: red; text-align: center; font-weight: bold;">{{ googleError }}</p>

    <div class="login-form-card">
        
                <form @submit.prevent="handleLogin">
            <input type="text" placeholder="Email " required v-model="email"> 
            <input type="password" placeholder="Password" required v-model="password"> 
            <button type="submit" class="btn-primary">Sign in</button>
        </form>
        
        <div class="divider"></div>
        
        <div id="google-login-button-gsi" style="display: flex; justify-content: center; margin: 15px 0;">
            </div>

        <div class="card-footer">
            <p>
                <span class="text-muted">Don't have account? </span>
                <router-link to="/signup" class="footer-link">Create new account</router-link>
            </p>
            <p>
                <router-link to="/forgot-password" class="footer-link">Forget password?</router-link>
            </p>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// Đảm bảo import setAuthToken từ thư mục cha (..) hoặc đường dẫn tương đối chính xác.
import { loginUser, setAuthToken } from '../authState'; 
import Swal from 'sweetalert2';

const router = useRouter();

const email = ref('');
const password = ref('');
const googleError = ref(''); // Dùng để hiển thị lỗi Google Login

// --- CẤU HÌNH GOOGLE ---
const CLIENT_ID = "317102899110-g5bh9j2tf10uihmb7qkd0otpc8or7h7k.apps.googleusercontent.com"; 
const BACKEND_URL = "https://userservice-latest-p29g.onrender.com/api/auth/google-login";
// --- HẾT CẤU HÌNH ---


// Logic Đăng nhập truyền thống (Giữ nguyên)
const handleLogin = () => {
    const result = loginUser(email.value, password.value);

    if (result.success) {
        console.log('Login success');
        router.push('/');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: result.message,
            });
    }
}

// Logic Google Login (ĐÃ SỬA: Dùng setAuthToken)
const handleCredentialResponse = async (response) => {
    googleError.value = '';
    try {
        console.log("Google ID Token:", response.credential);

        // Gửi token về Backend
        const res = await axios.post(BACKEND_URL, {
            IdToken: response.credential
        });

        // Thành công!
        console.log("Server trả về:", res.data);
        Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công',
            text: res.data.message,
        });
        
        // *** DÒNG ĐÃ SỬA: GỌI HÀM setAuthToken để LƯU VÀ CẬP NHẬT TRẠNG THÁI REACTIVE ***
        setAuthToken(res.data.token, res.data.user);
        
        router.push('/'); // <-- CHUYỂN HƯỚNG KHI THÀNH CÔNG

    } catch (err) {
        console.error(err);
        googleError.value = "Lỗi xác thực với Server!";
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Xác thực Google thất bại. Vui lòng thử lại.',
        });
    }
};

onMounted(() => {
    // 1. Load Script Google động (nếu chưa có)
    if (!document.getElementById('gsi-script')) {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = 'gsi-script';
        document.head.appendChild(script);
    }
    
    // 2. Sau khi script tải, khởi tạo và vẽ nút
    const initGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse
            });

            // Hiển thị nút bấm
            window.google.accounts.id.renderButton(
                document.getElementById("google-login-button-gsi"),
                { theme: "outline", size: "large", width: '100%' } // Dùng width: '100%' để nút đẹp hơn
            );
        } else {
            // Thử lại sau 100ms nếu window.google chưa sẵn sàng (xử lý race condition)
            setTimeout(initGoogleLogin, 100);
        }
    };
    
    // Bắt đầu khởi tạo
    initGoogleLogin();
});
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