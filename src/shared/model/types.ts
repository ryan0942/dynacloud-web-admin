export interface ApiResponse<T> {
  code: number
  success: boolean
  result: T
  message: string
}

export interface PaginationApiResponse<T> {
  code: number
  success: boolean
  result: {
    data: T
    pagination: {
      page: number
      limit: number
      total: number
      has_next: boolean
    }
  }
  message: string
}
