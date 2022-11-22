import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from '../photos/photos.service';
import { TagsService } from '../tags/tags.service';
import { UsersService } from '../users/users.service';
import { PostsDto } from './dto/posts.dto';
import { PostsEntity } from './posts.entity';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { FollowingRelationshipsService } from '../following-relationships/following-relationships.service';
import { NotFoundError } from 'rxjs';
import { PostLikeService } from '../post-like/post-like.service';
import { PostCommentsService } from '../post-comments/post-comments.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostsEntity) private postRepo: Repository<PostsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => PhotosService)) private photosService: PhotosService,
        @Inject(forwardRef(() => TagsService)) private tagsService: TagsService,
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followingService: FollowingRelationshipsService,
        @Inject(forwardRef(() => PostLikeService)) private postLikeService: PostLikeService,
        @Inject(forwardRef(() => PostCommentsService)) private postCommentService: PostCommentsService,
    ) { }

    async createNewPost(postsDto: PostsDto, userId: number) {
        let postsEntity = new PostsEntity();
        postsEntity.content = postsDto.content;
        postsEntity.user = await this.userService.findOne(userId);
        postsEntity.createdDate = new Date();
        postsEntity.status = 1;
        try {
            const result = await this.postRepo.save(postsEntity);
            //this.tagsService.addTags(postsDto.tags, result, postsEntity.user); //add tag
            return { postId: result.id }
        } catch (error) {
            throw new InternalServerErrorException(`Something blow up with our code ${error}`)
        }
    }

    async uploadPhotos(files: Array<Express.Multer.File>, postId: number) {
        const postEntity = await this.postRepo.findOne(postId);
        return await this.photosService.uploadPhoto(files, postEntity);

    }

    async paginate(take: number, page: number, userId: number): Promise<any> {
        const listFollow = (await this.followingService.getFollowedUser(userId)).map((follow) => {
            return follow.followedUserId;
        });
        listFollow.push(userId);
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        try {
            const totalPost = await this.postRepo.createQueryBuilder('p').select().where('p.userId IN (:...ids)', { ids: listFollow }).getCount();
            const listPosts = await this.postRepo.createQueryBuilder('p')
                .innerJoinAndSelect('p.user', 'userInfo')
                .where('p.userId IN (:...ids)', { ids: listFollow })
                .andWhere('p.createdDate > :date', { date: this.getNDayBefore(5) })
                .orderBy('p.createdDate', 'DESC').skip(skipQuery).take(takeQuery).getMany();

            const result = [];
            for (const item of listPosts) {
                const totalComments = await this.postCommentService.getNumberComments(item.id);
                const totalLikes = await this.postLikeService.getNumberLikes(item.id);
                const photos = await this.photosService.getPhotos(item.id);
                const isLike = await this.postLikeService.isLike(item.id, userId);
                const response = {
                    postId: item.id,
                    content: item.content,
                    createdDate: item.createdDate,
                    status: item.status,
                    share: item.share,
                    userId: item.user.id,
                    fullName: item.user.fullName,
                    avatar: item.user.avatar,
                    photos: photos,
                    isLike: isLike,
                    totalComments: totalComments,
                    totalLikes: totalLikes
                }
                result.push(response)
            }
            return this.paginateResponse(result, pageQuery, takeQuery, totalPost);
        } catch (error) {
            throw new InternalServerErrorException(`Something blow up with our code ${error}`)
        }
    }

    async getPostsForProfile(take: number, page: number, userId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        try {
            const totalPost = await this.postRepo.createQueryBuilder('p').select().where('p.userId = :userId', { userId: userId }).getCount();
            const listPosts = await this.postRepo.createQueryBuilder('p')
                .innerJoinAndSelect('p.user', 'userInfo')
                .where('p.userId = :userId', { userId: userId })
                .orderBy('p.createdDate', 'DESC').skip(skipQuery).take(takeQuery).getMany();
            const result = [];
            for (const item of listPosts) {
                const totalComments = await this.postCommentService.getNumberComments(item.id);
                const totalLikes = await this.postLikeService.getNumberLikes(item.id);
                const photos = await this.photosService.getPhotos(item.id);
                const isLike = await this.postLikeService.isLike(item.id, userId);
                const response = {
                    postId: item.id,
                    content: item.content,
                    createdDate: item.createdDate,
                    status: item.status,
                    share: item.share,
                    userId: item.user.id,
                    fullName: item.user.fullName,
                    avatar: item.user.avatar,
                    photos: photos,
                    isLike: isLike,
                    totalComments: totalComments,
                    totalLikes: totalLikes
                }
                result.push(response)
            }
            return this.paginateResponse(result, pageQuery, takeQuery, totalPost);
        } catch (error) {
            throw new InternalServerErrorException(`Something blow up with our code ${error}`)
        }
    }

    async findOne(postId: number): Promise<PostsEntity> {
        const result = await this.postRepo.findOne(postId);
        if (!result) {
            throw new BadRequestException(`Post have id-${postId} does not exist`)
        }
        return result;
    }

    async getTotalPost(userId: number): Promise<number> {
        try {
            const result = await this.postRepo.createQueryBuilder().select().where('userId = :userId', { userId: userId }).getCount();
            return result;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    getNDayBefore(n: number): Date {
        var date = new Date();
        date.setDate(date.getDate() - n);
        return date;
    }

    paginateResponse(data: any, page: number, limit: number, total:number) {
        const lastPage = Math.ceil(total / limit);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        return {
            data: [...data],
            total: total,
            currentPage: page,
            nextPage: nextPage,
            prevPage: prevPage,
            lastPage: lastPage,
        }
    }



}
