import { A } from '@solidjs/router'
import { buildPath } from '../routes'

export default function Home() {
  return (
    <div>
      <h1 class="text-brand font-bold">Home</h1>
      <A href={buildPath('/about')}>About</A>
    </div>
  )
}
