import type { LexicalExportVisitor } from '@mdxeditor/editor';
import type { HtmlNode } from './HTMLNode';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import { $isHtmlNode } from './HTMLNode';

export const LexicalHtmlVisitor: LexicalExportVisitor<
  HtmlNode,
  MdxJsxFlowElement | MdxJsxTextElement
> = {
  testLexicalNode: $isHtmlNode,
  visitLexicalNode({ actions, mdastParent, lexicalNode }) {
    const mdastNode = lexicalNode.getMdastNode();
    actions.registerReferredComponent(mdastNode.type);
    actions.appendToParent(mdastParent, mdastNode);
  },
};
