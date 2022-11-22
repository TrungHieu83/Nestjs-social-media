import { ConflictException, forwardRef, Inject, Injectable, CACHE_MANAGER, BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './users.entity';
import { UserDto } from './dto/users.dto';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { MailService } from '../mail/mail.service';
import { Cache } from 'cache-manager';
import { ResetPasswordDto } from './dto/user-reset-password.dto';
import { PostsService } from '../posts/posts.service';
import { FollowingRelationshipsService } from '../following-relationships/following-relationships.service';
import { PhotosService } from '../photos/photos.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => MailService)) private mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(forwardRef(() => PostsService)) private postService: PostsService,
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followService: FollowingRelationshipsService,
        @Inject(forwardRef(() => PhotosService)) private photoService: PhotosService

    ) { }

    async findOne(id: number): Promise<UserEntity> {
        const result = await this.usersRepository.findOne(id);
        if (!result) {
            throw new NotFoundException(`User have id-${id} does not exist!`)
        }
        return result;
    }

    async getUserInformation(id: number, loginUserId): Promise<any> {
        await this.findOne(id);
        const totalPost = await this.postService.getTotalPost(id);
        const { totalFollower, totalFollowing } = await this.followService.getTotal(id);
        let isFollowing;
        if (id != loginUserId) {
            isFollowing = await this.followService.isFollowing(id, loginUserId);
        } else {
            isFollowing = null;
        }
        try {
            const userInfo = await this.usersRepository.createQueryBuilder('u').select(['u.fullName AS fullName', 'u.cover_img AS cover', 'u.avatar AS avatar']).where('id = :id', { id: id }).execute();
            const result = { fullName: userInfo[0].fullName, cover: userInfo[0].cover, avatar: userInfo[0].avatar, totalPost, totalFollower, totalFollowing, isFollowing };
            return result;

        } catch (error) {
            throw new InternalServerErrorException('Something blow up with our code');
        }

    }
    async findByFacebookUserId(id: number, fullName: string): Promise<any> {
        const result = await this.usersRepository.createQueryBuilder('u').select(['u.id AS id', 'u.fullName AS fullName', 'u.email AS email', 'u.avatar AS avatar']).where('facebookId = :id', { id: id }).execute();
        if (result.length === 0) {
            return await this.addFacebookUser(id, fullName);
        }
        return result;
    }

    async findByEmail(email: string): Promise<UserDto | undefined> {
        const result = await this.usersRepository.findOne({ where: { "email": email } })
        return result != undefined ? UserDto.fromEntity(result) : null;
    }

    async checkUserToVerify(email: string): Promise<any> {
        try {
            const result = await this.usersRepository.createQueryBuilder().where('email = :email', { email: email }).andWhere('verificationCode IS NOT NULL').getCount();
            if (result == 0) {
                return {
                    isExist: false
                }
            }
            return {
                isExist: true
            }
        } catch (error) {
            throw new InternalServerErrorException('Something blow up with our code');
        }
    }

    async findAll(): Promise<UserDto[]> {
        const result = (await this.usersRepository.find()).map((userEntity) => {
            return UserDto.fromEntity(userEntity)
        })
        return result
    }

    async addUser(user: UserRegisterDto): Promise<any> {
        if (await this.findByEmail(user.email) != null) {
            throw new ConflictException('This email address is already being used')
        }
        const userEntity = UserRegisterDto.toEntity(user)
        const verificationCode = Math.floor(Math.random() * 100000).toString();
        userEntity.password = await bcrypt.hash(user.password, 10);
        userEntity.isEnable = true;
        userEntity.accountStatus = 0;
        userEntity.createdDate = new Date();
        Object.keys(userEntity).forEach(key => userEntity[key] === undefined ? delete userEntity[key] : {});
        const savedUser = await this.usersRepository.save(userEntity)
        await this.cacheManager.set(`verify-${savedUser.id}`, verificationCode, { ttl: 86400 })
        return this.mailService.verifyEmail(userEntity.email, verificationCode, savedUser.id);
    }

    async updateUser(user: UserDto): Promise<UpdateResult> {
        return await this.usersRepository.update(user.id, UserDto.toEntity(user))
    }

    async updateIsEnable(email: string, isEnable: boolean): Promise<UpdateResult> {
        return await this.usersRepository.createQueryBuilder().update().set({ isEnable: isEnable, verificationCode: '' })
            .where("email=:email", { email: email }).execute()
    }

    async updateStatus(email: string): Promise<UpdateResult> {
        return await this.usersRepository.createQueryBuilder().update().set({ accountStatus: 1, verificationCode: '' })
            .where("email=:email", { email: email }).execute()
    }

    async updateVerificationCode(email: string, verificationCode: string): Promise<UpdateResult> {
        return await this.usersRepository.createQueryBuilder().update().set({ isEnable: false, verificationCode: verificationCode.toString() })
            .where("email=:email", { email: email }).execute()
    }

    async sendSecurityCode(email: string) {
        if (await this.findByEmail(email) === null) {
            throw new NotFoundException('The email is not registered')
        }
        const securityCode = Math.floor(Math.random() * 100000)
        //users have 2 minute to reset password
        await this.cacheManager.set('sCode' + email, securityCode, { ttl: 120 })
        return await this.mailService.resetPasswordEmail(email, securityCode)
    }

    async resetPassword(info: ResetPasswordDto): Promise<UpdateResult> {
        const securityCode = await this.cacheManager.get('sCode' + info.email) as string || ''
        if (info.securityCode.localeCompare(securityCode) != 0) {
            throw new UnauthorizedException('Security code is incorrect')
        }
        const encodePass = await bcrypt.hash(info.newPassword, 10)
        return this.usersRepository.createQueryBuilder().update().set({ password: encodePass })
            .where("email=:email", { email: info.email }).execute()
    }

    async addFacebookUser(id: number, fullName: string): Promise<UserEntity> {
        const userEntity = new UserEntity();
        userEntity.facebookId = id;
        userEntity.isEnable = true;
        userEntity.accountStatus = 1;
        userEntity.fullName = fullName;
        Object.keys(userEntity).forEach(key => userEntity[key] === undefined ? delete userEntity[key] : {});
        return await this.usersRepository.save(userEntity);
    }

    async uploadAvatar(file: Express.Multer.File, userId: number): Promise<any> {
        const avatarUrl = await this.photoService.uploadToFirebase(file, userId.toString());
        await this.usersRepository.createQueryBuilder().update().set({ avatar: avatarUrl }).where('id = :id', { id: userId }).execute();
        return { avatarUrl: avatarUrl }
    }
    async uploadCover(file: Express.Multer.File, userId: number): Promise<any> {
        const coverUrl = await this.photoService.uploadToFirebase(file, userId.toString());
        await this.usersRepository.createQueryBuilder().update().set({ coverImg: coverUrl }).where('id = :id', { id: userId }).execute();
        return { coverUrl: coverUrl }
    }

    async getAvatarFullName(id: number): Promise<any> {
        const result = await this.usersRepository.createQueryBuilder('u')
            .select(['u.avatar AS avatar', 'u.fullName AS fullName'])
            .where('id = :id', { id: id }).execute();
        return result[0];
    }

    async getNewUser(): Promise<UserEntity[]> {
        const result = await this.usersRepository.createQueryBuilder('u').where('u.createdDate > :date', { date: this.getNDayBefore(5) }).orderBy('u.createdDate',
        'DESC').take(10).getMany();
        return result;
    }

    
    getNDayBefore(n: number): Date {
        var date = new Date();
        date.setDate(date.getDate() - n);
        return date;
    }

}
