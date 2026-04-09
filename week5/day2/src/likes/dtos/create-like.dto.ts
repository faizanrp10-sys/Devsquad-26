import { IsMongoId } from 'class-validator';

export class CreateLikeDto {
  @IsMongoId()
  commentId: string;
}
