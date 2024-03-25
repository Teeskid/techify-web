export type Channel = "whatsapp" | "telegram"

export type Contact = {
    profile: {
        name: string
    },
    wa_id: string
}

export type TextMessage = {
    from: string,
    id: string,
    timestamp: string,
    type: "text",
    text: {
        "body": string
    }
}

export type MessageLine = {
    contact: Contact
    message: TextMessage
}

export type Change = {
    field: "messages",
    value: {
        messaging_product: "whatsapp",
        metadata: {
            display_phone_number: string,
            phone_number_id: string
        },
        contacts: Contact[],
        messages: TextMessage[]
    }
}

export type Event = {
    object: "w_b_a",
    entry: [
        {
            id: string,
            changes: Change[]
        }
    ]
}

export type Ping = {
    statuses: [
        {
            id: string,
            recipient_id: string,
            status: "read" | "delivered" | "sent",
            timestamp: string
        }
    ]
}

export type Message2 = {
    from: string,
    id: string,
    text: {
        body: string
    },
    timestamp: string,
    type: "text"
}

export type Ping2 = {
    messages: Message2[]
}

export type PayLoad = {
    messaging_product: "whatsapp",
    to: string,
    type: string,
    template: {
        name: string,
        language: {
            "code": "en_US"
        }
    }
}

export interface Server {
    sendMessage(recipient: string, message: string): Promise<void>
}
