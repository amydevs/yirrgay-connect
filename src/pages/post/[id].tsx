import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
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

    return (
        <div className="w-full pt-16 min-h-screen grid">
            <div className="max-w-6xl w-full mx-auto border-l border-r self-stretch flex flex-col justify-between py-6">
                <PostEditor
                    readOnly
                    onChangeTitle={setTitle}
                    valueTitle={title}
                    onChangeContent={setContent}
                    valueContent={content}
                />
                <div className="border-t px-6 pt-6 text-right">
                    { postGet.data?.userId === session.data?.user.id ? <Button>Submit</Button> : <></> }
                </div>
            </div>
        </div>
    );
}

export default PostContent;