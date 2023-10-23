import { type NodeKey } from "@mdxeditor/editor";
import { type HTML } from 'mdast';
import { DecoratorNode, type LexicalNode } from 'lexical';

export class HtmlNode extends DecoratorNode<JSX.Element> {
    __mdastNode: HTML;
  
    static getType(): string {
      return 'html';
    }
  
    static clone(node: HtmlNode): HtmlNode {
        return new HtmlNode(node.__mdastNode);
    }
  
    constructor(mdastNode: HTML, key?: NodeKey) {
        super(key);
        this.__mdastNode = mdastNode;
    }

    getMdastNode(): HTML {
        return this.__mdastNode;
    }
  
    createDOM(): HTMLElement {
      return document.createElement('span');
    }
  
    updateDOM(): false {
      return false;
    }
  
    decorate(): JSX.Element {
      return <span dangerouslySetInnerHTML={({__html: this.__mdastNode.value})} />;
    }
}
  
export function $createHtmlNode(mdastNode: HTML): HtmlNode {
    return new HtmlNode(mdastNode);
}

export function $isHtmlNode(node: LexicalNode | null | undefined): node is HtmlNode {
    return node instanceof HtmlNode;
}