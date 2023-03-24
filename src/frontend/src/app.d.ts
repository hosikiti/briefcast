// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      isLoggedIn: boolean
      token: string
    }
    interface PageData {
      isLoggedIn: boolean
      token: string
    }
    // interface Platform {}
  }
}

export { };
