"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { deploymentSchema } from "@ctrlplane/db/schema";
import { Button } from "@ctrlplane/ui/button";
import { CopyButton } from "@ctrlplane/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ctrlplane/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
  useForm,
} from "@ctrlplane/ui/form";
import { Input } from "@ctrlplane/ui/input";
import { Textarea } from "@ctrlplane/ui/textarea";

import { api } from "~/trpc/react";

const deploymentForm = z.object(deploymentSchema.shape);

export const EditDeploymentDialog: React.FC<{
  children: React.ReactNode;
  systemId: string;
  id: string;
  name: string;
  slug: string;
  description: string;
}> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  const updateDeployment = api.deployment.update.useMutation();
  const router = useRouter();

  const form = useForm({
    schema: deploymentForm,
    defaultValues: { ...props },
    mode: "onSubmit",
  });

  const { handleSubmit, setError } = form;

  const onSubmit = handleSubmit((data) => {
    updateDeployment
      .mutateAsync({ id: props.id, data })
      .then(() => {
        setOpen(false);
        router.refresh();
      })
      .catch(() => {
        setError("root", {
          message: "Deployment with this slug already exists",
        });
      });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <DialogHeader>
              <DialogTitle>Edit Deployment</DialogTitle>
              <DialogDescription>
                Edit the details of your deployment.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Website, Identity Service..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retryCount"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Retry Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => onChange(e.target.valueAsNumber)}
                      min={0}
                      step={1}
                      className="w-16"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="id"
              render={() => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <Input
                    value={props.id}
                    readOnly
                    className="bg-gray-800 text-gray-100"
                  />
                </FormItem>
              )}
            />
            <FormRootError />
            <DialogFooter>
              <CopyButton textToCopy={props.id} />
              <div className="flex-grow" />
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isDirty
                }
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
