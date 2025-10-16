import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import {
  editpointer,
  readPointer,
  selectsinglePointerInfo,
  getAllActionPlans,
} from "../../redux/slices/actionPlanSlice";
import { hasPermission_create_actionPlans } from "../../utils/permissions";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ArrowLeft, Edit, Save, X } from "lucide-react";

function ViewPointer() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contentId = params.contentId;
  const singlePointerInfo = useSelector(selectsinglePointerInfo);
  const [value, setvalue] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    dispatch(
      readPointer({
        pointerId: contentId,
      })
    );
    dispatch(getAllActionPlans());
  }, [readPointer]);

  useEffect(() => {
    if (singlePointerInfo?.data) {
      setEditedContent(singlePointerInfo.data);
    }
  }, [singlePointerInfo]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(singlePointerInfo?.data || "");
  };

  const handleSave = () => {
    dispatch(
      editpointer({
        pointerId: contentId,
        data: editedContent,
      })
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(singlePointerInfo?.data || "");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-muted">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/action-plans")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All Action Plans
            </Button>
          </div>
          
          {hasPermission_create_actionPlans() && (
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Content
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {singlePointerInfo?.name || "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <SunEditor
                    setContents={editedContent}
                    onChange={setEditedContent}
                    setOptions={{
                      height: 400,
                      buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image', 'video'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['preview', 'print'],
                        ['save']
                      ],
                      placeholder: "Start writing your content here...",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="prose prose-gray max-w-none dark:prose-invert">
                {singlePointerInfo?.data ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlePointerInfo.data,
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      No content available for this pointer.
                    </p>
                    {hasPermission_create_actionPlans() && (
                      <Button
                        variant="outline"
                        onClick={handleEdit}
                        className="mt-4"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Add Content
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ViewPointer;
