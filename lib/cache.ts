import { redis } from './redis'
import type { MenuItem } from '@/types'

const MENU_TTL = 300 // 5 minutes

export async function getCachedMenu(): Promise<MenuItem[] | null> {
  try {
    const cached = await redis.get<MenuItem[]>('menu:all')
    return cached
  } catch {
    return null
  }
}

export async function setCachedMenu(items: MenuItem[]): Promise<void> {
  try {
    await redis.setex('menu:all', MENU_TTL, JSON.stringify(items))
  } catch {
    // non-blocking
  }
}

export async function invalidateMenuCache(): Promise<void> {
  try {
    await redis.del('menu:all')
  } catch {
    // non-blocking
  }
}
