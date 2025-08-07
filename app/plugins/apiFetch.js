import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { ofetch } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
 const cookie = useCookie('token')
  

  const api = ofetch.create({
    baseURL: config.public.baseURL,
    headers: {
      token: `${cookie.value}`,
    },
  })

  nuxtApp.provide('api', api)
})
