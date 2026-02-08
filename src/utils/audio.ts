/**
 * Audio utility for iOS-compatible sound playback.
 *
 * iOS Safari requires an AudioContext to be created and resumed during a user
 * gesture (tap). After that initial unlock the context stays active and can be
 * used from timers / callbacks.
 *
 * We also use an <audio> element playing a silent loop to keep the audio
 * session alive when the screen is locked or the PWA is backgrounded. This
 * prevents iOS from suspending our audio context.
 */

// ---------------------------------------------------------------------------
// Singleton AudioContext
// ---------------------------------------------------------------------------

let audioCtx: AudioContext | null = null
let unlocked = false
let silentAudio: HTMLAudioElement | null = null
let silentLooping = false

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)()
  }
  return audioCtx
}

// ---------------------------------------------------------------------------
// Unlock – MUST be called from a user-gesture handler (touchend / click)
// ---------------------------------------------------------------------------

/**
 * Call this once from any tap/click handler to unlock Web Audio on iOS.
 * It is safe to call multiple times – subsequent calls are no-ops.
 */
export async function unlockAudio(): Promise<void> {
  if (unlocked) return

  const ctx = getAudioContext()

  // Resume the context (required by iOS Safari)
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  // Play a tiny silent buffer to fully unlock the audio pipeline
  const buffer = ctx.createBuffer(1, 1, 22050)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start(0)

  unlocked = true
}

// ---------------------------------------------------------------------------
// Silent audio loop – keeps the audio session alive while screen is locked
// ---------------------------------------------------------------------------

/**
 * Generate a data-URI for a tiny silent WAV file (~44 bytes of audio).
 * Using a data-URI avoids needing an external file that might not be cached.
 */
function createSilentWavDataUri(): string {
  // Minimal WAV: 44-byte header + 2 bytes (one silent sample, 16-bit mono 8kHz)
  const header = new ArrayBuffer(46)
  const view = new DataView(header)

  // RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 38, true) // file size - 8
  writeString(view, 8, 'WAVE')

  // fmt chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, 1, true)  // PCM
  view.setUint16(22, 1, true)  // mono
  view.setUint32(24, 8000, true) // sample rate
  view.setUint32(28, 16000, true) // byte rate
  view.setUint16(32, 2, true)  // block align
  view.setUint16(34, 16, true) // bits per sample

  // data chunk
  writeString(view, 36, 'data')
  view.setUint32(40, 2, true)  // data size
  view.setInt16(44, 0, true)   // one silent sample

  const blob = new Blob([header], { type: 'audio/wav' })
  return URL.createObjectURL(blob)
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

/**
 * Start looping a silent audio track. This keeps the iOS audio session
 * alive so that the ding can play even when the screen is locked.
 *
 * Call this when a rest timer starts.
 */
export function startSilentLoop(): void {
  if (silentLooping) return

  if (!silentAudio) {
    silentAudio = new Audio(createSilentWavDataUri())
    silentAudio.loop = true
    // Very low volume — effectively silent but keeps the session alive
    silentAudio.volume = 0.01
  }

  silentAudio.play().catch(() => {
    // If play() fails (e.g., not unlocked yet) we just skip —
    // the Web Audio ding will still work in the foreground.
  })
  silentLooping = true
}

/**
 * Stop the silent loop. Call this when the rest timer ends or is skipped.
 */
export function stopSilentLoop(): void {
  if (silentAudio && silentLooping) {
    silentAudio.pause()
    silentAudio.currentTime = 0
  }
  silentLooping = false
}

// ---------------------------------------------------------------------------
// Play the ding alert (3-beep pattern)
// ---------------------------------------------------------------------------

/**
 * Play a 3-beep "ding" alert through Web Audio.
 * Works from timer callbacks as long as `unlockAudio()` was called earlier.
 */
export function playDing(): void {
  try {
    const ctx = getAudioContext()

    // If somehow still suspended, try to resume (best effort)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime

    // Beep 1 – 800 Hz
    playBeep(ctx, 800, now, 0.5)

    // Beep 2 – 800 Hz
    playBeep(ctx, 800, now + 0.25, 0.5)

    // Beep 3 – 1000 Hz (higher pitched, signals "done")
    playBeep(ctx, 1000, now + 0.5, 0.8)
  } catch (e) {
    console.warn('Could not play ding:', e)
  }
}

function playBeep(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = frequency
  osc.type = 'sine'

  gain.gain.setValueAtTime(0.3, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

// ---------------------------------------------------------------------------
// Vibrate
// ---------------------------------------------------------------------------

export function vibrate(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200, 100, 400])
  }
}

// ---------------------------------------------------------------------------
// Notifications (best-effort for background / locked screen on iOS 16.4+)
// ---------------------------------------------------------------------------

/**
 * Request notification permission. Call from a user gesture.
 * Returns true if permission was granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  const result = await Notification.requestPermission()
  return result === 'granted'
}

/**
 * Show a notification (best-effort). Works as a backup alert when the
 * PWA is backgrounded and Web Audio can't fire.
 */
export function showTimerNotification(): void {
  try {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    // Use the service worker registration if available (required for iOS PWA)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('Rest Complete!', {
          body: 'Time for your next set.',
          icon: '/pwa-192x192.svg',
          tag: 'rest-timer', // replaces previous notification with same tag
          requireInteraction: false,
        })
      })
    } else {
      // Fallback to regular Notification API
      new Notification('Rest Complete!', {
        body: 'Time for your next set.',
        icon: '/pwa-192x192.svg',
        tag: 'rest-timer',
      })
    }
  } catch (e) {
    console.warn('Could not show notification:', e)
  }
}
