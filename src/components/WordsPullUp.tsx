import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
}

export default function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: 20 }}
            animate={isInView ? { y: 0 } : { y: 20 }}
            transition={{
              delay: i * 0.08,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {showAsterisk && i === words.length - 1 && (
              <sup className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</sup>
            )}
          </motion.span>
        </span>
      ))}
    </span>
  )
}