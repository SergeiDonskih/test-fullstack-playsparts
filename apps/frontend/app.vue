<script setup lang="ts">
  const { initTheme } = useTheme();

  onMounted(() => {
    initTheme();
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  --bg-page: #f8fafc;
  --bg-page-secondary: #eef2ff;
  --bg-surface: #ffffff;
  --bg-surface-muted: rgba(255, 255, 255, 0.86);
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --border-color: #e2e8f0;
  --accent: #2563eb;
  --accent-contrast: #ffffff;
  --danger: #dc2626;
}

:root[data-theme='dark'] {
  --bg-page: #0b1220;
  --bg-page-secondary: #111827;
  --bg-surface: #0f172a;
  --bg-surface-muted: rgba(15, 23, 42, 0.85);
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --border-color: #1f2937;
  --accent: #3b82f6;
  --accent-contrast: #ffffff;
  --danger: #f87171;
}

html,
body,
#__nuxt {
  margin: 0;
  min-height: 100%;
  background: var(--bg-page);
  color: var(--text-primary);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.page-title {
  margin-top: 0;
}

.text-muted {
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
