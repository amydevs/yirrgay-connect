import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import '@mdxeditor/editor/style.css';
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
} from '@mdxeditor/editor';
import { useTheme } from "next-themes";

const Post = () => {
    const session = useSession();
    const router = useRouter();
    const theme = useTheme();

    const [mdxEditorClass, setMdxEditorClass] = useState('');

    useEffect(() => {
        setMdxEditorClass((theme.resolvedTheme ?? theme.theme) === 'dark' ? 'dark-theme' : '')
    }, [theme]);

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session]);

    return (
        <div className="w-full mt-16">
            <div className="max-w-3xl mx-auto p-6">
                <div className="inline">

                </div>
                <MDXEditor
                    className={mdxEditorClass}
                    markdown='# Hello world'
                    plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        quotePlugin(),
                        thematicBreakPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => ( <> <UndoRedo /><BoldItalicUnderlineToggles /></>)
                        })
                    ]}
                    contentEditableClassName="prose dark:prose-invert"
                />
            </div>
        </div>
    );
}

export default Post;