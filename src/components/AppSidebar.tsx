"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2Icon,
  Plus,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createPage,
  createWorkspace,
  getAllWorkspaces,
  getPagesByWorkspaceId,
} from "@/lib/query";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import type { Workspaces, Pages } from "@/lib/types/types";
import { useFileState } from "@/context/fileStateProvider";
import { ModeToggle } from "./mode-toggle";
import LogoutBtn from "./logout-btn";

const formSchema = z.object({
  workspaceName: z.string().min(2, {
    message: "Workspace name must be at least 2 characters.",
  }),
});

const createPageSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

export function AppSidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspaces[]>([]);
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>(
    {}
  );
  const [pages, setPages] = useState<Pages[]>([]);
  const [openPagesDialog, setOpenPagesDialog] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { setTitle } = useFileState();
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspaces>(
    {} as Workspaces
  );
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceName: "",
    },
  });

  const createPageForm = useForm<z.infer<typeof createPageSchema>>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
    },
  });

  const fetchWorkspaces = useCallback(async () => {
    setWorkspaceLoading(true);
    try {
      const workspace = await getAllWorkspaces(user?.id as string);
      if (workspace) {
        setWorkspaces(workspace as unknown as Workspaces[]);
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      setWorkspaceLoading(false);
    }
  }, [user?.id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreatingWorkspace(true);
    try {
      const workspace = await createWorkspace({
        name: values.workspaceName,
        userId: user?.id as string,
      });
      if (workspace) {
        router.push(`/dashboard/${workspace[0].id}`);
        await fetchWorkspaces();
        setIsDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
    } finally {
      setIsCreatingWorkspace(false);
    }
  }

  const toggleWorkspace = (workspace: Workspaces) => {
    setSelectedWorkspace(workspace);
    setOpenWorkspaces((prev) => ({
      ...prev,
      [workspace.id]: !prev[workspace.id],
    }));
  };

  const fetchPages = useCallback(async () => {
    if (!selectedWorkspace.id && !params?.workspaceId) return;

    setPagesLoading(true);
    try {
      const workspacePages = await getPagesByWorkspaceId(
        selectedWorkspace.id || (params?.workspaceId as string)
      );
      if (workspacePages) {
        setPages(workspacePages as unknown as Pages[]);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setPagesLoading(false);
    }
  }, [params?.workspaceId, selectedWorkspace.id]);

  const handleCreatePage = async (values: z.infer<typeof createPageSchema>) => {
    setIsCreatingPage(true);
    try {
      const page = await createPage({
        title: values.title,
        content: "",
        inTrash: "false",
        workspaceId: selectedWorkspace?.id as string,
      });
      if (page) {
        setTitle(values.title);
        router.push(`/dashboard/${params?.workspaceId}/${page[0].id}`);
        await fetchPages();
        setOpenPagesDialog(false);
        createPageForm.reset();
      }
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setIsCreatingPage(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (selectedWorkspace.id || params?.workspaceId) {
      fetchPages();
    }
  }, [fetchPages, selectedWorkspace.id, params?.workspaceId]);

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="mb-2 px-4 text-lg font-semibold">Logo</h1>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <SidebarInput
              placeholder="Search..."
              type="search"
              className="pl-8"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      Create Workspace
                      <Plus className="h-4 w-4" />
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Workspace</DialogTitle>
                      <DialogDescription>
                        Create a new workspace for your projects.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="workspaceName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Workspace Name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Workspace" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter a name for your new workspace.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" disabled={isCreatingWorkspace}>
                            {isCreatingWorkspace ? (
                              <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Workspace"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>
              {workspaceLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2Icon className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                workspaces.map((workspace) => (
                  <SidebarMenuItem key={workspace.id}>
                    <SidebarMenuButton
                      onClick={() => toggleWorkspace(workspace)}
                      className="w-full justify-between"
                    >
                      {workspace.name}
                      <motion.div
                        animate={{
                          rotate: openWorkspaces[workspace.id] ? 180 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {openWorkspaces[workspace.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </motion.div>
                    </SidebarMenuButton>
                    <AnimatePresence>
                      {openWorkspaces[workspace.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: {
                              height: { duration: 0.4, ease: "easeInOut" },
                              opacity: { duration: 0.25, delay: 0.15 },
                            },
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                              height: { duration: 0.4, ease: "easeInOut" },
                              opacity: { duration: 0.25 },
                            },
                          }}
                        >
                          <SidebarMenu className="pl-4 pt-1">
                            {pagesLoading ? (
                              <div className="flex items-center justify-center py-2">
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                              </div>
                            ) : (
                              pages.map((page) => (
                                <Link
                                  key={page.id}
                                  href={`/dashboard/${workspace.id}/${page.id}`}
                                  onClick={() => setTitle(page.title)}
                                >
                                  <SidebarMenuButton>
                                    {page.title}
                                  </SidebarMenuButton>
                                </Link>
                              ))
                            )}
                            <SidebarMenuItem>
                              <Dialog
                                open={openPagesDialog}
                                onOpenChange={setOpenPagesDialog}
                              >
                                <DialogTrigger asChild>
                                  <SidebarMenuButton>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Page
                                  </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Create Page</DialogTitle>
                                    <DialogDescription>
                                      Create a new page for your workspace.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Form {...createPageForm}>
                                    <form
                                      onSubmit={createPageForm.handleSubmit(
                                        handleCreatePage
                                      )}
                                      className="space-y-8"
                                    >
                                      <FormField
                                        control={createPageForm.control}
                                        name="title"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Page Title</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="My Page"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormDescription>
                                              Enter a name for your new page.
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <DialogFooter>
                                        <Button
                                          type="submit"
                                          disabled={isCreatingPage}
                                        >
                                          {isCreatingPage ? (
                                            <>
                                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                              Creating...
                                            </>
                                          ) : (
                                            "Create Page"
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full flex items-center justify-end gap-2">
          <LogoutBtn />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
