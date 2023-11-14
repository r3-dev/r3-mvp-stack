import { A } from '@solidjs/router'

export default function Home() {
  return (
    <div>
      <h1 class="text-brand font-bold">Home</h1>
      <A href="/solid/about">About</A>
    </div>
  )
}
