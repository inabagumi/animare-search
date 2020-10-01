import clsx from 'clsx'
import { formatISODuration, isEqual } from 'date-fns'
import { FC, memo } from 'react'

import LiveStatus from '@/components/LiveStatus'
import Skeleton from '@/components/Skeleton'
import Thumbnail from '@/components/Thumbnail'
import Time from '@/components/Time'
import type { Video } from '@/types'

import styles from './VideoCard.module.css'

type ContainerProps = {
  href?: string
}

const Container: FC<ContainerProps> = ({ children, href }) => {
  if (href) {
    return (
      <a
        className={styles.container}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  return <div className={styles.container}>{children}</div>
}

type TimeOptions = {
  relativeTime?: boolean
}

type Props = {
  timeOptions?: TimeOptions
  value?: Video
}

const VideoCard: FC<Props> = ({ timeOptions, value }) => (
  <Container href={value?.url}>
    <div className={clsx('card', styles.video)}>
      <div className={clsx('card__image', styles.image)}>
        <Thumbnail value={value} />

        {value?.duration ? (
          <span className={clsx('badge', styles.duration)}>
            <Time
              dateTime={formatISODuration(value.duration)}
              variant="duration"
            />
          </span>
        ) : value ? (
          <LiveStatus value={value} />
        ) : null}
      </div>

      <div className={clsx('card__body', styles.content)}>
        {value ? (
          <h3 className={styles.title}>{value.title}</h3>
        ) : (
          <h3 className={styles.title}>
            <Skeleton className={styles.titleSkeleton} variant="text" />
            <Skeleton className={styles.titleSkeleton} variant="text" />
          </h3>
        )}
      </div>

      <div className="card__footer">
        {value?.publishedAt ? (
          <Time
            className={styles.published}
            dateTime={value.publishedAt.toJSON()}
            variant={timeOptions?.relativeTime ? 'relative' : 'normal'}
          />
        ) : (
          <span className={styles.published}>
            <Skeleton variant="text" />
          </span>
        )}
      </div>
    </div>
  </Container>
)

export default memo(
  VideoCard,
  (
    { timeOptions: previousTimeOptions, value: previousValue },
    { timeOptions: nextTimeOptions, value: nextValue }
  ) =>
    previousValue?.title === nextValue?.title &&
    isEqual(previousValue?.publishedAt || 0, nextValue?.publishedAt || 0) &&
    previousValue?.duration?.seconds === nextValue?.duration?.seconds &&
    previousValue?.duration?.minutes === nextValue?.duration?.minutes &&
    previousValue?.duration?.hours === nextValue?.duration?.hours &&
    previousTimeOptions?.relativeTime === nextTimeOptions?.relativeTime
)
