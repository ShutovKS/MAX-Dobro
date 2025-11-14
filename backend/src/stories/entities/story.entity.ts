import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublicUserEntity } from '../../users/entities/public-user.entity';
import { CommentEntity } from './comment.entity';

class StoryEventInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
}

export class StoryEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => PublicUserEntity })
  author: PublicUserEntity;

  @ApiProperty({ type: () => StoryEventInfo })
  event: StoryEventInfo;

  @ApiProperty({ type: [CommentEntity] })
  comments: CommentEntity[];

  @ApiProperty({ description: 'Number of likes' })
  likesCount: number;

  @ApiProperty({ description: 'Number of comments' })
  commentsCount: number;

  @ApiPropertyOptional({
    description: 'Indicates if the current user has liked this story',
  })
  isLiked?: boolean;
}