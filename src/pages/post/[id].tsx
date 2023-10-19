import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import PostEditor from "~/components/editor";
import { GetServerSidePropsContext } from "next";

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

    const [title, setTitle] = useState(postGet.data?.title ?? '');
    const [content, setContent] = useState(postGet.data?.content ?? '');
    const [isEditing, setIsEditing] = useState(false);

    const postsUpdate = api.posts.update.useMutation({
        onSuccess: () => setIsEditing(false)
    });

    const submit = () => {
        postsUpdate.mutate({
            id,
            title,
            content,
        });
    };

    return (
        <div className="w-full pt-16 min-h-screen grid">
            <div className="max-w-6xl w-full mx-auto border-l border-r self-stretch flex flex-col justify-between py-6">
                <PostEditor
                    readOnly={!isEditing}
                    onChangeTitle={setTitle}
                    valueTitle={title}
                    onChangeContent={setContent}
                    valueContent={content}
                />
                <div className="border-t px-6 pt-6 text-right space-x-3">
                    { !isEditing ? 
                        <>
                            { 
                                postGet.data?.userId === session.data?.user.id ? <>
                                    <Button variant='destructive' onClick={() => setIsEditing(true)}>Delete</Button>
                                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                </> : <></> 
                            }
                        </>
                    : 
                        <>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={submit}>Submit</Button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostContent;