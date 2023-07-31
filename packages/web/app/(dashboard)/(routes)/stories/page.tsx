"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formPromptSchema } from "./constants";

import { Api } from "sst/node/api";

const ConversationPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [story, setStory] = useState<string>("");
  const { userId } = useAuth();

  const form = useForm<z.infer<typeof formPromptSchema>>({
    resolver: zodResolver(formPromptSchema),
    defaultValues: {
      name: "",
      theme: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formPromptSchema>) => {
    try {
      const name = values.name;
      const theme = values.theme;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/story`,
        {
          userId,
          name,
          theme,
        }
      );
      setStory(response.data.body);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Create a new bedtime story"
        description="A new bedtime story every night powered by AI."
        icon={MessageSquare}
        iconColor="text-gray-500"
        bgColor="bg-gray-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-10
                gap-2
              "
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Name</FormLabel>
                    <FormControl className="m-0 p-0">
                      <Input
                        className="pl-2"
                        disabled={isLoading}
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="theme"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Theme</FormLabel>
                    <FormControl className="m-0 p-0">
                      <Input
                        className="pl-2"
                        disabled={isLoading}
                        placeholder="i.e. funny, scary, romantic, etc."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-10  w-full"
                type="submit"
                variant="premium"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {story.length === 0 && !isLoading && (
            <Empty label="No story yet..." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            <div
              key={story}
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10 bg-muted"
              )}
            >
              <BotAvatar />
              <p className="text-sm first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 first-line:uppercase first-line:tracking-widest">
                {story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
