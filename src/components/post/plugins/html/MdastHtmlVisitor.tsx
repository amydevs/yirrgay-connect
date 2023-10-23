import { type ElementNode } from 'lexical'
import { type HTML } from 'mdast'
import { type MdastImportVisitor } from '@mdxeditor/editor';
import { $createHtmlNode } from './HTMLNode';


export const MdastHtmlVisitor: MdastImportVisitor<HTML> = {
    testNode: 'html',
    visitNode({ lexicalParent, mdastNode }) {
        console.log(mdastNode)
        ;(lexicalParent as ElementNode).append($createHtmlNode(mdastNode))
    }
}