import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/Container'
import { SearchBar } from '@/components/shared/SearchBar'
import { searchStore } from '@/store/searchStore'

const guests = [
  'photo-1534528741775-53994a69daeb',
  'photo-1500648767791-00dcc994a43e',
  'photo-1506794778202-cad84cf45f1d',
]

function Hero() {
  const reduceMotion = useReducedMotion()
  const navigate = useNavigate()

  const handleFindStay = () => {
    const { destination, checkIn, checkOut, adults, children, rooms } = searchStore.getState()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('adults', String(adults))
    params.set('children', String(children))
    params.set('rooms', String(rooms))
    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#252520] text-white">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ scale: 1.04 }}
        animate={{ scale: reduceMotion ? 1 : 1.12 }}
        transition={{
          duration: reduceMotion ? 0 : 42,
          ease: 'linear',
          repeat: reduceMotion ? 0 : Infinity,
          repeatType: 'reverse',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=2400&q=88"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/65"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      <Container className="relative z-10 pt-28 pb-16 sm:pt-32 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="font-heading text-5xl leading-[0.96] font-medium tracking-tight text-white sm:text-7xl lg:text-8xl">
            Stay somewhere
            <br />
            <span className="font-normal italic">quietly extraordinary.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            Thoughtfully chosen places, made for slowing down and finding your own
            rhythm wherever you arrive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: 0.28 }}
          className="mx-auto mt-9 max-w-6xl"
        >
          <SearchBar variant="hero" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.42 }}
          className="mt-6 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <Button
            variant="gold"
            size="lg"
            className="min-w-48 rounded-full"
            onClick={handleFindStay}
          >
            Find Your Stay
            <ArrowRight aria-hidden="true" />
          </Button>
          <Link
            to="/hotels"
            className="text-sm font-medium text-white/85 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
          >
            Explore all stays
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, delay: 0.58 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-white/85 sm:text-sm"
        >
          <div className="flex -space-x-2">
            {guests.map((photo, index) => (
              <img
                key={photo}
                src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=96&h=96&q=80`}
                alt=""
                loading="lazy"
                width={64}
                height={64}
                className="size-8 rounded-full border-2 border-white/70 object-cover"
                style={{ zIndex: guests.length - index }}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5">
            <Star className="size-3.5 fill-[#e3c89e] text-[#e3c89e]" aria-hidden="true" />
            <span className="font-semibold text-white">4.9</span> average rating
          </span>
          <span className="hidden h-4 w-px bg-white/35 sm:block" aria-hidden="true" />
          <span>Trusted by 50,000+ travelers</span>
        </motion.div>
      </Container>
    </section>
  )
}

export { Hero }
