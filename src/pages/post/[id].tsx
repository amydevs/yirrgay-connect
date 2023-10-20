import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { type GetServerSidePropsContext } from "next";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import PostEditor from "~/components/post/editor";
import PostAvatar from "~/components/post/avatar";


export function getServerSideProps({ params }: GetServerSidePropsContext<{ id: string }>) {
    const id = params?.id;
    return {
        props: {
            id
        }
    }
}

const PostContent = () => {
    const router = useRouter();
    const session = useSession();

    const id = router.query.id as string;

    const postGet = api.posts.getById.useQuery({ id });
    
    const post = postGet.data;

    const [title, setTitle] = useState(post?.title ?? '');
    const [content, setContent] = useState(post?.content ?? '');
    const [isEditing, setIsEditing] = useState(false);

    const ctx = api.useContext();
    const postsUpdate = api.posts.update.useMutation({
        onSuccess: () => setIsEditing(false)
    });
    const postsDelete = api.posts.delete.useMutation({
        onSuccess: async () => {
            await router.push('/');
            await ctx.posts.invalidate();
        }
    })

    const updatePost = () => {
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
        <div className="w-full pt-16 min-h-screen grid">
            <div className="max-w-6xl w-full mx-auto border-l border-r self-stretch flex flex-col justify-between py-6">
                <div className="space-y-6">
                    <PostAvatar className="mx-3" post={post ?? undefined} />
                    <PostEditor
                        readOnly={!isEditing}
                        onChangeTitle={setTitle}
                        valueTitle={title}
                        onChangeContent={setContent}
                        valueContent={content}
                    />
                </div>
                <div className="border-t px-6 pt-6 text-right space-x-3">
                    { !isEditing ? 
                        <>
                            { 
                                postGet.data?.userId === session.data?.user.id ? <>
                                    <Button variant='destructive' onClick={deletePost}>Delete</Button>
                                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                </> : <></> 
                            }
                        </>
                    : 
                        <>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={updatePost}>Submit</Button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostContent;