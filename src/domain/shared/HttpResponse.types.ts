export interface HttpResponse<T> {
  succeeded: boolean
  errorCode: number
  errorMessage: string | null
  validationErrors: string[] | null
  stackTraceMssage: string | null
  data: T
}

export interface PageWrapper<T> {
  totalRecords: number
  totalPage: number
  currentPage: number
  pageSize: number
  data: T[] | null
}

export interface PageParams {
  pageNumber?: number
  pageSize?: number
  filter?: string
}
