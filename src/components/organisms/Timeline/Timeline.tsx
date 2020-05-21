import { compareAsc, parseJSON, startOfDay } from 'date-fns'
import React, { FC, useMemo } from 'react'

import type { Video } from '@/types'

import TimelineSection from './TimelineSection'

type ScheduleMap = Record<string, Array<Video>>

const buildScheduleMap = (values: Array<Video>): ScheduleMap =>
  [...values]
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

type Props = {
  values?: Array<Video>
}

const Timeline: FC<Props> = ({ values }) => {
  const schedule = useMemo(() => values && buildScheduleMap(values), [values])

  return (
    <>
      {schedule ? (
        Object.entries(schedule).map(([day, items]) => (
          <TimelineSection dateTime={day} items={items} key={day} />
        ))
      ) : (
        <TimelineSection />
      )}
    </>
  )
}

export default Timeline
