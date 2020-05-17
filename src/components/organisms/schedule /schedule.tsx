import clsx from 'clsx'
import { compareAsc, format, parseJSON, startOfDay } from 'date-fns'
import React, { FC } from 'react'

import VideoCard from 'components/molecules/video-card'
import Video from 'types/video'
import chunk from 'utils/chunk'

import styles from './schedule.module.css'

type ScheduleMap = Record<string, Array<Video>>

type Props = {
  values: Array<Video>
}

const Schedule: FC<Props> = ({ values }) => {
  const schedule = [...values]
    .sort(
      ({ publishedAt: leftPublishedAt }, { publishedAt: rightPublishedAt }) =>
        compareAsc(parseJSON(leftPublishedAt), parseJSON(rightPublishedAt))
    )
    .reduce<ScheduleMap>((map, value) => {
      const publishedAt = parseJSON(value.publishedAt)
      const day = startOfDay(publishedAt).toJSON()
      const items = map[day] ?? []

      return {
        ...map,
        [day]: items.concat(value)
      }
    }, {})

  return (
    <>
      {Object.entries(schedule).map(([day, items]) => (
        <section className="margin-top--lg section" key={day}>
          <h2 className={clsx('margin-bottom--lg', styles.title)}>
            <time dateTime={day}>{format(parseJSON(day), 'yyyy/MM/dd')}</time>
          </h2>

          {chunk(items, 3).map((values) => (
            <div
              className="row"
              key={values.map((value) => value.id).join(':')}
            >
              {values.map((value) => (
                <div
                  className="col col--4 padding-bottom--lg padding-horiz--sm"
                  key={value.id}
                >
                  <VideoCard value={value} />
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  )
}

export default Schedule
