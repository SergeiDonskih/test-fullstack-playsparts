<script setup lang="ts">
  const { isAuthenticated, isAdmin, bootstrapped, logout } = useAuth();
  const { mode, toggleMode } = useTheme();
  const { toast, hide } = useNotify();
  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });

  const isRestoringSession = computed(
    () => isMounted.value && !bootstrapped.value,
  );
</script>

<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <NuxtLink class="link" to="/">Главная</NuxtLink>
        <NuxtLink class="link" to="/internal">Внутренняя</NuxtLink>
        <NuxtLink v-if="isMounted && isAdmin" class="link" to="/admin">Админ</NuxtLink>
      </nav>
      <div class="actions">
        <button class="theme-btn" @click="toggleMode">
          {{ mode === 'dark' ? 'Light' : 'Dark' }}
        </button>
        <button v-if="isMounted && isAuthenticated" class="logout-btn" @click="logout">Logout</button>
      </div>
    </header>
    <main class="main">
      <section v-if="isRestoringSession" class="card restore-state">
        <h1 class="page-title">Восстановление сессии...</h1>
        <p class="text-muted">Проверяем refresh-cookie и права доступа.</p>
      </section>
      <slot v-else />
    </main>
    <div
      v-if="toast.visible"
      class="toast"
      :class="{
        'toast-error': toast.type === 'error',
        'toast-success': toast.type === 'success',
      }"
      role="alert"
      @click="hide"
    >
      {{ toast.text }}
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-secondary) 100%);
  color: var(--text-primary);
}

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  background: var(--bg-surface-muted);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);
}

.nav {
  display: flex;
  gap: 8px;
}

.link {
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
}

.link.router-link-active {
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  color: var(--accent);
}

.actions {
  display: flex;
  gap: 8px;
}

.theme-btn,
.logout-btn {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 9px 14px;
  font-weight: 600;
  cursor: pointer;
}

.theme-btn {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.logout-btn {
  background: var(--accent);
  color: var(--accent-contrast);
}

.main {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 16px 40px;
}

.restore-state {
  text-align: center;
}

.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  max-width: 360px;
  border-radius: 12px;
  padding: 11px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.18);
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
}

.toast-error {
  border-color: color-mix(in srgb, var(--danger) 45%, var(--border-color));
  color: var(--danger);
}

.toast-success {
  border-color: color-mix(in srgb, #16a34a 45%, var(--border-color));
  color: #16a34a;
}
</style>
