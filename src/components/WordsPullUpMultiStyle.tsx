import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Segment {
  text: string
  className?: string
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[]
  className?: string
}

export default function WordsPullUpMultiStyle({ segments, className = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Flatten all words preserving their className
  const words: { text: string; className?: string }[] = []
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((word) => {
      words.push({ text: word, className: seg.className })
    })
  })

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden">
          <motion.span
            className={`inline-block ${word.className || ''}`}
            initial={{ y: 20 }}
            animate={isInView ? { y: 0 } : { y: 20 }}
            transition={{
              delay: i * 0.08,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word.text}
          </motion.span>
        </span>
      ))}
    </span>
  )
}