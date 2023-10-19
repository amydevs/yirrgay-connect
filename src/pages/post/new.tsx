import type { GetServerSideProps } from "next";
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
    BlockTypeSelect,
} from '@mdxeditor/editor';
import { useTheme } from "next-themes";
import { getServerAuthSession } from "~/server/auth";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const PostNew = () => {
    const session = useSession();
    const router = useRouter();
    const theme = useTheme();

    const ctx = api.useContext();
    const postsCreate = api.posts.create.useMutation({
        onSuccess: async (post) => {
            await Promise.all([
                router.push(`/post/${post.id}`),
                ctx.posts.getAll.invalidate()
            ])
        }
    });

    const [mdxEditorClass, setMdxEditorClass] = useState('');
    const [title, setTitle] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        setMdxEditorClass((theme.resolvedTheme ?? theme.theme) === 'dark' ? 'dark-theme' : '')
    }, [theme]);

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            void router.push('/');
        }
    }, [session, router]);

    const submit = () => {
        postsCreate.mutate({
            title,
            content: markdownContent,
        });
    };

    return (
        <div className="w-full pt-16 h-screen">
            <div className="max-w-6xl mx-auto border-l border-r h-full flex flex-col justify-between py-6">
                <div className="space-y-3">
                    <Input 
                        onChange={(evt) => setTitle(evt.target.value)}
                        placeholder="Enter A Title..."
                        autoFocus
                        className="prose-invert border-none focus-visible:ring-transparent text-4xl"
                    />
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

                                                        <BlockTypeSelect />

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
                            headingsPlugin(),
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
                <div className="border-t px-6 pt-6 text-right">
                    <Button onClick={submit}>Submit</Button>
                </div>
            </div>
        </div>
    );
}

export default PostNew;