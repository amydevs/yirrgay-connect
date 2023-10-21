import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form"
import { Textarea } from "../ui/textarea"
import { api } from "~/utils/api"

const formSchema = z.object({
    postId: z.string(),
    content: z.string().min(1, 'Comment content is required'),
});
 
const CommentForm = ({
    postId
}: {
    postId: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postId
    },
  })

  const ctx = api.useContext();
  const commentCreate = api.comments.create.useMutation({
    onSuccess: async () => {
        form.reset();
        await ctx.posts.getById.invalidate({ id: postId });
    }
  });
 
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    commentCreate.mutate(values);
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Textarea placeholder="Start writing a comment..." {...field} />
                        </FormControl>
                        <FormMessage className="text-right" />
                    </FormItem>
                )}
            />
            <div className="text-right">
                <Button type="submit">Comment</Button>
            </div>
        </form>
    </Form>
  )
}

export default CommentForm;