import React, { useEffect, useState } from "react";
import CompareModelDialog from "./CompareModelDialog";
import CreateNewModelDialog from "./CreateNewModelDialog";
import DeleteModelDialog from "./DeleteModelDialog";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteModel, getAllModels, selectmodels, updateModels, updateselectedModel, updateShowDeleteModelDialog, updateShowCreateModelDialog } from "../../redux/slices/modelSlice";
import { formatTime } from "../../utils/formatTime";
import { backendServerBaseURL } from "../../utils/backendServerBaseURL";
import { isTypeOwner, isRoleAdmin, isRoleMember, hasPermission_add_models } from "../../utils/permissions";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreVertical, Plus, Search } from "lucide-react";


function Models() {
  const models = useSelector(selectmodels);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true); // Loading state flag
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter models based on search term
  const filteredModels = models?.filter((model) =>
    model.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  useEffect(() => {
    dispatch(getAllModels());
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Models</h1>
          <p className="text-sm text-gray-500">
            {models?.length === 1 ? `${models?.length} Model` : `${models?.length} Models`}
          </p>
        </div>

        <div className="flex-1 flex flex-row-reverse">
          <div className="flex items-center gap-2 sm:gap-3">
            {hasPermission_add_models() && (
              <Button
                onClick={() => {
                  dispatch(updateselectedModel(null));
                  dispatch(updateShowCreateModelDialog(true));
                }}
                className="bg-black hover:bg-gray-800 text-white min-w-[10rem]"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Model
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex-1 sm:flex-none mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full sm:w-64 h-10 sm:h-10 text-sm sm:text-base bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Empty State */}
      {models?.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center mt-5">
          <div className="text-center space-y-4">
            <img
              src="/static/illustrations/no-projects-found.svg"
              alt=""
              className="h-48 mx-auto"
            />
            <h2 className="text-lg font-medium">No models created yet</h2>
            {hasPermission_add_models() && (
              <Button
                onClick={() => {
                  dispatch(updateselectedModel(null));
                  dispatch(updateShowCreateModelDialog(true));
                }}
                className="bg-black hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create My First Model
              </Button>
            )}
          </div>
        </div>
      )
      : (filteredModels?.length !== 0 ? (
        <>
          {/* Models Table */}
          <Card className="mt-4">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Created</TableHead>
                    <TableHead className="font-medium">Owner</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModels.map((model) => (
                    <TableRow
                      key={model._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        navigate(`/models/${model._id}`);
                      }}
                    >
                      <TableCell className="font-medium py-3">
                        {model.name}
                      </TableCell>
                      <TableCell className="py-3">
                        {formatTime(model.createdAt)}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={`${backendServerBaseURL}/${model.creator.avatar}`}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <span>
                            {model.creator.firstName} {model.creator.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                navigate(`/models/${model._id}`);
                              }}
                            >
                              View Model
                            </DropdownMenuItem>
                            {hasPermission_add_models() && (
                              <DropdownMenuItem
                                onClick={() => {
                                  dispatch(updateselectedModel(model));
                                  dispatch(updateShowDeleteModelDialog(true));
                                }}
                              >
                                Delete Model
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )
      : searchTerm ? (
        /* No models found for search */
        <div className="flex items-center justify-center mt-5">
          <div className="text-center space-y-4">
            <img
              src="/static/illustrations/no-projects-found.svg"
              alt=""
              className="h-48 mx-auto"
            />
            <h2 className="text-lg font-medium">No models found</h2>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        </div>
      ) : (
        /* Skeleton Loader */
        <Card className="mt-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Name</TableHead>
                  <TableHead className="font-medium">Created</TableHead>
                  <TableHead className="font-medium">Owner</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(8)].map((_, index) => (
                  <TableRow key={index} className="skeleton-placeholder">
                    <TableCell className="py-3">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
      )}

        <CreateNewModelDialog />
        <DeleteModelDialog />
        <CompareModelDialog />
      </div>
    </div>
  );
}

export default Models;
