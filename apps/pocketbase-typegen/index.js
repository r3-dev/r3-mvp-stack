import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

let isLocked = false
const __dirname = fileURLToPath(new URL('.', import.meta.url))

fs.watch(path.join(__dirname, '..', 'backend', 'migrations'), () => {
  if (isLocked) return
  isLocked = true

  exec('pnpm pocketbase-typegen', (error) => {
    if (isLocked) {
      isLocked = false
    }

    if (error) {
      throw new Error(error)
    }

    console.log('Pocketbase types generated.')
  })
})
