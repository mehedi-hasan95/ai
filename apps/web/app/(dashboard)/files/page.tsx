"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import { FileIcon, MoreHorizontal, PlusIcon, Trash } from "lucide-react";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { UploadDialog } from "./_components/upload-dialog";
import { useState } from "react";
import { PublicFile } from "@workspace/backend/private/files";
import { DeleteFileDialog } from "./_components/delete-file-dialog";

const Page = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  );

  const {
    canLoadMore,
    handleLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
    topElementRef,
  } = useInfiniteScroll({
    loadMore: files.loadMore,
    loadSize: 10,
    status: files.status,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };
  const handelFileDelete = () => {
    setSelectedFile(null);
  };
  return (
    <>
      <DeleteFileDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        file={selectedFile}
        onDelete={handelFileDelete}
      />
      <UploadDialog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      />
      <div className="flex flex-col min-h-screen bg-muted p-8">
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Upload and manage documents for your AI assistant
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-lg border bg-background">
          <div className="flex items-center justify-end border-b px-6 py-4">
            <Button onClick={() => setUploadDialogOpen(true)}>
              <PlusIcon />
              Add New
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                <TableHead className="px-6 py-4 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                if (isLoadingFirstPage) {
                  return (
                    <TableRow>
                      <TableCell className="h-24 px-6" colSpan={4}>
                        Loading files...
                      </TableCell>
                    </TableRow>
                  );
                }

                if (files.results.length === 0) {
                  return (
                    <TableRow>
                      <TableCell className="h-24 px-6 text-center" colSpan={4}>
                        No file found
                      </TableCell>
                    </TableRow>
                  );
                }
                return files.results.map((file) => (
                  <TableRow key={file.id} className="hover:bg-muted/50">
                    <TableCell className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <FileIcon />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">
                      <Badge className="uppercase" variant={"outline"}>
                        {file.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">
                      {file.size}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="size-8 p-0"
                            size={"sm"}
                            variant={"ghost"}
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => handleDeleteClick(file)}
                          >
                            <Trash className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
          {!isLoadingFirstPage && files.results.length > 0 && (
            <div className="border-t">
              <InfiniteScrollTrigger
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                ref={topElementRef}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
