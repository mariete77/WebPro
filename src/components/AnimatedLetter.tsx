import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedLetterProps {
  char: string
  index: number
  totalChars: number
}

export default function AnimatedLetter({ char, index, totalChars }: AnimatedLetterProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  // Each character has a staggered window
  const charProgress = index / totalChars
  const start = Math.max(0, charProgress - 0.1)
  const end = Math.min(1, charProgress + 0.05)

  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])

  return (
    <span ref={ref} className="inline-block">
      <motion.span style={{ opacity }}>{char}</motion.span>
    </span>
  )
}