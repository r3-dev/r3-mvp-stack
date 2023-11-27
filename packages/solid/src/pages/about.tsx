import { A } from '@solidjs/router'
import { routes } from '../routes'

export default function About() {
  return (
    <div>
      <h1 class="font-bold text-blue-600">About</h1>
      <A href={routes.home}>Home</A>
    </div>
  )
}
