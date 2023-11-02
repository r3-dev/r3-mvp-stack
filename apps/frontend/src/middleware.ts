import { defineMiddleware } from 'astro:middleware'
import PocketBase from 'pocketbase'

/**
 * @see https://github.com/pocketbase/js-sdk?tab=readme-ov-file#ssr-integration
 */
export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  locals.pb = new PocketBase(import.meta.env.INTERNAL_BACKEND_URL)

  // load the store data from the request cookie string
  locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || '')

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (locals.pb.authStore.isValid) {
      await locals.pb.collection('users').authRefresh()
    }
  } catch {
    // clear the auth store on failed refresh
    locals.pb.authStore.clear()
  }

  const response = await next()

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append('set-cookie', locals.pb.authStore.exportToCookie())

  return response
})
