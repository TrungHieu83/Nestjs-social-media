import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, SerializeOptions } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { PostsEntity } from '../posts/posts.entity';
import { UsersService } from '../users/users.service';
import { PhotosEntity } from './photos.entity';
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from 'src/firebase/firebase.base';

@Injectable()
export class PhotosService {
    constructor(@InjectRepository(PhotosEntity) private photosRepository: Repository<PhotosEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService) { }

    async addPhoto(photo: PhotosEntity): Promise<PhotosEntity> {
        return this.photosRepository.save(photo)
    }

    async uploadPhoto(files: Array<Express.Multer.File>, postsEntity: PostsEntity) {
        files.forEach(async (file) => {
            const photoUrl =  await this.uploadToFirebase(file, postsEntity.id.toString());
            //save to db
            let photosEntity = new PhotosEntity();
            photosEntity.photoName = photoUrl;
            photosEntity.post = postsEntity;
            this.photosRepository.save(photosEntity);
        })
        return { 'message': 'Images uploaded' }
    }


    async uploadToFirebase(file: Express.Multer.File, prefixName: string) {
        const fileTypes = ["image/jpeg", "image/png"];
        const { originalname, mimetype, buffer } = file
        if (!fileTypes.includes(mimetype)) {
            throw new BadRequestException(`Format error: File ${originalname} not an image`)
        }
        //save to firebase
        const bucket = admin.storage().bucket()
        const blob = bucket.file(prefixName + originalname)
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: mimetype
            }
        })
        blobWriter.on('error', (err) => {
            throw new InternalServerErrorException(`Something blow up with our code ${err}`)
        })
        blobWriter.end(buffer)
        await this.sleep(7000);
         const photoUrl = await getDownloadURL(ref(storage, prefixName + originalname));
        return photoUrl;
    }


    async getPhotos(postId): Promise<PhotosEntity[]> {
        const result = await this.photosRepository.createQueryBuilder('p').select(['p.id AS id', 'p.photo_name AS url']).where('postId = :postId', { postId: postId }).execute();
        return result;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
