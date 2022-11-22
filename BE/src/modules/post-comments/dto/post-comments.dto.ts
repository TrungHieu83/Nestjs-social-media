

export class PostCommentsDto implements Readonly<PostCommentsDto>{

    id: number;

    content: string;

    createdDate: Date;

    user: {
        userId: number,
        fullName: string,
        avatar: string
    };

    replyComment: [ReplyCommentDto]
   
}

export class ReplyCommentDto implements Readonly<ReplyCommentDto>{
    id: number;

    content: string;

    createdDate: Date;

    user: {
        userId: number,
        fullName: string,
        avatar: string
    };

}