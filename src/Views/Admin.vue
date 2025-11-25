<template>
<div class="ui container" style="padding-top: 30px; padding-bottom: 50px;">
    <h1 class="ui header center aligned">Account controller</h1>

    <div v-if="activeTab === 'users'" class="ui bottom attached active tab segment">
        <h3 class="ui header">User List (Total: {{ users?.length || 0 }})</h3>
        
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th style="width: 150px;">Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <select 
                            class="ui dropdown role-select" 
                            :value="user.role" 
                            @change="handleChangeRole(user, $event)"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </td>
                    <td>
                        <button 
                            class="ui button tiny red" 
                            @click="handleDeleteUser(user.id)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="totalUserPages > 1" class="pagination-container">
            <div class="ui pagination menu">
                <a class="item" :class="{ disabled: currentUserPage === 1 }" @click="changeUserPage(currentUserPage - 1)">
                    <i class="chevron left icon"></i>
                </a>
                <a 
                    v-for="page in totalUserPages" 
                    :key="page" 
                    class="item" 
                    :class="{ active: currentUserPage === page }"
                    @click="changeUserPage(page)"
                >
                    {{ page }}
                </a>
                <a class="item" :class="{ disabled: currentUserPage === totalUserPages }" @click="changeUserPage(currentUserPage + 1)">
                    <i class="chevron right icon"></i>
                </a>
            </div>
        </div>
    </div>

    <div v-if="activeTab === 'links'" class="ui bottom attached active tab segment">
        <h3 class="ui header">All Shortened Links (Total: {{ allLinks?.length || 0 }})</h3>
        
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>Short Link</th>
                    <th>Long Link</th>
                    <th>User ID</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="link in paginatedLinks" :key="link.id">
                    <td><a :href="link.short" target="_blank">{{ link.short }}</a></td>
                    <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        {{ link.long }}
                    </td>
                    <td>{{ link.userId }}</td>
                    <td>
                        <button class="ui button tiny red" @click="handleDeleteLink(link.id)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        
        
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; 
import { getAllUsers, getAllLinks, deleteUser, deleteLinkFromDB, changeUserRole } from '../authState';
import Swal from 'sweetalert2';

const activeTab = ref('users');
const users = ref([]);
const allLinks = ref([]);
// phaan trang
const ITEMS_PER_PAGE = 6;// giới hạn 6 dòng mỗi trang
//phân trang cho ng dùng
const currentUserPage = ref(1);
// Tính toán danh sách User hiển thị trên trang hiện tại
const paginatedUsers = computed(() => {
    const start = (currentUserPage.value - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return users.value.slice(start, end);
});
// Tính tổng số trang User
const totalUserPages = computed(() => {
    return Math.ceil(users.value.length / ITEMS_PER_PAGE);
});
// Hàm chuyển trang User
const changeUserPage = (page) => {
    if (page >= 1 && page <= totalUserPages.value) {
        currentUserPage.value = page;
    }
};


const loadData = () => {
    users.value = getAllUsers() || [];
};

onMounted(() => {
    loadData();
});


const handleChangeRole = (user, event) => {
    const newRole = event.target.value;
    const oldRole = user.role;

    Swal.fire({
        title: 'Change permissions?',
        text: `Change permissions from ${oldRole} to ${newRole}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'comfirm'
    }).then((result) => {
        if (result.isConfirmed) {
            const success = changeUserRole(user.id, newRole);
            if (success) {
                loadData();
                Swal.fire('success', 'Permissions updated.', 'success');
            } else {
                loadData(); 
            }
        } else {
            loadData();     
        }
    });
};

const handleDeleteUser = (userId) => {
    Swal.fire({
        title: 'Delete this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete now!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(userId);
            loadData();
            // lùi về trang trc nếu trang hiệ tại trống
            if (paginatedUsers.value.length === 0 && currentUserPage.value > 1) {
                currentUserPage.value--;
            }
            Swal.fire('Deleted!', '', 'success');
        }
    });
};


</script>

<style scoped>
.role-select {
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    width: 100%;
}
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>