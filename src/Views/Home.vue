<template>
    <div class="ui text container" style="padding-top: 50px; text-align: center;">
        <h1 class="ui header">Welcome to .NET URL Shortener</h1>
        <p>Shorten and manage your links easily and efficiently.</p>
        <router-link to="/shortener" class="ui huge primary button">
            Start shortening right now <i class="right arrow icon"></i>
        </router-link>
        <div style="margin-top: 40px;">
        </div>
    </div>
</template>
<script>

export default {
    name: 'Home' 
}
</script>