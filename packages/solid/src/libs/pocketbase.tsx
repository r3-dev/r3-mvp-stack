import PocketBase, { type BaseAuthStore } from '@r3-dev/pocketbase'
import { createContext, createEffect, useContext } from 'solid-js'
import type { TypedPocketBase } from '@r3-dev/pocketbase/types'
import type { ParentComponent } from 'solid-js'

const PocketBaseContext = createContext<PocketBase>(undefined, {
  name: 'PocketBaseContext'
})

export function usePocketBase() {
  const context = useContext(PocketBaseContext)

  if (context === undefined) {
    throw new Error(
      `${usePocketBase.name} hook was used outside of ${PocketbaseProvider.name}.`
    )
  }

  return context
}

type PocketBaseProps = {
  url: string
  authStore: BaseAuthStore
}

export const PocketbaseProvider: ParentComponent<PocketBaseProps> = (props) => {
  const pb = new PocketBase(props.url, props.authStore) as TypedPocketBase

  createEffect(() => {
    if (import.meta.env.DEV) {
      console.log(pb.authStore)
    }
  })

  return (
    <PocketBaseContext.Provider value={pb}>
      {props.children}
    </PocketBaseContext.Provider>
  )
}
