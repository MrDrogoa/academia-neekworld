<template>
  <div class="navbar-brand">
    <router-link to="/" class="logo">
      <img src="@/assets/logo.webp" alt="Academia Logo" class="logo-img" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NavbarBrand",
};
</script>

<style scoped>
.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2a3b5f;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}
</style>
