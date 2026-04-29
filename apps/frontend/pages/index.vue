<script setup lang="ts">
  const { user } = useAuth();
  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });
</script>

<template>
  <section class="card">
    <h1 class="page-title">Главная страница</h1>
    <p>Доступно всем авторизованным пользователям.</p>
    <p v-if="isMounted && user" class="text-muted">Вы вошли как: {{ user.email }} ({{ user.role }})</p>
  </section>
</template>
