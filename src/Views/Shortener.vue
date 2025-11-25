<template>
<div class="shortener-wrapper">
    <div class="shortener-page">
        
        <h1 class="ui header" style="margin-bottom: 30px;">.NET URL Shortener</h1>

        <form @submit.prevent="handleSubmit" class="shortener-form">
            <input 
                v-model="longUrl" 
                placeholder="Enter your long URL here..." 
                required 
                class="main-input"
            >
            <button type="submit" :disabled="isLoading" class="btn-shorten">
                {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
            </button>
        </form>

        <div v-if="shortenedUrl" class="result-container">
            <p>Your short link:</p>
            <input 
                type="text"
                :value="shortenedUrl"
                readonly
                class="short-url-input"
                @focus="$event.target.select()"
            >
            <button @click="copyToClipboard(shortenedUrl)" class="btn-copy ui button basic">
                <i class="copy icon"></i> Copy Link
            </button>
        </div>

        <div v-if="error" class="error">
            {{ error }}
        </div>

        <div class="history-container">
            <h2>Your Recent Links</h2>
            <p v-if="linkHistory.length === 0" class="history-empty">No shorten URL yet.</p>
            
            <div class="link-list">
                <div class="link-item" v-for="link in linkHistory" :key="link.id">
                    <div class="link-details">
                        <span class="short-link">{{ link.short }}</span>
                        <span class="long-link">{{ link.long }}</span>
                    </div>
                    
                    <div class="link-actions">
                        <a :href="link.short" target="_blank" class="btn-action ui primary button tiny">
                            Visit
                        </a>
                        <button @click="copyToClipboard(link.short)" class="btn-action ui button tiny">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { authState, addLink } from '../authState'; 
import Swal from 'sweetalert2';

const API_URL = "https://shorten-url-latest.onrender.com/api/shortener/shorten";

const longUrl = ref('');
const shortenedUrl = ref('');
const error = ref('');
const isLoading = ref(false);

const linkHistory = ref([]);

const addToHistory = (long, short) => {
    const newId = Date.now(); 
    linkHistory.value.unshift({ id: newId, long: long, short: short });
};

const handleSubmit = async () => {
    error.value = '';
    shortenedUrl.value = '';
    isLoading.value = true;
    
    // Kiểm tra URL hợp lệ (tối thiểu)
    if (!longUrl.value.startsWith('http://') && !longUrl.value.startsWith('https://')) {
        error.value = 'The URL must start with http:// or https://';
        isLoading.value = false;
        return;
    }

    try {
        const userId = authState.currentUser ? authState.currentUser.id : 'guest';

        // GỌI API THỰC TẾ
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                longUrl: longUrl.value,
                userId: userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            // API trả về thành công
            shortenedUrl.value = data.shortUrl; // Giả định API trả về { shortUrl: "..." }

            // 3. Lưu vào LocalStorage (Database giả) và History
            addLink(longUrl.value, shortenedUrl.value, userId);
            addToHistory(longUrl.value, shortenedUrl.value);
            
            // Xóa input
            longUrl.value = '';

        } else {
            // API trả về lỗi (ví dụ: 400 Bad Request)
            error.value = data.message || 'Unknown error from server.';
        }

    } catch (err) {
        // Lỗi mạng hoặc lỗi kết nối (ví dụ: CORS, API chưa chạy)
        console.error('API connection error:', err);
        error.value = 'Unable to connect to API server. Please check console.';
    } finally {
        isLoading.value = false;
    }
};

const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
        Swal.fire({
            toast: true,
            position: 'top-end', 
            icon: 'success',
            title: 'Link copied!',
            showConfirmButton: false,
            timer: 2000, 
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
    }).catch(err => {
        console.error('Error', err);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Cannot be copied',
            showConfirmButton: false,
            timer: 2000
        });
    });
};
</script>

<style scoped>
.shortener-wrapper {
display: flex;
justify-content: center;
padding-bottom: 50px;
padding-top: 30px;
min-height: calc(100vh - 80px);
background-color: transparent !important; 

background-position: center; 
position: relative; 
overflow: hidden; 
}

.shortener-page {
width: 100%;
max-width: 700px; 
text-align: center;
box-sizing: border-box; 

background-color: white; 
padding: 30px; 
border-radius: 10px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
}


.shortener-form {
    display: flex;
    flex-direction: column; 
    gap: 15px; 
    margin-bottom: 30px;
}

.main-input {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.main-input:focus {
    border-color: #2185d0;
}

.btn-shorten {
    width: 100%;
    padding: 14px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background-color: #2185d0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-shorten:hover {
    background-color: #1678c2;
}

.btn-shorten:disabled {
    background-color: #a0c3e8;
    cursor: not-allowed;
}

.result-container {
    margin-top: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}

.result-container p {
    margin: 0 0 8px 0;
    font-weight: bold;
    color: #555;
}

.short-url-input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f4f4f4; 
    font-size: 18px;
    color: #2185d0;
    font-weight: 600;
    box-sizing: border-box;
}

.btn-copy {
    width: 100%;
}

.history-container {
    margin-top: 40px;
}

.history-container h2 {
    font-size: 1.4rem;
    margin-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
    display: inline-block;
}

.history-empty {
    color: #888;
    padding: 15px;
}

.link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #fff;
    border: 1px solid #eee;
    margin-bottom: 10px;
    border-radius: 6px;
    text-align: left;
}

.link-details {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-right: 15px;
}

.short-link {
    font-weight: bold;
    color: #2185d0;
    font-size: 1.1em;
}

.long-link {
    font-size: 0.9em;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
}

.error { color: red; margin-top: 10px; }
</style>