export default defineNuxtRouteMiddleware((to, from) => {
 const cookie = useCookie('token')
  const publicPaths = ['/login', '/sign-up', '/otp-varification']

  const isPublic = publicPaths.includes(to.path)

  // If user is logged in and trying to visit a public page, redirect to home
  if (cookie.value && isPublic) {
    return navigateTo('/')
  }

  // If user is NOT logged in and trying to access a protected page, redirect to login
  if (!cookie.value && !isPublic) {
    return navigateTo('/login')
  }
})
