const METHODS = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const
type Method = keyof typeof METHODS

interface UpdateParams<T> {
  dbFunction: (dbDetails: T) => Promise<any>
  storeFunction: (data: T) => void
  details: T
  method: Method
}
/** Updates the store and database
 * - The parameters for the update function:
 *   - dbFunction: The function to update the database
 *   - storeFunction: The function to update the store
 *   - details: The details of the request
 *   - method: The method of update (ADD, UPDATE, DELETE) (used for logging)
 */
const updateStoreAndDb = <T>(params: UpdateParams<T>) => {
  const { dbFunction, storeFunction, details, method } = params
  const messages: Record<Method, string> = {
    [METHODS.ADD]: `adding: ${details}`,
    [METHODS.UPDATE]: `updating: ${details}`,
    [METHODS.DELETE]: `deleting: ${details}`,
  }
  console.log(`Database: ${messages[method]}`)
  dbFunction(details).then((res) => {
    console.log(`Database response: ${JSON.stringify(res)}`)
  })
  console.log(`Store: ${messages[method]}`)
  storeFunction(details)
}
