'use client'

import { type PostgrestError } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { type ReactNode, createContext, useContext, useMemo } from 'react'
import useSWR from 'swr'
import { type Database } from '@/lib/database.types'
import { getAllGroups } from '@/lib/supabase'

type Group = Pick<
  Database['public']['Tables']['groups']['Row'],
  'id' | 'name' | 'slug'
>

type GroupValue = {
  currentValue?: Group
  values: Group[]
}

const GroupContext = createContext<GroupValue>({
  currentValue: undefined,
  values: []
})

export function useGroupContext() {
  return useContext(GroupContext)
}

export function useCurrentGroup(): Group | undefined {
  const { currentValue } = useGroupContext()

  return currentValue
}

export function useGroupList(): Group[] {
  const { values } = useGroupContext()

  return values
}

type GroupProviderProps = {
  children: ReactNode
}

export function GroupProvider({ children }: GroupProviderProps) {
  const pathname = usePathname()
  const { data: groups } = useSWR<Group[], PostgrestError>(
    'group-list',
    getAllGroups
  )
  const currentGroup = useMemo<Group | undefined>(() => {
    if (!pathname || !groups) {
      return
    }

    const slug = pathname.split('/')[2]
    return groups.find((group) => group.slug === slug)
  }, [groups, pathname])

  return (
    <GroupContext.Provider
      value={{ currentValue: currentGroup, values: groups ?? [] }}
    >
      {children}
    </GroupContext.Provider>
  )
}
