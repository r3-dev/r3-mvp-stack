import { Route, Router, Routes } from '@solidjs/router'

import About from './pages/about'
import Home from './pages/home'
import { routes } from './routes'

export function SolidApp() {
  return (
    <Router>
      <Routes>
        <Route
          path={routes.home}
          component={Home}
        />
        <Route
          path={routes.about}
          component={About}
        />
      </Routes>
    </Router>
  )
}
