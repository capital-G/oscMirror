export interface CodeMessage {
    code: string
}

export type Message = CodeMessage

export interface ServerToClientEvents {
    broadcastMessage: (message: Message) => void
    broadcastVisual: (message: Message) => void
}

export interface ClientToServerEvents {
    sendMessage: (message: Message) => void
    sendVisual: (message: Message) => void
}