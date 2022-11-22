import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PhotosModule } from './modules/photos/photos.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { ConversationReplyModule } from './modules/conversation-reply/conversation-reply.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostCommentsModule } from './modules/post-comments/post-comments.module';
import { PostLikeModule } from './modules/post-like/post-like.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MailModule } from './modules/mail/mail.module';
import { FollowingRelationshipsModule } from './modules/following-relationships/following-relationships.module';
import { TagsModule } from './modules/tags/tags.module';
import { AppGateway } from './gateway/app.gateway';
import { GatewayModules } from './gateway/gateway.mofuels';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: 'Us-cdbr-east-05.cleardb.net',
      // port: 3306,
      // username: 'b22b0a7a710731',
      // password: '1a20916b',
      // database: 'heroku_5a36221ee4b6a09',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'web_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
  }),
    UsersModule,
    NotificationsModule,
    PhotosModule,
    ConversationsModule,
    ConversationReplyModule,
    PostsModule,
    PostCommentsModule,
    PostLikeModule,
    AuthModule,
    CacheModule.register({ isGlobal: true }),
    MailModule,
    FollowingRelationshipsModule,
    TagsModule,
    GatewayModules,
  ],
  controllers: [
    AppController
  ],
  providers: [AppService, AppGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'users/reset-password', method: RequestMethod.POST },
               { path: 'users/reset-password', method: RequestMethod.PUT },
               { path: 'users/:email', method: RequestMethod.GET },
               )
      .forRoutes( 'users', 'following-relationships', 'notifications','posts','post-comments','conversations','conversation-reply');
  }
}
