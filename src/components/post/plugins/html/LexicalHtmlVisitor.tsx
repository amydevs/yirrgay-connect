import {
  type MdxJsxFlowElement,
  type MdxJsxTextElement,
} from 'mdast-util-mdx-jsx';
import { type LexicalExportVisitor } from '@mdxeditor/editor';
import { $isHtmlNode, type HtmlNode } from './HTMLNode';

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
