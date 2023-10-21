import { MDXEditor, toolbarPlugin, DiffSourceToggleWrapper, ConditionalContents, ChangeCodeMirrorLanguage, UndoRedo, BoldItalicUnderlineToggles, CodeToggle, ListsToggle, BlockTypeSelect, CreateLink, InsertImage, InsertTable, InsertThematicBreak, InsertCodeBlock, listsPlugin, quotePlugin, headingsPlugin, linkPlugin, linkDialogPlugin, imagePlugin, tablePlugin, thematicBreakPlugin, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, markdownShortcutPlugin, directivesPlugin } from "@mdxeditor/editor";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import '@mdxeditor/editor/style.css';
import React from "react";
import styles from '~/styles/editor.module.css';
import { cn } from "~/utils/cn";
import ScratchButton, { ScratchDirectiveDescriptor } from "./directives/scratch";
import { Input } from "../ui/input";

interface EditorProps {
    readOnly?: boolean;
    onChangeTitle?: (title: string) => unknown;
    valueTitle?: string;
    onChangeContent?: (content: string) => unknown;
    valueContent?: string;
    diffContent?: string;
}

const PostEditor = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & EditorProps
>(({
    readOnly = false,
    className,
    onChangeTitle,
    valueTitle,
    onChangeContent,
    valueContent,
    diffContent,
    ...props
}, ref) => {
    const theme = useTheme();

    const [mdxEditorClass, setMdxEditorClass] = useState('');
    
    useEffect(() => {
        setMdxEditorClass((theme.resolvedTheme ?? theme.theme) === 'dark' ? 'dark-theme' : '')
    }, [theme]);

    return (
        <div ref={ref} className={cn('space-y-3 prose-lg dark:prose-invert', className)} {...props}>
            {
                !readOnly ? (
                    <Input 
                        onChange={(evt) => {onChangeTitle?.(evt.target.value)}}
                        placeholder="Enter A Title..."
                        autoFocus
                        className="border-none h-18 focus-visible:ring-transparent ring-inset text-5xl"
                        value={valueTitle}
                    />
                ) : (
                    <h1 className="px-3 mb-0">
                        { valueTitle }
                    </h1>
                )
            }
            
            <MDXEditor
                className={cn(mdxEditorClass, styles.postEditor, readOnly && styles.readOnlyEditor)}
                markdown={valueContent ?? ''}
                onChange={onChangeContent}
                placeholder='Start writing a post...'
                readOnly={readOnly}
                plugins={[
                    toolbarPlugin({
                        toolbarContents: () => (<>
                            <DiffSourceToggleWrapper>
                                <ConditionalContents
                                    options={[
                                        { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
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
                                                <ScratchButton />
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
                    imagePlugin({
                        imageUploadHandler: async (image) => {
                            const result: string = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result as string);
                                reader.onerror = () => reject(reader.error);
                                reader.readAsDataURL(image);
                            });

                            return result;
                        },
                    }),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
                    directivesPlugin({ directiveDescriptors: [ScratchDirectiveDescriptor] }),
                    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: diffContent ?? valueContent }),
                    markdownShortcutPlugin(),
                ]}
                contentEditableClassName="prose-lg dark:prose-invert"
            />
        </div>
    );
});

PostEditor.displayName = 'PostEditor';

export default PostEditor;