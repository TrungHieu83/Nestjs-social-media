import { } from '@nestjs/swagger'
import {
  IsEmail,
  IsBoolean,
  IsString
} from 'class-validator';
import { UserEntity } from '../../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto implements Readonly<UserRegisterDto> {

  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ type: String, description: 'password' })
  @IsString()
  password: string

  @ApiProperty({ type: String, description: 'full name' })
  @IsString()
  fullName: string

  @ApiProperty({ type: Boolean, description: 'gender' })
  @IsBoolean()
  gender: boolean

  @ApiProperty({ type: Date, description: 'date of birth' })
  dob: Date

  @ApiProperty({ type: String, description: 'address' })
  address: string

  public static from(dto: Partial<UserRegisterDto>) {
    const result = new UserRegisterDto();
    result.password = dto.password
    result.email = dto.email
    result.fullName = dto.fullName
    result.address = dto.address
    result.gender = dto.gender
    result.dob = dto.dob
    return result;
  }
  public static fromEntity(entity: UserEntity) {
    return this.from({
      password: entity.password,
      email: entity.email,
      fullName: entity.fullName,
      address: entity.address,
      gender: entity.gender,
      dob: entity.dob
    })
  }
  public static toEntity(dto: Partial<UserRegisterDto>) {
    const result = new UserEntity()
    result.password = dto.password
    result.email = dto.email
    result.fullName = dto.fullName
    result.address = dto.address
    result.gender = dto.gender
    result.dob = dto.dob
    return result;
  }
}