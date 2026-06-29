import { useEffect } from 'react'

export default function Confetti() {
  useEffect(() => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.style.position = 'fixed'
      confetti.style.width = '10px'
      confetti.style.height = '10px'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.top = '0px'
      confetti.style.pointerEvents = 'none'
      confetti.style.zIndex = '9999'
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
      confetti.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)'

      const duration = 2 + Math.random() * 1
      const delay = Math.random() * 0.2

      confetti.style.animation = `fall ${duration}s linear ${delay}s forwards`

      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), (duration + delay) * 1000)
    }
  }, [])

  return (
    <style>{`
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `}</style>
  )
}
