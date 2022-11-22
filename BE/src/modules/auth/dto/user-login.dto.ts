import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { UserEntity } from 'src/modules/users/users.entity'


export class LoginDto{
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type:String,description:"email"})
    email : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:String,description:"password"})
    password : string

    // @ApiProperty({type: Boolean, description:"Login in with verification code"})
    // isFirst: boolean;

    public static from(dto : Partial<LoginDto>){      
        const result = new LoginDto();              
        result.password = dto.password
        result.email = dto.email
       
        return result;
    }
    public static fromEntity(entity : LoginDto){
        return this.from({                       
            password:entity.password,
            email:entity.email,
          
        })
    }
    public static toEntity(dto : Partial<LoginDto>){
        const result = new UserEntity()      
        result.password = dto.password
        result.email = dto.email
        return result;
    }
}