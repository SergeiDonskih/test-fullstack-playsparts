<script setup lang="ts">
  import { getAdminDataRequest } from '~/services/admin.service';
  import { getApiErrorMessage } from '~/composables/useApiError';

  definePageMeta({
    middleware: ['admin'],
  });

  const { isAdmin, bootstrapped } = useAuth();
  const message = ref('Loading...');
  const isMounted = ref(false);
  const canShowAdminContent = computed(
    () => isMounted.value && bootstrapped.value && isAdmin.value,
  );

  onMounted(async () => {
    isMounted.value = true;

    if (!isAdmin.value) {
      return;
    }

    try {
      const data = await getAdminDataRequest();
      message.value = data.message;
    } catch (e) {
      message.value = getApiErrorMessage(e);
    }
  });
</script>

<template>
  <section v-if="canShowAdminContent" class="card">
    <h1 class="page-title">Страница Админа</h1>
    <p class="text-muted">{{ message }}</p>
  </section>
  <section v-else class="card">
    <h1 class="page-title">Проверка доступа...</h1>
    <p class="text-muted">Подтверждаем права для admin-раздела.</p>
  </section>
</template>
