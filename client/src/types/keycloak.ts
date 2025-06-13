interface IEnv {
  readonly VITE_KEYCLOAK_URL: string
  readonly VITE_KEYCLOAK_REALM: string
  readonly VITE_KEYCLOAK_CLIENT_ID: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_MSW_ENABLED: string
}

interface IMeta {
  readonly env: IEnv
}
