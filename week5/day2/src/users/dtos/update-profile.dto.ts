import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
}
