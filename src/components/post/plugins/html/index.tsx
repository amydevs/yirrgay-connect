import {
  type JsxComponentDescriptor,
  realmPlugin,
  system,
  coreSystem,
} from '@mdxeditor/editor';
import { MdastHtmlVisitor } from './MdastHtmlVisitor';
import { $createHtmlNode, HtmlNode } from './HTMLNode';
import { LexicalHtmlVisitor } from './LexicalHtmlVisitor';

const contentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'html',
    kind: 'text',
    hasChildren: false,
    props: [],
    Editor: () => {
      return <></>;
    },
  },
];

interface InsertHtmlPayload {
  value: string;
}

/** @internal */
export const htmlSystem = system(
  (r, [{ insertDecoratorNode }]) => {
    const insertHtml = r.node<InsertHtmlPayload>();

    r.link(
      r.pipe(
        insertHtml,
        r.o.map(({ value }) => {
          return () =>
            $createHtmlNode({
              type: 'html',
              value,
            });
        }),
      ),
      insertDecoratorNode,
    );

    return {
      insertHtml,
    };
  },
  [coreSystem],
);

export const [htmlPlugin, htmlPluginHooks] = realmPlugin({
  id: 'html',
  systemSpec: htmlSystem,
  applyParamsToSystem: (realm) => {
    realm.pubKey('jsxComponentDescriptors', contentDescriptors);
  },
  init: (realm) => {
    // import
    realm.pubKey('addImportVisitor', MdastHtmlVisitor);

    // export
    realm.pubKey('addLexicalNode', HtmlNode);
    realm.pubKey('addExportVisitor', LexicalHtmlVisitor);
  },
});
