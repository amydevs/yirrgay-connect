import type { Prisma } from '@prisma/client';
import React from 'react';
import Link from 'next/link';
import PostIteractionPanel from './interaction-panel';
import UserAvatar from '../avatar';
import { Card, CardHeader, CardTitle, CardFooter } from '../ui/card';

interface PostCardProps {
  post: Prisma.PostGetPayload<{
    include: {
      user: true;
      likes: true;
    };
  }>;
}

const PostCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PostCardProps
>(({ className, post, ...props }, ref) => {
  return (
    <Card ref={ref} className={className} {...props}>
      <CardHeader className="space-y-6">
        <UserAvatar user={post.user} createdAt={post.createdAt} />
        <Link href={`/post/${post.id}`}>
          <CardTitle>{post.title}</CardTitle>
        </Link>
      </CardHeader>
      <CardFooter>
        <PostIteractionPanel className="w-full" post={post} />
      </CardFooter>
    </Card>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
