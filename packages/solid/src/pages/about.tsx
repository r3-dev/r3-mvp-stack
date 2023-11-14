import { A } from '@solidjs/router'
import { buildPath } from '../routes'

export default function About() {
  return (
    <div>
      <h1 class="font-bold text-blue-600">About</h1>
      <A href={buildPath('/')}>Home</A>
    </div>
  )
}
