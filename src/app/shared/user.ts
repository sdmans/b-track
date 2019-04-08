export interface User {
    email: string,
    id: string,
    name?: string,
    billCollection?: any[],
    dateCreated?: string,
    firestoreId?: string
}