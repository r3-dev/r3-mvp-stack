import PocketBase from '@r3-dev/pocketbase'
import { defineMiddleware } from 'astro:middleware'

/**
 * @see https://github.com/pocketbase/js-sdk?tab=readme-ov-file#ssr-integration
 */
export const onRequest = defineMiddleware(async (ctx, next) => {
  ctx.locals.pb = new PocketBase(import.meta.env.INTERNAL_BACKEND_URL)

  // load the store data from the request cookie string
  ctx.locals.pb.authStore.loadFromCookie(
    ctx.request.headers.get('cookie') || ''
  )

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    if (ctx.locals.pb.authStore.isValid) {
      await ctx.locals.pb.collection('users').authRefresh()
    }
  } catch {
    // clear the auth store on failed refresh
    ctx.locals.pb.authStore.clear()
  }

  const response = (await next()) as Response

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    'set-cookie',
    ctx.locals.pb.authStore.exportToCookie()
  )

  return response
})
