import { A } from '@solidjs/router'

import { routes } from '../routes'

export default function Home() {
  return (
    <div>
      <h1 class="text-brand font-bold">Home</h1>
      <A href={routes.about}>About</A>
    </div>
  )
}
