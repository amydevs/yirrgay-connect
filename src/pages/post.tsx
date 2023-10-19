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
    codeBlockPlugin,
    codeMirrorPlugin,

    markdownShortcutPlugin,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    CodeToggle,
    CreateLink,
    InsertCodeBlock,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    Separator,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    tablePlugin,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
} from '@mdxeditor/editor';
import { useTheme } from "next-themes";
import { getServerAuthSession } from "~/server/auth";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    return {
        props: { session },
    };
};

const Post = () => {
    const session = useSession();
    const router = useRouter();
    const theme = useTheme();

    const [mdxEditorClass, setMdxEditorClass] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        setMdxEditorClass((theme.resolvedTheme ?? theme.theme) === 'dark' ? 'dark-theme' : '')
    }, [theme]);

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session]);

    useEffect(() => {
        return;
    }, [markdownContent])

    return (
        <div className="w-full pt-16 h-screen">
            <div className="max-w-6xl mx-auto p-6 border-l border-r h-full">
                <MDXEditor
                    className={mdxEditorClass}
                    markdown={markdownContent}
                    onChange={setMarkdownContent}
                    placeholder='Start writing...'
                    plugins={[
                        toolbarPlugin({
                            toolbarContents: () => (<>
                                <DiffSourceToggleWrapper>
                                    <ConditionalContents
                                        options={[
                                        { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                                        // { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                                        {
                                            fallback: () => (
                                            <>
                                                <UndoRedo />
                                                <Separator />
                                                <BoldItalicUnderlineToggles />
                                                <CodeToggle />
                                                <Separator />
                                                <ListsToggle />
                                                <Separator />

                                                {/* <ConditionalContents
                                                options={[{ when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> }, { fallback: () => <BlockTypeSelect /> }]}
                                                /> */}

                                                <Separator />

                                                <CreateLink />
                                                <InsertImage />

                                                <Separator />

                                                <InsertTable />
                                                <InsertThematicBreak />

                                                <Separator />
                                                <InsertCodeBlock />
                                                {/* <InsertSandpack /> */}

                                                {/* <ConditionalContents
                                                options={[
                                                    {
                                                    when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                                                    contents: () => (
                                                        <>
                                                        <Separator />
                                                        <InsertAdmonition />
                                                        </>
                                                    )
                                                    }
                                                ]}
                                                /> */}

                                                <Separator />
                                            </>
                                            )
                                        }
                                        ]}
                                    />
                                    </DiffSourceToggleWrapper>
                            </>)
                        }),
                        listsPlugin(),
                        quotePlugin(),
                        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
                        linkPlugin(),
                        linkDialogPlugin(),
                        imagePlugin(),
                        tablePlugin(),
                        thematicBreakPlugin(),
                        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
                        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
                        markdownShortcutPlugin(),
                    ]}
                    contentEditableClassName="prose dark:prose-invert"
                />
            </div>
        </div>
    );
}

export default Post;