export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }

  const { ensureSession, isAdmin } = useAuth();
  const { show } = useNotify();
  const ok = await ensureSession();

  if (!ok || !isAdmin.value) {
    show('Недостаточно прав для доступа к разделу Админ', 'error');
    return navigateTo('/');
  }
});
