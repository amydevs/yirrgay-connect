import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import '@mdxeditor/editor/style.css';
import { api } from "~/utils/api";
import PostEditor from "~/components/editor";

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

    const id = router.query.id as string;

    const postGet = api.posts.getById.useQuery({ id });

    const [title, setTitle] = useState(postGet.data?.title ?? '');
    const [content, setContent] = useState(postGet.data?.content ?? '');

    return (
        <div className="w-full pt-16 h-screen">
            <div className="max-w-6xl mx-auto border-l border-r h-full flex flex-col justify-between py-6">
                <PostEditor
                    readOnly
                    onChangeTitle={setTitle}
                    valueTitle={title}
                    onChangeContent={setContent}
                    valueContent={content}
                />
                <div className="border-t px-6 pt-6 text-right">
                </div>
            </div>
        </div>
    );
}

export default PostContent;