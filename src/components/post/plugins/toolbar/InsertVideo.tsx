import React from 'react';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import { TooltipWrap, corePluginHooks } from '@mdxeditor/editor';
import { VideoIcon } from '@radix-ui/react-icons';
import { videoPluginHooks } from '../video';

/**
 * A toolbar button that allows the user to insert an image from an URL.
 * For the button to work, you need to have the `imagePlugin` plugin enabled.
 */
export const InsertVideo = React.forwardRef<
  HTMLButtonElement,
  Record<string, never>
>((_, forwardedRef) => {
  const openNewImageDialog =
    videoPluginHooks.usePublisher('openNewVideoDialog');
  const [readOnly] = corePluginHooks.useEmitterValues('readOnly');

  return (
    <RadixToolbar.Button
      ref={forwardedRef}
      disabled={readOnly}
      onClick={() => openNewImageDialog(true)}
    >
      <TooltipWrap title="Insert video">
        <VideoIcon className="h-4 w-4" />
      </TooltipWrap>
    </RadixToolbar.Button>
  );
});

InsertVideo.displayName = 'InsertVideo';
