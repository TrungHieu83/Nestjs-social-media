

export class ListFollowDto implements Readonly<ListFollowDto>{

    user: {
        id: number,
        avatar: string,
        fullName: string,
    }
    isFollowing: boolean
}