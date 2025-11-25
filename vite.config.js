// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Import path (có thể cần nếu bạn đang sử dụng alias)
// import path from 'path'; 

export default defineConfig({
    plugins: [vue()],
    // Thêm cấu hình resolve.alias để đảm bảo jQuery được xử lý đúng
    // Mặc dù không bắt buộc, nó giúp quá trình bundling rõ ràng hơn.
    resolve: {
        alias: {
            // Đảm bảo import 'jquery' trỏ đến đúng thư viện
            'jquery': 'jquery/dist/jquery.min.js' 
        }
    }
});