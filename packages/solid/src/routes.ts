export const basePath = '/solid'

export const routes = {
  home: basePath,
  about: `${basePath}/about`
}

export function buildPath(path: string): string {
  return basePath + path
}
