import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { config } from 'dotenv';
import { UsersService } from "src/modules/users/users.service";

config();
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor( @Inject(forwardRef(() => UsersService)) private userService: UsersService) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      // callbackURL: "http://nestjs-project-123.herokuapp.com/auth/facebook/redirect",
      callbackURL: "http://localhost:3000/auth/facebook/redirect",
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    
    const { id, name, emails } = profile;
    const user = {    
      id: id,
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails
    };
    
    const payload = {
      user,
      accessToken,
    };
    done(null, payload);
  }
}