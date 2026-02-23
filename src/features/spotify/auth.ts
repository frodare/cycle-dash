import { store } from '../../store'
import { setTokens } from '.'

const CLIENT_ID = 'd213c1e0e54d43a384c223b14d618796'
const REDIRECT_URI = `${window.location.origin}${window.location.pathname}`
const SCOPES = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
const VERIFIER_KEY = 'spotify_pkce_verifier'

const toBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const generateCodeVerifier = (): string => {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  const verifier = toBase64Url(array.buffer)
  sessionStorage.setItem(VERIFIER_KEY, verifier)
  return verifier
}

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return toBase64Url(digest)
}

const initiateAuth = async (): Promise<void> => {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SCOPES
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

const exchangeTokens = async (code: string, verifier: string): Promise<TokenResponse> => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  })
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  if (!response.ok) throw new Error(`Token exchange failed: ${response.status}`)
  return await response.json() as TokenResponse
}

const handleCallback = async (): Promise<void> => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (code == null) return

  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  if (verifier == null) return

  sessionStorage.removeItem(VERIFIER_KEY)
  history.replaceState({}, '', window.location.pathname)

  const tokenData = await exchangeTokens(code, verifier)
  store.dispatch(setTokens({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000
  }))
}

const refreshAccessToken = async (refreshToken: string): Promise<void> => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })
  if (!response.ok) throw new Error(`Token refresh failed: ${response.status}`)
  const tokenData = await response.json() as TokenResponse
  store.dispatch(setTokens({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? refreshToken,
    expiresAt: Date.now() + tokenData.expires_in * 1000
  }))
}

export { initiateAuth, handleCallback, refreshAccessToken }
