import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { corePluginHooks } from '@mdxeditor/editor';
import { File } from '@web-std/file';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Dialog } from '~/components/ui/dialog';
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '~/components/ui/dialog';
import { audioPluginHooks } from '.';
import { htmlPluginHooks } from '../html';

const formSchema = z.object({
  file: z.instanceof(File).optional(),
  src: z.string().optional(),
  title: z.string().optional(),
});

export const AudioDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      src: '',
      title: '',
    },
  });
  const [editorRootElementRef] = corePluginHooks.useEmitterValues(
    'editorRootElementRef',
  );
  const [state] = audioPluginHooks.useEmitterValues('audioDialogState');
  const insertHtml = htmlPluginHooks.usePublisher('insertHtml');
  const closeAudioDialog = audioPluginHooks.usePublisher('closeAudioDialog');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = values.file;
    const src = values.src;
    const title = values.title;

    let vidSrc = '';

    if (file != null) {
      const result: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(values.file!);
      });
      vidSrc = result;
    } else if (src != null) {
      vidSrc = src;
    }
    insertHtml({
      value: `<audio ${
        title != null ? `title="${title}"` : ''
      } src="${vidSrc}" controls />`,
    });
    closeAudioDialog(true);
  };

  return (
    <Dialog
      open={state.type !== 'inactive'}
      onOpenChange={(open) => {
        if (!open) {
          closeAudioDialog(true);
          form.reset({ src: '', title: '' });
        }
      }}
    >
      <DialogPortal container={editorRootElementRef?.current}>
        <DialogOverlay />
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={(evt) => void form.handleSubmit(onSubmit)(evt)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload an audio from your device:</FormLabel>
                    <FormControl>
                      <Input
                        accept="audio/*"
                        {...field}
                        value={
                          (value as unknown as { fileName: string })?.fileName
                        }
                        type="file"
                        placeholder="Browse..."
                        onChange={(evt) => {
                          onChange(evt.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="src"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or add an audio from an URL:</FormLabel>
                    <FormControl>
                      <Input placeholder="Audio URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title:</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
