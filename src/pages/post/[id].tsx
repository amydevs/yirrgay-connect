import type { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { api } from '~/utils/api';
import PostEditor from '~/components/post/editor';
import UserAvatar from '~/components/avatar';
import { cn } from '~/utils/cn';
import PostIteractionPanel from '~/components/post/interaction-panel';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import CommentForm from '~/components/comments/form';

export function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ id: string }>) {
  const id = params?.id;
  return {
    props: {
      id,
    },
  };
}

const PostContent = () => {
  const router = useRouter();
  const session = useSession();

  const id = router.query.id as string;

  const postGet = api.posts.getById.useQuery({ id });

  const post = postGet.data;

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [editContentBackup, setEditContentBackup] = useState<string | null>(null);
  const isEditing = editContentBackup != null;

  const ctx = api.useContext();
  const postsUpdate = api.posts.update.useMutation({
    onSuccess: () => setEditContentBackup(null),
  });
  const postsDelete = api.posts.delete.useMutation({
    onSuccess: async () => {
      await router.push('/');
      await ctx.posts.invalidate();
    },
  });

  const updatePost = () => {
    if (title.length === 0 || content.length === 0) {
      alert('Title and Content are required');
      return;
    }
    postsUpdate.mutate({
      id,
      title,
      content,
    });
  };
  const deletePost = () => {
    postsDelete.mutate({
      id,
    });
  };

  return (
    <>
      <div className="w-full pt-16 min-h-screen grid">
        <div className="max-w-6xl w-full mx-auto border-x self-stretch flex flex-col justify-between pt-6">
          <div className="space-y-6 max-w-[99.5vw]">
            {post != null ? (
              <UserAvatar
                className="mx-3"
                user={post.user}
                createdAt={post.createdAt}
              />
            ) : (
              <></>
            )}
            <PostEditor
              readOnly={!isEditing}
              onChangeTitle={setTitle}
              valueTitle={title}
              onChangeContent={setContent}
              valueContent={content}
            />
          </div>
          <div
            className={cn(
              'border-y p-6 space-x-3 bg-background flex justify-end',
              !isEditing && 'sticky bottom-0',
            )}
          >
            {!isEditing ? (
              <>
                {post != null ? (
                  <PostIteractionPanel className="w-full" post={post} />
                ) : (
                  <></>
                )}
                {postGet.data?.userId === session.data?.user.id ? (
                  <>
                    <Button variant="destructive" onClick={deletePost}>
                      Delete
                    </Button>
                    <Button onClick={() => setEditContentBackup(content)}>Edit</Button>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <Button onClick={() => {
                  setContent(editContentBackup);
                  setEditContentBackup(null);
                }}>Cancel</Button>
                <Button onClick={updatePost}>Submit</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="max-w-6xl w-full mx-auto border-x p-6 space-y-3"
        id="comments"
      >
        <div>Comments</div>
        {post != null &&
        session.data != null &&
        session.data.user.role !== 'Viewer' ? (
          <Card>
            <CardHeader className="flex flex-1 items-start">
              <UserAvatar user={session.data.user} createdAt={new Date()} />
            </CardHeader>
            <CardContent>
              <CommentForm postId={post.id} />
            </CardContent>
          </Card>
        ) : (
          <></>
        )}
        {post?.comments.length !== 0 ? (
          <></>
        ) : (
          <div className="text-center">No comments yet...</div>
        )}
        {post?.comments.map((comment, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-1 items-start">
              <UserAvatar user={comment.user} createdAt={comment.createdAt} />
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        )) ?? <></>}
      </div>
    </>
  );
};

export default PostContent;
