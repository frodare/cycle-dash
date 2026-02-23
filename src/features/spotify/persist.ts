import { setTokens } from '.'
import { store } from '../../store'
import { handleCallback } from './auth'

const ACCESS_TOKEN_KEY = 'spotify_access_token'
const REFRESH_TOKEN_KEY = 'spotify_refresh_token'
const EXPIRES_AT_KEY = 'spotify_expires_at'

const loadFromStorage = (): void => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const expiresAtStr = localStorage.getItem(EXPIRES_AT_KEY)

  if (accessToken != null && refreshToken != null && expiresAtStr != null) {
    store.dispatch(setTokens({
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAtStr, 10)
    }))
  }
}

store.subscribe(() => {
  const { isLinked, accessToken, refreshToken, expiresAt } = store.getState().spotify
  if (isLinked && accessToken != null && refreshToken != null && expiresAt != null) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt))
  } else if (!isLinked) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(EXPIRES_AT_KEY)
  }
})

loadFromStorage()
void handleCallback()
