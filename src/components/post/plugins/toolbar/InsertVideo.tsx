import React from 'react';
import { TooltipWrap, corePluginHooks } from '@mdxeditor/editor';
import { VideoIcon } from '@radix-ui/react-icons';
import { videoPluginHooks } from '../video';
import { Button } from '~/components/ui/button';

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
    <Button
      variant='ghost'
      className='h-10 w-8'
      ref={forwardedRef}
      disabled={readOnly}
      onClick={() => openNewImageDialog(true)}
    >
      <TooltipWrap title="Insert video">
        <VideoIcon className="h-5 w-5" />
      </TooltipWrap>
    </Button>
  );
});

InsertVideo.displayName = 'InsertVideo';
