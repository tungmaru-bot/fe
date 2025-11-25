import { reactive } from 'vue';
const BASE_API_URL = "https://userservice-latest-p29g.onrender.com/";
import { ref, watchEffect } from 'vue';


export const authState = reactive({
    isLoggedIn: false,
    currentUser: null,
    isAdmin: false
});

const initDatabase = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.find(u => u.email === 'admin@test.com')) {
        users.push({
            id: 'admin_001',
            name: 'Admin',
            email: 'admin@test.com',
            password: 'admin',
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('links')) {
        localStorage.setItem('links', JSON.stringify([]));
    }
};

initDatabase();

export const checkSession = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    if (savedToken) { // Nếu có Token JWT (Đăng nhập Google)
        // Đây là chỗ bạn có thể decode JWT để lấy thông tin user nếu cần
        authState.isLoggedIn = true;
        // Tạm thời, ta chỉ xét isLoggedIn
        
    } else if (savedUser) { // Nếu có User (Đăng nhập Email/Pass)
        const user = JSON.parse(savedUser);
        authState.isLoggedIn = true;
        authState.currentUser = user;
        authState.isAdmin = user.role === 'admin';
    }
};

export const registerUser = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already exists.' };
    }
    const newUser = { id: Date.now().toString(), name, email, password, role: 'user' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Register success!' };
};

export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        authState.isLoggedIn = true;
        authState.currentUser = user;
        authState.isAdmin = user.role === 'admin';
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('token'); // XÓA TOKEN GOOGLE/JWT KHI ĐĂNG NHẬP PASS
        return { success: true, user };
    } else {
        return { success: false, message: 'Wrong email or password.' };
    }
};

export const handleLogout = () => {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    authState.isAdmin = false;
    localStorage.removeItem('currentUser'); // Dùng cho Email/Pass
    localStorage.removeItem('token'); // Dùng cho Google/JWT
};



export const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
};

export const deleteUser = (userId) => {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
};

export const addLink = (longUrl, shortUrl, userId) => {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    const newLink = {
        id: Date.now(),
        long: longUrl,
        short: shortUrl,
        userId: userId || 'guest',
        createdAt: new Date().toLocaleDateString()
    };
    links.unshift(newLink);
    localStorage.setItem('links', JSON.stringify(links));
};

export const getUserLinks = (userId) => {
    const links = JSON.parse(localStorage.getItem('links') || '[]');
    return links.filter(l => l.userId === userId);
};

export const getAllLinks = () => {
    return JSON.parse(localStorage.getItem('links') || '[]');
};

export const deleteLinkFromDB = (linkId) => {
    let links = JSON.parse(localStorage.getItem('links') || '[]');
    links = links.filter(l => l.id !== linkId);
    localStorage.setItem('links', JSON.stringify(links));
};

export const changeUserRole = (userId, newRole) => {
    let users = getAllUsers();

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
};

export const updateUserProfile = (userId, newName) => {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
        users[index].name = newName;
        localStorage.setItem('users', JSON.stringify(users));

        if (authState.currentUser && authState.currentUser.id === userId) {
            authState.currentUser.name = newName;
            localStorage.setItem('currentUser', JSON.stringify(authState.currentUser));
        }
        
        return true;
    }
    return false;
};

export const deleteMyAccount = (userId) => {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));

    let links = getAllLinks();
    links = links.filter(l => l.userId !== userId);
    localStorage.setItem('links', JSON.stringify(links));

    logoutUser();
    
    return true;
};

export const resetPassword = (email, newPassword) => {
    let users = getAllUsers();
    const index = users.findIndex(u => u.email === email);
    
    if (index !== -1) {
        users[index].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    return false;
};

export const checkEmailExists = (email) => {
    const users = getAllUsers();
    return users.some(u => u.email === email);
}

// 1. Tạo biến Reactive để lưu trạng thái đăng nhập
export const isAuthenticated = ref(false);

// 2. Tạo hàm kiểm tra Token trong LocalStorage
function checkAuthStatus() {
    // Trạng thái được xác định bằng việc có Token trong Local Storage hay không
    isAuthenticated.value = !!localStorage.getItem('token');
}

// 3. Hàm đăng nhập (Được gọi sau khi login thành công)
export function setAuthToken(token, userPayload = null) { // Thêm userPayload tùy chọn
    if (token) {
        localStorage.setItem('token', token);
        localStorage.removeItem('currentUser'); // XÓA USER PASS KHI ĐĂNG NHẬP GOOGLE
        
        // Cập nhật trạng thái bằng đối tượng authState
        authState.isLoggedIn = true;
        authState.currentUser = userPayload; 
        // Logic Admin có thể cần phải decode token để kiểm tra role
        // authState.isAdmin = (userPayload && userPayload.role === 'admin'); 
    }
}

// 4. Hàm đăng xuất (Logout)
export function logout() {
    localStorage.removeItem('token');
    isAuthenticated.value = false;
    // Tùy chọn: Chuyển hướng người dùng về trang Login
    // (Nếu bạn dùng router ở đây, bạn sẽ cần truyền router vào hàm này)
}

// 5. Khởi tạo trạng thái khi ứng dụng load lần đầu
checkAuthStatus();
indow.addEventListener('storage', checkAuthStatus);