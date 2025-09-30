import { createClient, RedisClientType } from 'redis'

class RedisService {
  private client: RedisClientType | null = null
  private isConnected = false

  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      return
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      })

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err)
        this.isConnected = false
      })

      this.client.on('connect', () => {
        console.log('Redis Client Connected')
        this.isConnected = true
      })

      this.client.on('disconnect', () => {
        console.log('Redis Client Disconnected')
        this.isConnected = false
      })

      await this.client.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      // Continue without Redis - graceful degradation
      this.isConnected = false
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit()
      this.isConnected = false
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }

    try {
      await this.client.ping()
      return true
    } catch {
      return false
    }
  }

  async set(key: string, value: string, expireInSeconds?: number): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }

    try {
      if (expireInSeconds) {
        await this.client.setEx(key, expireInSeconds, value)
      } else {
        await this.client.set(key, value)
      }
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null
    }

    try {
      return await this.client.get(key)
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }

    try {
      const result = await this.client.del(key)
      return result > 0
    } catch (error) {
      console.error('Redis DEL error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false
    }

    try {
      const result = await this.client.exists(key)
      return result > 0
    } catch (error) {
      console.error('Redis EXISTS error:', error)
      return false
    }
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.client || !this.isConnected) {
      return []
    }

    try {
      return await this.client.keys(pattern)
    } catch (error) {
      console.error('Redis KEYS error:', error)
      return []
    }
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    if (!this.client || !this.isConnected) {
      return keys.map(() => null)
    }

    try {
      return await this.client.mGet(keys)
    } catch (error) {
      console.error('Redis MGET error:', error)
      return keys.map(() => null)
    }
  }

  async mdel(keys: string[]): Promise<number> {
    if (!this.client || !this.isConnected) {
      return 0
    }

    try {
      return await this.client.del(keys)
    } catch (error) {
      console.error('Redis MDEL error:', error)
      return 0
    }
  }
}

// Singleton instance
export const redisService = new RedisService()

// Initialize connection on module load
redisService.connect().catch(console.error)

export default redisService
