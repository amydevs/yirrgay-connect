import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import PostEditor from "~/components/post/editor";

const PostNew = () => {
    const session = useSession();
    const router = useRouter();

    const ctx = api.useContext();
    const postsCreate = api.posts.create.useMutation({
        onSuccess: async (post) => {
            await Promise.all([
                router.push(`/post/${post.id}`),
                ctx.posts.getAll.invalidate()
            ])
        }
    });

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            void router.push('/');
        }
    }, [session, router]);

    const submit = () => {
        if (title.length === 0 || content.length === 0) {
            alert("Title and Content are required");
            return;
        }
        postsCreate.mutate({
            title,
            content,
        });
    };

    return (
        <div className="w-full pt-16 min-h-screen grid">
            <div className="max-w-6xl w-full mx-auto border-l border-r self-stretch flex flex-col justify-between pt-6">
                <PostEditor
                    className="max-w-[99.5vw]"
                    onChangeTitle={setTitle}
                    valueTitle={title}
                    onChangeContent={setContent}
                    valueContent={content}
                />
                <div className="border-t p-6 text-right space-x-3">
                    <Button onClick={submit}>Submit</Button>
                </div>
            </div>
        </div>
    );
}

export default PostNew;