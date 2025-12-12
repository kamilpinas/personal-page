import { useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedNumberProps {
  value: number
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 40 })
  const rounded = useTransform(spring, (latest) => Math.round(latest))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{rounded}</motion.span>
}

export default AnimatedNumber
