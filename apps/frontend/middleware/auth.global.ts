export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return;
  }

  if (to.path === '/login') {
    return;
  }

  const { ensureSession } = useAuth();
  const ok = await ensureSession();
  if (!ok) {
    return navigateTo('/login');
  }
});
