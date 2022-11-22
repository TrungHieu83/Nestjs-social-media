import { ConversationReplyDto } from "src/modules/conversation-reply/dto/conversation-reply.dto"

export class ConversationsDto implements Readonly<ConversationsDto>{

    id: number

    lastReply: ConversationReplyDto

    user: {
        id: number,
        fullName: string,
        avatar: string
    }
}