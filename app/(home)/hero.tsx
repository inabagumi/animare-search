import Image from 'next/image'
import hero from '@/assets/hero.jpg'
import Logo from '@/assets/logo.svg'
import styles from './hero.module.css'

export default function Hero(): JSX.Element {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          <Logo
            aria-label="SHINJU DATE"
            className={styles.logo}
            height={80}
            role="img"
            width={256}
          />
        </h1>
      </div>

      <Image
        alt=""
        className={styles.heroImage}
        fill
        priority
        role="presentation"
        src={hero}
      />
    </div>
  )
}
