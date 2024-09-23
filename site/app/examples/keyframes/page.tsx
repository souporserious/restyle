import { styled, keyframes } from 'restyle'

const BoxKeyframes = keyframes({
  '0%': {
    transform: 'translateX(0) scale(1) rotate(0deg)',
    backgroundColor: 'red',
  },
  '25%': {
    transform: 'translateX(150px) scale(1.2) rotate(45deg)',
    backgroundColor: 'green',
  },
  '50%': {
    transform: 'translateX(300px) scale(1) rotate(90deg)',
    backgroundColor: 'blue',
  },
  '75%': {
    transform: 'translateX(150px) scale(0.8) rotate(135deg)',
    backgroundColor: 'purple',
  },
  '100%': {
    transform: 'translateX(0) scale(1) rotate(180deg)',
    backgroundColor: 'red',
  },
})

const Box = styled('div', {
  width: '100px',
  height: '100px',
  backgroundColor: 'red',
  position: 'relative',
  animation: `${BoxKeyframes} 6s ease-in-out infinite`,
})

export default function Page() {
  return (
    <>
      <BoxKeyframes />
      <Box />
    </>
  )
}
