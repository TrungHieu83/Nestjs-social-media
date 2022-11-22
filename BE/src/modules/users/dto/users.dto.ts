import {} from '@nestjs/swagger'
import {
    IsInt,
    IsEmail,
    IsBoolean,
    IsNumber,
    Min,
    Max,
    IsString
  } from 'class-validator';
import { UserEntity } from '../users.entity';
import { ApiProperty } from '@nestjs/swagger';

  export class UserDto implements Readonly<UserDto> {
    
    @IsNumber()
    id: number;

    @ApiProperty({type: String,description:'password'})
    @IsString()
    password : string

    @ApiProperty({type: String,description:'email'})
    @IsEmail()
    email : string

    @ApiProperty({type: String,description:'fullname'})
    @IsString()
    fullName : string

    @IsInt()
    @Min(0)
    @Max(5)
    accountStatus : number

    @IsString()
    verificationCode : string

    @ApiProperty({type: Boolean,description:'gender'})
    @IsBoolean()
    gender : boolean

    @IsString()
    address : string

    @IsString()
    phone : string

    @IsBoolean()
    isEnable :boolean

    avatar: string;


    public static from(dto : Partial<UserDto>){
     
        const result = new UserDto();
        result.id = dto.id;
        result.password = dto.password;
        result.email = dto.email;
        result.fullName = dto.fullName;
        result.accountStatus = dto.accountStatus;
        result.verificationCode = dto.verificationCode;
        result.gender = dto.gender;
        result.address = dto.address;
        result.phone = dto.phone;
        result.isEnable = dto.isEnable;
        result.avatar = dto.avatar;
        return result;
    }
    public static fromEntity(entity : UserEntity){
        return this.from({
            id: entity.id,    
            password: entity.password,       
            email:entity.email,
            fullName:entity.fullName,
            accountStatus:entity.accountStatus,
            verificationCode:entity.verificationCode,
            gender:entity.gender,
            address:entity.address,
            phone:entity.phone,
            isEnable:entity.isEnable,
            avatar: entity.avatar
        })
    }
    public static toEntity(dto : Partial<UserDto>){
        const result = new UserEntity();
        result.id = dto.id;     
        result.password = dto.password;  
        result.email = dto.email;
        result.fullName = dto.fullName;
        result.accountStatus = dto.accountStatus;
        result.verificationCode = dto.verificationCode;
        result.gender = dto.gender;
        result.address = dto.address;
        result.phone = dto.phone
        result.avatar = dto.avatar
        return result;
    }
  }