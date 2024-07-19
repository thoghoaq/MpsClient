export type Device = {
    id: number
    userId: number
    deviceToken: string | null
    deviceName: string | null
    deviceLatitude: number | null
    deviceLongitude: number | null
    isLogged: boolean
    createdAt: Date
    updatedAt: Date | null
}

export type Notification = {
    id: number,
    title: string,
    body: string,
    imageUrl: string | null,
    createdAt: Date,
    readAt: Date | null,
    userId: number
    data: any
}