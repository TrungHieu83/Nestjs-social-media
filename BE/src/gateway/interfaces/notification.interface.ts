export interface NotificationInterface {
    type: number; //1: follow, 2: like, 3: comment
    fromUserId: number;
    toUserId: number;
    postId: number | null;
    comment: string | null;
    replyForComment: number | null;
}