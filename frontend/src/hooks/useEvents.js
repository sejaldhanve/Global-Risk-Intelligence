import { useEffect, useState } from 'react'
import axios from 'axios'

export function useEvents(params = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const fetchEvents = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await axios.get('/api/event', {
          params,
          signal: controller.signal
        })
        if (mounted) {
          setEvents(data.events || [])
        }
      } catch (err) {
        if (!axios.isCancel(err) && mounted) {
          setError(err.response?.data?.error || 'Failed to load events')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [JSON.stringify(params)])

  return { events, loading, error }
}
