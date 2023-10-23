import React from 'react';
import { TooltipWrap, corePluginHooks } from '@mdxeditor/editor';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { Button } from '~/components/ui/button';
import { audioPluginHooks } from '../audio';

/**
 * A toolbar button that allows the user to insert an image from an URL.
 * For the button to work, you need to have the `imagePlugin` plugin enabled.
 */
export const InsertAudio = React.forwardRef<
  HTMLButtonElement,
  Record<string, never>
>((_, forwardedRef) => {
  const openNewImageDialog =
    audioPluginHooks.usePublisher('openNewAudioDialog');
  const [readOnly] = corePluginHooks.useEmitterValues('readOnly');

  return (
    <Button
      variant="ghost"
      className="h-10 w-8"
      ref={forwardedRef}
      disabled={readOnly}
      onClick={() => openNewImageDialog(true)}
    >
      <TooltipWrap title="Insert audio">
        <SpeakerLoudIcon className="h-5 w-5" />
      </TooltipWrap>
    </Button>
  );
});

InsertAudio.displayName = 'InsertAudio';
