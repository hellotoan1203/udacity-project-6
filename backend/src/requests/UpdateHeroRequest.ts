/**
 * Fields in a request to update a single Hero item.
 */
export interface UpdateHeroRequest {
  name: string
  dueDate: string
  done: boolean
}