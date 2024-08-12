export const formatCentsToDollarString = (cents: number) => {
  const dollars = cents / 100
  const negative = cents < 0 ? '-' : ''
  const strDollars =
    negative +
    '$' +
    Math.abs(dollars).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  return strDollars
}

export const METHODS = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const
type Method = keyof typeof METHODS

interface UpdateParams<T> {
  dbFunction: (dbDetails: T) => Promise<any>
  storeFunction: (data: T) => void
  payload: T
  method: Method
}
/** Updates the store and database
 * - The parameters for the update function:
 *   - dbFunction: The function to update the database
 *   - storeFunction: The function to update the store
 *   - details: The details of the request
 *   - method: The method of update (ADD, UPDATE, DELETE) (used for logging)
 */
export const updateStoreAndDb = <T>(params: UpdateParams<T>) => {
  const { dbFunction, storeFunction, payload, method } = params
  const messages: Record<Method, string> = {
    [METHODS.ADD]: `adding: ${payload}`,
    [METHODS.UPDATE]: `updating: ${payload}`,
    [METHODS.DELETE]: `deleting: ${payload}`,
  }
  console.log(`Database: ${messages[method]}`)
  dbFunction(payload).then((res) => {
    console.log(`Database response: ${JSON.stringify(res)}`)
  })
  console.log(`Store: ${messages[method]}`)
  storeFunction(payload)
}

export interface submitStatus {
  valid: boolean
  message: string
}
/** Checks a submitted string for being empty or collision with an existing set */
export const checkSubmittedName = (
  name: string,
  existing: string[]
): submitStatus => {
  if (name.length === 0) {
    return { valid: false, message: 'Name is required' }
  }
  if (name.trim().length === 0) {
    return { valid: false, message: 'Name cannot be only spaces' }
  }
  if (existing.some((existingName) => existingName === name)) {
    return { valid: false, message: 'Name already exists' }
  }
  return { valid: true, message: '' }
}
