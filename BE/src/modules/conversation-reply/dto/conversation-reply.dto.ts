
export class ConversationReplyDto implements Readonly<ConversationReplyDto>{

    id: number;

    text: string;

    createdDate: Date;

    isRead: boolean;

    conversationId: number;

    userReply: {
        id: number,
        fullName: string,
        avatar: string,

    }
}