// Crescendo trajectory-attack player: steps through turns that each pass the
// single-turn eval while a cumulative risk meter climbs to a BREACH.
  const root = document.querySelector<HTMLElement>('[data-crescendo]')
  if (root) {
    const turns = [...root.querySelectorAll<HTMLElement>('[data-cre-turn]')]
    const bar = root.querySelector<HTMLElement>('[data-cre-bar]')!
    const pct = root.querySelector<HTMLElement>('[data-cre-pct]')!
    const banner = root.querySelector<HTMLElement>('[data-cre-banner]')!
    const playBtn = root.querySelector<HTMLButtonElement>('[data-cre-play]')!
    const playLabel = root.querySelector<HTMLElement>('[data-cre-play-label]')!
    const stepBtn = root.querySelector<HTMLButtonElement>('[data-cre-step]')!
    const resetBtn = root.querySelector<HTMLButtonElement>('[data-cre-reset]')!

    root.classList.add('is-interactive')
    let shown = 0
    let timer: number | undefined

    const render = () => {
      turns.forEach((t, i) => {
        const on = i < shown
        t.hidden = !on
        if (on && !t.dataset.entered) {
          t.dataset.entered = '1'
          t.classList.add('cre-enter')
        }
      })
      const risk = shown > 0 ? Number(turns[shown - 1].dataset.risk) : 0
      bar.style.setProperty('--cre-risk', String(risk / 100))
      pct.textContent = risk + '%'
      banner.style.display = shown >= turns.length ? 'flex' : 'none'
    }

    const setPlaying = (on: boolean) => {
      root.classList.toggle('is-playing', on)
      playBtn.setAttribute('aria-pressed', String(on))
      playLabel.textContent = on ? 'Pause' : 'Play'
    }
    const pause = () => {
      window.clearInterval(timer)
      setPlaying(false)
    }
    const reset = () => {
      pause()
      shown = 0
      turns.forEach((t) => delete t.dataset.entered)
      render()
    }
    const step = () => {
      if (shown < turns.length) {
        shown++
        render()
      }
      if (shown >= turns.length) pause() // trajectory complete: stop and reset to Play
    }
    const play = () => {
      if (shown >= turns.length) reset() // restart from the top if finished
      window.clearInterval(timer)
      timer = window.setInterval(step, 900)
      setPlaying(true)
    }

    reset()
    stepBtn.addEventListener('click', () => {
      pause()
      step()
    })
    // Play button toggles between play and pause so a reader can stop on a turn.
    playBtn.addEventListener('click', () => {
      if (root.classList.contains('is-playing')) pause()
      else play()
    })
    resetBtn.addEventListener('click', reset)
  }

export {}
