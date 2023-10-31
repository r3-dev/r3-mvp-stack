import { exec } from 'child_process'

if (process.env.NODE_ENV === 'production') {
  process.exit(1)
} else {
  exec('go mod tidy && go mod download')
}
