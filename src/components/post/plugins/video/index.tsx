import { realmPlugin, system, coreSystem } from '@mdxeditor/editor';
import { VideoDialog } from './VideoDialog';

export type VideoUploadHandler = ((image: File) => Promise<string>) | null;

// export interface InsertVideoFormValues {
//   src?: string
//   title?: string
//   file: FileList
// }

type InactiveVideoDialogState = {
  type: 'inactive';
};

type NewVideoDialogState = {
  type: 'new';
};

/** @internal */
export const videoSystem = system(
  (r, []) => {
    // const insertVideo = r.node<InsertVideoFormValues>()
    // const videoUploadHandler = r.node<VideoUploadHandler>(null)
    const videoDialogState = r.node<
      InactiveVideoDialogState | NewVideoDialogState
    >({ type: 'inactive' });
    const openNewVideoDialog = r.node<true>();
    const closeVideoDialog = r.node<true>();

    r.link(
      r.pipe(closeVideoDialog, r.o.mapTo({ type: 'inactive' })),
      videoDialogState,
    );
    r.link(
      r.pipe(openNewVideoDialog, r.o.mapTo({ type: 'new' })),
      videoDialogState,
    );

    return {
      videoDialogState,
      openNewVideoDialog,
      closeVideoDialog,
    };
  },
  [coreSystem],
);

export const [videoPlugin, videoPluginHooks] = realmPlugin({
  id: 'video',
  systemSpec: videoSystem,
  init: (realm) => {
    realm.pubKey('addComposerChild', VideoDialog);
  },
});
