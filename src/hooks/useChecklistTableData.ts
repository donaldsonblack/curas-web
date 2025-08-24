import { useEffect, useState } from "react"
import { useApi } from "../auth/useAuth"

export interface ChecklistRow {
  name: string
  description: string
  equipmentName: string
  equipmentModel: string
  departmentName: string
  frequency: string
  authorName: string
  createdDate: string
  questions: { type: string; question: string }[]
}

export function useChecklistTableData(): {
  data: ChecklistRow[]
  loading: boolean
  error: string | null
  refetch: () => void
} {
  const [data, setData] = useState<ChecklistRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { apiFetch } = useApi()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_URL}/api/checklists/table`
      )
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