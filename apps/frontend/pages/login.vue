<script setup lang="ts">
  definePageMeta({ layout: false });

  const email = ref('');
  const password = ref('');
  const { login, loading, error } = useAuth();
  const { show } = useNotify();

  const onSubmit = async (): Promise<void> => {
    try {
      await login(email.value, password.value);
      show('Успешный вход в систему', 'success');
      await navigateTo('/');
    } catch {
      show(error.value ?? 'Ошибка авторизации', 'error');
    }
  };
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Авторизация</h1>
      <p class="subtitle">Войти в тестовый кабинет</p>

      <form class="login-form" @submit.prevent="onSubmit">
        <input v-model="email" type="email" placeholder="email" required>
        <input v-model="password" type="password" placeholder="password" required>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Загрузка...' : 'Войти' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, var(--bg-page-secondary) 0%, var(--bg-page) 58%);
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0;
  font-size: 28px;
}

.subtitle {
  margin: 8px 0 18px;
  color: var(--text-secondary);
}

.login-form {
  display: grid;
  gap: 10px;
}

input,
button {
  font: inherit;
  border-radius: 10px;
}

input {
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 11px 12px;
}

button {
  border: 0;
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  padding: 11px 14px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: var(--danger);
  margin-top: 10px;
}
</style>
