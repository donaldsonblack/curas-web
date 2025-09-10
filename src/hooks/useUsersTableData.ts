import { useEffect, useState } from "react"
import { useApi } from "@/auth/useAuth"

export interface User {
  id: number;
  cognitoSub: string;
  name: string;
  email: string;
  departments: string[];
  role: string;
  created: string;
}

export function useUsersTableData(): {
  data: User[]
  loading: boolean
  error: string | null
  refetch: () => void
} {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { apiFetch } = useApi()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/api/users`)
      setData(response)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}
