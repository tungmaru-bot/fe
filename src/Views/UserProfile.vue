<template>
<div class="ui container" style="padding-top: 20px;">
    
    <div class="section-container">
        <h2 class="ui dividing header center-header">User Information</h2>
        <div class="ui fluid card user-profile-card">
            <div class="content">
                <div class="header">User name: {{ userName }}</div>
                <div class="meta">Email: {{ userEmail }}</div>
                <div class="description">
                    <p>Total shortened links: {{ linkHistory.length }}</p>
                </div>
            </div>
            <div class="extra content">
                <button class="ui primary button" @click="openProfileModal">Change Profile</button>
                <button class="ui red button" @click="openPasswordModal">Change password</button>
            </div>
        </div>
    </div>
    
    <div class="ui divider"></div>

    <div class="section-container">
        <h2 class="ui dividing header center-header">History</h2>
        
        <div class="history-container">
            <p v-if="linkHistory.length === 0" class="history-empty">
                You have not shortened any URLs yet.
            </p>
            
            <div class="link-list">
                <div class="link-item" v-for="link in paginatedHistory" :key="link.id">
                    <div class="link-details">
                        <span class="short-link">{{ link.short }}</span>
                        <span class="long-link">{{ link.long }}</span>
                    </div>
                    <div class="link-actions">
                        <a :href="link.short" target="_blank" class="ui primary button tiny">Visit</a>
                        <button @click="copyToClipboard(link.short)" class="ui button tiny">Copy</button>
                        <button @click="deleteLink(link.id)" class="ui red button tiny icon" title="Delete this link">
                            <i class="trash icon"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="totalPages > 1" class="pagination-container">
                <div class="ui pagination menu tiny">
                    <a class="item" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
                        <i class="chevron left icon"></i>
                    </a>
                    
                    <a 
                        v-for="page in totalPages" 
                        :key="page" 
                        class="item" 
                        :class="{ active: currentPage === page }"
                        @click="changePage(page)"
                    >
                        {{ page }}
                    </a>
                    
                    <a class="item" :class="{ disabled: currentPage === totalPages }" @click="changePage(currentPage + 1)">
                        <i class="chevron right icon"></i>
                    </a>
                </div>
            </div>

        </div>
    </div>

    <div v-if="isProfileModalOpen" class="modal-overlay">
        <div class="ui tiny modal custom-modal">
            <i class="close icon" @click="isProfileModalOpen = false"></i>
            <div class="header">Change Profile</div>
            <div class="content">
                <form class="ui form modal-form" @submit.prevent="handleChangeProfile">
                    <div class="field">
                        <label>User Name</label>
                        <input type="text" v-model="profileName">
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input type="email" v-model="profileEmail" disabled>
                    </div>
                    <button class="ui primary button" type="submit" :disabled="isSavingProfile">
                        {{ isSavingProfile ? 'Saving...' : 'Save Changes' }}
                    </button>
                    <p v-if="profileMessage" :class="{ 'error-message': profileError, 'success-message': !profileError }">
                        {{ profileMessage }}
                    </p>
                </form>
            </div>
        </div>
    </div>
    
    <div v-if="isPasswordModalOpen" class="modal-overlay">
        <div class="ui tiny modal custom-modal">
            <i class="close icon" @click="isPasswordModalOpen = false"></i>
            <div class="header">Change Password</div>
            <div class="content">
                <form class="ui form modal-form" @submit.prevent="handleChangePassword">
                    <div class="field">
                        <label>Current password</label>
                        <input type="password" v-model="currentPassword" required>
                    </div>
                    <div class="field">
                        <label>New password</label>
                        <input type="password" v-model="newPassword" required>
                    </div>
                    <div class="field">
                        <label>Confirm new password</label>
                        <input type="password" v-model="confirmNewPassword" required>
                    </div>
                    <button class="ui red button" type="submit" :disabled="isChangingPassword">
                        {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
                    </button>
                    <p v-if="passwordMessage" :class="{ 'error-message': passwordError, 'success-message': !passwordError }">
                        {{ passwordMessage }}
                    </p>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // Thêm watch
import { useRouter } from 'vue-router'; 

// Giả sử authState được import đúng từ '../authState'
import { authState, getUserLinks, deleteLinkFromDB, updateUserProfile } from '../authState'; 
import Swal from 'sweetalert2';

const router = useRouter(); 

// Dùng Optional Chaining (?) để tránh lỗi nếu currentUser là null
const userName = computed(() => authState.currentUser?.name || 'Guest');
const userEmail = computed(() => authState.currentUser?.email || 'No Email');

const linkHistory = ref([]);
const ITEMS_PER_PAGE = 5;
const currentPage = ref(1);

const paginatedHistory = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return linkHistory.value.slice(start, end);
});

const totalPages = computed(() => {
    return Math.ceil(linkHistory.value.length / ITEMS_PER_PAGE);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// *** ĐÃ SỬA: Thêm kiểm tra null cho authState.currentUser ***
const loadRealData = () => {
    // Chỉ thực hiện khi currentUser đã được gán giá trị
    if (authState.currentUser?.id) { 
        const userLinks = getUserLinks(authState.currentUser.id);
        linkHistory.value = [...userLinks];
        linkHistory.value.reverse(); 
    } else {
        linkHistory.value = [];
    }
};

// *** THÊM WATCH: Lắng nghe sự thay đổi của authState.currentUser ***
// Khi đăng nhập thành công, currentUser sẽ chuyển từ null sang object, 
// và watch sẽ kích hoạt loadRealData.
watch(() => authState.currentUser, (newVal) => {
    if (newVal) {
        loadRealData();
    }
}, { immediate: true }); // immediate: true để chạy loadRealData lần đầu khi component mount

onMounted(() => {
    // Không cần gọi loadRealData() ở đây nữa vì đã có watch({ immediate: true })
});


const deleteLink = (id) => {
    // ... (Giữ nguyên logic xóa link) ...
    Swal.fire({
        title: 'Delete link?',
        text: "You will not be able to restore it.!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteLinkFromDB(id);
            loadRealData();
            
            if (paginatedHistory.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
            }
            
            Swal.fire('Deleted!', '', 'success');
        }
    });
};

const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isSavingProfile = ref(false);
const isChangingPassword = ref(false);

const profileName = ref('');
const profileEmail = ref('');
const profileMessage = ref('');
const profileError = ref(false);

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const passwordMessage = ref('');
const passwordError = ref(false);

const openProfileModal = () => {
    profileName.value = userName.value; 
    profileEmail.value = userEmail.value;
    profileMessage.value = '';
    isProfileModalOpen.value = true;
};

// ... (openPasswordModal giữ nguyên) ...

// *** ĐÃ SỬA: Thêm kiểm tra null cho authState.currentUser ***
const handleChangeProfile = async () => {
    // Thêm kiểm tra null trước khi truy cập id
    if (!authState.currentUser || !authState.currentUser.id) {
        profileMessage.value = 'User data not loaded. Please try refreshing.';
        profileError.value = true;
        return;
    }

    if (profileName.value.length < 4 || profileName.value.length > 16) {
        profileMessage.value = 'Name must be between 4 and 16 characters.';
        profileError.value = true;
        return;
    }
    isSavingProfile.value = true;
    await new Promise(r => setTimeout(r, 500));

    // Truy cập id đã được kiểm tra ở trên
    const success = updateUserProfile(authState.currentUser.id, profileName.value);

    if (success) {
        isProfileModalOpen.value = false; 
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your display name has been updated..',
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        profileMessage.value = 'Update error.';
        profileError.value = true;
    }
    isSavingProfile.value = false;
};

// ... (handleChangePassword và copyToClipboard giữ nguyên) ...

const openPasswordModal = () => {
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    passwordMessage.value = '';
    isPasswordModalOpen.value = true;
};

const handleChangePassword = async () => {
    if(newPassword.value !== confirmNewPassword.value) {
        passwordMessage.value = 'Confirmation password does not match.';
        passwordError.value = true;
        return;
    }
    isChangingPassword.value = true;
    await new Promise(r => setTimeout(r, 800));
    passwordMessage.value = 'Password changed successfully !';
    passwordError.value = false;
    isChangingPassword.value = false;
    setTimeout(() => isPasswordModalOpen.value = false, 1500);
};

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Copied!',
        showConfirmButton: false,
        timer: 1500
    });
}
</script>

<style scoped>

.section-container {
    max-width: 700px; 
    margin: 0 auto; 
    padding: 0 15px;
}

.center-header {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 25px;
    font-size: 1.5rem;
    color: #333;
}

.user-profile-card {
    text-align: center;
}
.user-profile-card .extra.content {
    justify-content: center; 
}

.history-container {
    width: 100%;
    background: #fff;
    border: 1px solid #d4d4d5; 
    border-radius: .28571429rem;
    box-shadow: 0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5;
    padding-bottom: 10px; 
}

.history-empty {
    text-align: center;
    padding: 30px;
    color: #777;
}

.link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eaeaea;
}

.link-details {
    display: flex;
    flex-direction: column;
    text-align: left; 
    gap: 5px;
}

.short-link {
    font-weight: bold;
    color: #2185d0;
    font-size: 1.1em;
}

.long-link {
    color: #888;
    font-size: 0.9em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 350px; 
}

.link-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 10px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.ui.modal.custom-modal {
    display: block !important;
    position: relative !important;
    margin: 0 !important;
    top: auto !important;
    left: auto !important;
    width: 90%;
    max-width: 400px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: left;
    margin-top: 15px;
}
.modal-form button {
    align-self: center;
    width: 100%;
}

.close.icon {
    top: 15px;
    right: 15px;
    position: absolute;
    cursor: pointer;
    color: #666;
}

.error-message { color: #db2828; margin-top: 10px; font-size: 0.9em; }
.success-message { color: #21ba45; margin-top: 10px; font-size: 0.9em; }
</style>