import { realmPlugin, system, coreSystem } from '@mdxeditor/editor';
import { AudioDialog } from './AudioDialog';

export type AudioUploadHandler = ((image: File) => Promise<string>) | null;

// export interface InsertAudioFormValues {
//   src?: string
//   title?: string
//   file: FileList
// }

type InactiveAudioDialogState = {
  type: 'inactive';
};

type NewAudioDialogState = {
  type: 'new';
};

/** @internal */
export const audioSystem = system(
  (r, []) => {
    // const insertAudio = r.node<InsertAudioFormValues>()
    // const audioUploadHandler = r.node<AudioUploadHandler>(null)
    const audioDialogState = r.node<
      InactiveAudioDialogState | NewAudioDialogState
    >({ type: 'inactive' });
    const openNewAudioDialog = r.node<true>();
    const closeAudioDialog = r.node<true>();

    r.link(
      r.pipe(closeAudioDialog, r.o.mapTo({ type: 'inactive' })),
      audioDialogState,
    );
    r.link(
      r.pipe(openNewAudioDialog, r.o.mapTo({ type: 'new' })),
      audioDialogState,
    );

    return {
      audioDialogState,
      openNewAudioDialog,
      closeAudioDialog,
    };
  },
  [coreSystem],
);

export const [audioPlugin, audioPluginHooks] = realmPlugin({
  id: 'audio',
  systemSpec: audioSystem,
  init: (realm) => {
    realm.pubKey('addComposerChild', AudioDialog);
  },
});
