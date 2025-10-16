import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateNewCategoryDialog from "./CreateNewCategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
// import { ReactSortable } from "react-sortablejs";
import {
  getAllActionPlans,
  selectActionPlans,
  updateSelectedActionPlan,
  updateselectedCategory,
  updateselectedPointer,
  getExternalActionPlans,
  selectExternalActionPlans,
  markActionPlan,
  markCategory,
  markPointer,
  editActionPlan,
  updateIsOpenedForDoc,
  updateIsOpenedForCategory,
  updateIsOpenedForPointer,
  updatesinglePointerInfo,
  updateActionPlans,
} from "../../redux/slices/actionPlanSlice";
import CreateNewActionPlanDialog from "./CreateNewActionPlanDialog";
import CreateNewPointerDialog from "./CreateNewPointerDialog";
import DeleteActionPlanDialog from "./DeleteActionPlanDialog";
import DeletePointerDialog from "./DeletePointerDialog";
import ManageActionPlanAccessDialog from "./ManageActionPlanAccessDialog";
import { hasPermission_create_actionPlans } from "../../utils/permissions";
import { set } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  CheckCircle,
  Circle,
  Search
} from "lucide-react";
import { Progress } from "../../components/ui/progress";
import "./ActionPlan.css";

function ActionPlan() {
  const [selectedMenu, setselectedMenu] = useState("Internal");
  const actionPlans = useSelector(selectActionPlans);
  const extActionPlans = useSelector(selectExternalActionPlans);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ProjectsMenus = [
    {
      name: "Internal",
    },
    {
      name: "External",
    },
  ];

  const RightProjectsMenus = [];

  let internalActionPlanSortData = Object.assign(actionPlans);
  let externalActionPlanSortData = Object.assign(extActionPlans);

  const [allActionPlans, setallActionPlans] = useState([
    internalActionPlanSortData,
  ]);
  console.log("allActionPlans :>> ", allActionPlans);

  const [allExtActionPlans, setallExtActionPlans] = useState([
    externalActionPlanSortData,
  ]);

  useEffect(() => {
    dispatch(getAllActionPlans());
    dispatch(getExternalActionPlans());
  }, [selectedMenu]);

  useEffect(() => {
    setallActionPlans(
      actionPlans.map((plan) => {
        let tempPlan = {
          ...plan,
        };
        tempPlan.category = tempPlan.category.map((cat) => {
          let tempcat = {
            ...cat,
          };
          tempcat.content = tempcat.content.map((content) => {
            return {
              ...content,
            };
          });
          return tempcat;
        });
        return tempPlan;
      })
    );
  }, [actionPlans]);

  useEffect(() => {
    setallExtActionPlans(
      extActionPlans.map((plan) => {
        let tempPlan = { ...plan };
        tempPlan.category = tempPlan.category.map((cat) => {
          let tempcat = { ...cat };
          tempcat.content = tempcat.content.map((cat) => {
            return { ...cat };
          });
          return tempcat;
        });
        return tempPlan;
      })
    );
  }, [extActionPlans]);

  const setIsOpenedForDoc = (id, isOpened) => {
    let temp = allActionPlans.map((plan) => {
      if (plan._id === id) {
        plan.isOpened = isOpened;

        dispatch(
          updateIsOpenedForDoc({
            name: plan.name,
            isOpened: isOpened,
            actionPlanId: id,
          })
        );
      }
      return plan;
    });
    setallActionPlans(temp);
  };

  const filterNan = (value) => {
    return isNaN(value) ? 0 : value;
  };
  const setIsOpenedForCategory = (id, isOpened) => {
    let temp = allActionPlans.map((plan) => {
      plan.category = plan.category.map((cat) => {
        if (cat._id === id) {
          cat.isOpened = isOpened;

          dispatch(
            updateIsOpenedForCategory({
              name: cat.name,
              isOpened: isOpened,
              categoryId: id,
            })
          );
        }
        return cat;
      });
      return plan;
    });
    setallActionPlans(temp);
  };

  const setIsOpenedForContent = (id, isOpened) => {
    let temp = allActionPlans.map((plan) => {
      plan.category = plan.category.map((cat) => {
        cat.content = cat.content.map((content) => {
          if (content._id === id) {
            content.isOpened = isOpened;

            dispatch(
              updateIsOpenedForPointer({
                name: content.name,
                isOpened: isOpened,
                data: content.data,
                pointerId: id,
              })
            );
          }
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallActionPlans(temp);
  };

  const setAllIsOpenedToTrue = () => {
    let temp = allActionPlans.map((plan) => {
      plan.isOpened = true;
      plan.category = plan.category.map((cat) => {
        cat.isOpened = true;
        cat.content = cat.content.map((content) => {
          content.isOpened = true;
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallActionPlans(temp);
  };

  const setAllIsOpenedToFalse = () => {
    let temp = allActionPlans.map((plan) => {
      plan.isOpened = false;
      plan.category = plan.category.map((cat) => {
        cat.isOpened = false;
        cat.content = cat.content.map((content) => {
          content.isOpened = false;
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallActionPlans(temp);
  };

  const external_setIsOpenedForDoc = (id, isOpened) => {
    let temp = allExtActionPlans.map((plan) => {
      if (plan._id === id) {
        plan.isOpened = isOpened;

        dispatch(
          updateIsOpenedForDoc({
            name: plan.name,
            isOpened: isOpened,
            actionPlanId: id,
          })
        );
      }
      return plan;
    });
    setallExtActionPlans(temp);
  };

  const external_setIsOpenedForCategory = (id, isOpened) => {
    let temp = allExtActionPlans.map((plan) => {
      plan.category = plan.category.map((cat) => {
        if (cat._id === id) {
          cat.isOpened = isOpened;

          dispatch(
            updateIsOpenedForCategory({
              name: cat.name,
              isOpened: isOpened,
              categoryId: id,
            })
          );
        }
        return cat;
      });
      return plan;
    });
    setallExtActionPlans(temp);
  };

  const external_setIsOpenedForContent = (id, isOpened) => {
    let temp = allExtActionPlans.map((plan) => {
      plan.category = plan.category.map((cat) => {
        cat.content = cat.content.map((content) => {
          if (content._id === id) {
            content.isOpened = isOpened;

            dispatch(
              updateIsOpenedForPointer({
                name: content.name,
                isOpened: isOpened,
                data: content.data,
                pointerId: id,
              })
            );
          }
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallExtActionPlans(temp);
  };

  const external_setAllIsOpenedToTrue = () => {
    let temp = allExtActionPlans.map((plan) => {
      plan.isOpened = true;
      plan.category = plan.category.map((cat) => {
        cat.isOpened = true;
        cat.content = cat.content.map((content) => {
          content.isOpened = true;
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallExtActionPlans(temp);
  };

  const external_setAllIsOpenedToFalse = () => {
    let temp = allExtActionPlans.map((plan) => {
      plan.isOpened = false;
      plan.category = plan.category.map((cat) => {
        cat.isOpened = false;
        cat.content = cat.content.map((content) => {
          content.isOpened = false;
          return content;
        });
        return cat;
      });
      return plan;
    });
    setallExtActionPlans(temp);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-muted">
        <div className="container mx-auto py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
              <h1 className="text-lg sm:text-3xl font-medium sm:font-semibold text-foreground">Action Plans</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Organize, track, and execute your workflows with structured action plans. 
                Break down complex projects into manageable tasks and categories.
              </p>
          </div>

            <div className="flex gap-3">
              {selectedMenu === "Internal" && (
                <Button
                    onClick={() => {
                      dispatch(updateSelectedActionPlan(null));
                    // Trigger the dialog to open
                    const event = new CustomEvent('openActionPlanDialog');
                    window.dispatchEvent(event);
                  }}
                  disabled={!hasPermission_create_actionPlans()}
                  className="font-medium bg-black hover:bg-black/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Action Plan
                </Button>
              )}
          </div>
        </div>

          {/* Tabs Navigation */}
          <div className="border-b border-border mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {ProjectsMenus.map((menu, index) => (
                  <button
                  key={index}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      selectedMenu === menu.name
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => {
                    setselectedMenu(menu.name);
                  }}
                >
                    {menu.name}
                    {selectedMenu === menu.name && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
                  </div>

              <div className="flex items-center">
                {RightProjectsMenus.map((menu, index) => (
                  <button
                  key={index}
                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                      selectedMenu === menu.name
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => {
                    setselectedMenu(menu.name);
                  }}
                >
                    {menu.name}
                    {selectedMenu === menu.name && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
                  </div>
          </div>
        </div>

          {/* Empty State */}
          {actionPlans.length === 0 && selectedMenu === "Internal" && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="/static/illustrations/no-projects-found.svg"
                    alt="No action plans"
                    className="h-48"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">Start Your First Action Plan</h2>
                  <p className="text-gray-600 max-w-md">
                    Create structured workflows to organize your projects, track progress, and collaborate with your team. 
                    Action plans help you break down complex tasks into manageable steps.
                  </p>
                  {selectedMenu === "Internal" && hasPermission_create_actionPlans() && (
                    <Button
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => {
                      dispatch(updateSelectedActionPlan(null));
                        // Trigger the dialog to open
                        const event = new CustomEvent('openActionPlanDialog');
                        window.dispatchEvent(event);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Action Plan
                    </Button>
              )}
            </div>
              </CardContent>
            </Card>
        )}

          {/* Action Plans List */}
        {selectedMenu == "Internal" && actionPlans.length !== 0 && (
            <div className="space-y-4">
              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
              onClick={() => {
                setAllIsOpenedToFalse();
              }}
            >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Collapse All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
              onClick={() => {
                setAllIsOpenedToTrue();
              }}
            >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
              </div>

              {/* Action Plans */}
              <div className="space-y-3">
                  {allActionPlans &&
                    allActionPlans?.length > 0 &&
                    allActionPlans?.map((item, index) => {
                      const progress = filterNan(
                                        (
                                          (item?.category
                                            ?.map((cat) => {
                                              return (
                                cat.content?.filter((d) => d.checked)?.length +
                                                (cat.checked ? 1 : 0)
                                              );
                                            })
                                            .reduce((acc, v) => acc + v, 0) /
                                            item?.category
                                              ?.map((cat) => {
                                                return cat.content?.length + 1;
                                              })
                                              .reduce((acc, v) => acc + v, 0)) *
                                          100
                                        ).toFixed(0) || 0
                      );

                      return (
                        <Card key={`actionplan_${index}`}>
                          <Collapsible
                            open={item.isOpened}
                            onOpenChange={(isOpen) => {
                              setIsOpenedForDoc(item._id, isOpen);
                            }}
                          >
                            <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                              <div className="flex items-center gap-3 flex-1">
                                <Checkbox
                                  checked={item.checked}
                                  onCheckedChange={(checked) => {
                                              dispatch(
                                      markActionPlan({
                                        checked,
                                        actionPlanId: item._id,
                                      })
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />

                                <CollapsibleTrigger asChild>
                                  <button className="flex items-center gap-2 flex-1 text-left">
                                    {item.isOpened ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-semibold text-foreground">{item.name}</span>
                                  </button>
                                </CollapsibleTrigger>
                              </div>

                              {hasPermission_create_actionPlans() && (
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {progress}%
                                    </span>
                                    <Progress value={progress} className="w-20 h-2" />
                                  </div>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          // Trigger the dialog to open
                                          const event = new CustomEvent('openActionPlanDialog');
                                          window.dispatchEvent(event);
                                          dispatch(updateSelectedActionPlan(item));
                                            }}
                                          >
                                            Edit Action Plan
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                            onClick={() => {
                                          // Trigger the dialog to open
                                          const event = new CustomEvent('openManageAccessDialog');
                                          window.dispatchEvent(event);
                                          dispatch(updateSelectedActionPlan(item));
                                            }}
                                          >
                                            Manage Access
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive"
                                            onClick={() => {
                                          // Trigger the dialog to open
                                          const event = new CustomEvent('openDeleteActionPlanDialog');
                                          window.dispatchEvent(event);
                                          dispatch(updateSelectedActionPlan(item));
                                            }}
                                          >
                                            Delete Action Plan
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  </div>
                                )}
                        </div>

                            <CollapsibleContent>
                              <div className="border-t border-border px-4 py-2 bg-accent/30">
                                {item?.category?.map((singleCategory, catIndex) => {
                                  const categoryProgress = filterNan(
                                    (
                                      ((singleCategory?.content?.filter(
                                        (item) => item.checked
                                      ).length +
                                        (singleCategory.checked ? 1 : 0)) /
                                        (singleCategory?.content?.length + 1)) *
                                      100
                                    ).toFixed(0) || 0
                                  );

                                  return (
                                    <Collapsible
                              key={`cat_${singleCategory._id}`}
                                      open={singleCategory.isOpened}
                                      onOpenChange={(isOpen) => {
                                        setIsOpenedForCategory(singleCategory._id, isOpen);
                                      }}
                                      className="border-b border-border last:border-0"
                                    >
                                      <div className="flex items-center justify-between py-3 hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                          <Checkbox
                                            checked={singleCategory.checked}
                                            onCheckedChange={(checked) => {
                                                  dispatch(
                                                    markCategory({
                                                  checked,
                                                  categoryId: singleCategory._id,
                                                    })
                                                  );
                                                }}
                                            onClick={(e) => e.stopPropagation()}
                                          />

                                          <CollapsibleTrigger asChild>
                                            <button className="flex items-center gap-2 flex-1 text-left">
                                              {singleCategory.isOpened ? (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                              )}
                                              <Folder className="h-4 w-4 text-muted-foreground" />
                                              <span className="font-medium text-foreground">{singleCategory.name}</span>
                                            </button>
                                          </CollapsibleTrigger>
                                        </div>

                                        {hasPermission_create_actionPlans() && (
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-medium text-muted-foreground">
                                                {categoryProgress}%
                                              </span>
                                              <Progress value={categoryProgress} className="w-16 h-2" />
                                            </div>

                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                  <MoreVertical className="h-4 w-4" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                          onClick={() => {
                                                    // Trigger the dialog to open
                                                    const event = new CustomEvent('openCategoryDialog');
                                                    window.dispatchEvent(event);
                                                    dispatch(updateSelectedActionPlan(item));
                                                    dispatch(updateselectedCategory(singleCategory));
                                                          }}
                                                        >
                                                          Edit Category
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                  className="text-destructive"
                                                          onClick={() => {
                                                    // Trigger the dialog to open
                                                    const event = new CustomEvent('openDeleteCategoryDialog');
                                                    window.dispatchEvent(event);
                                                    dispatch(updateSelectedActionPlan(item));
                                                    dispatch(updateselectedCategory(singleCategory));
                                                          }}
                                                        >
                                                          Delete Category
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                                  </div>
                                              )}
                                        </div>

                                      <CollapsibleContent>
                                        <div className="pl-8 space-y-2 py-2">
                                          {singleCategory.content.map((singleContent) => (
                                            <div
                                              key={`content_${singleContent._id}`}
                                              className="flex items-center justify-between py-2 px-3 hover:bg-accent/50 rounded-md transition-colors cursor-pointer group"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                dispatch(updatesinglePointerInfo(singleContent));
                                                localStorage.setItem("selected-content-name", singleContent.name);
                                                navigate(`/action-plans/${item._id}/${singleCategory._id}/${singleContent._id}/view`);
                                              }}
                                            >
                                              <div className="flex items-center gap-3 flex-1">
                                                <Checkbox
                                                  checked={singleContent.checked}
                                                  onCheckedChange={(checked) => {
                                                    dispatch(markPointer({
                                                      checked,
                                                      contentId: singleContent._id,
                                                    }));
                                                  }}
                                                  onClick={(e) => e.stopPropagation()}
                                                />
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium text-foreground">{singleContent.name}</span>
                                              </div>

                                              {hasPermission_create_actionPlans() && (
                                                <DropdownMenu>
                                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                      <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                        // Trigger the dialog to open
                                                        const event = new CustomEvent('openPointerDialog');
                                                        window.dispatchEvent(event);
                                                        dispatch(updateSelectedActionPlan(item));
                                                        dispatch(updateselectedCategory(singleCategory));
                                                        dispatch(updateselectedPointer(singleContent));
                                                      }}
                                                    >
                                                      Edit Pointer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                          onClick={(e) => {
                                                                e.stopPropagation();
                                                        dispatch(updatesinglePointerInfo(singleContent));
                                                        localStorage.setItem("selected-content-name", singleContent.name);
                                                        navigate(`/action-plans/${item._id}/${singleCategory._id}/${singleContent._id}`);
                                                      }}
                                                    >
                                                      Edit Data
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                      className="text-destructive"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                        // Trigger the dialog to open
                                                        const event = new CustomEvent('openDeletePointerDialog');
                                                        window.dispatchEvent(event);
                                                        dispatch(updateSelectedActionPlan(item));
                                                        dispatch(updateselectedCategory(singleCategory));
                                                        dispatch(updateselectedPointer(singleContent));
                                                                      }}
                                                                    >
                                                                      Delete
                                                    </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                                </DropdownMenu>
                                              )}
                                                    </div>
                                          ))}

                                          {hasPermission_create_actionPlans() && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start text-primary hover:text-primary hover:bg-primary/10 mt-2"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                // Trigger the dialog to open
                                                const event = new CustomEvent('openPointerDialog');
                                                window.dispatchEvent(event);
                                                dispatch(updateSelectedActionPlan(item));
                                                dispatch(updateselectedCategory(singleCategory));
                                              }}
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Add Pointer
                                            </Button>
                                      )}
                                    </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  );
                                })}

                                {hasPermission_create_actionPlans() && (
                                  <Button
                                    variant="outline"
                                    className="w-full mt-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Trigger the dialog to open
                                      const event = new CustomEvent('openCategoryDialog');
                                      window.dispatchEvent(event);
                                  dispatch(updateSelectedActionPlan(item));
                                  dispatch(updateselectedCategory(null));
                                }}
                              >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Category
                                  </Button>
                                )}
                      </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      );
                    })}
                </div>
              </div>
        )}

        {/* External Plan  */}
          {selectedMenu === "External" && extActionPlans.length === 0 && (
            <Card>
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
              <img
                src="/static/illustrations/no-projects-found.svg"
                    alt="No external plans"
                    className="h-48"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">No External Action Plans</h2>
                  <p className="text-gray-600 max-w-md">
                    External action plans are shared with you by other team members. 
                    When someone shares an action plan with you, it will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
        )}

        {selectedMenu == "External" && extActionPlans.length !== 0 && (
            <div className="space-y-4">
              {/* Control Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
              onClick={() => {
                external_setAllIsOpenedToFalse();
              }}
            >
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Collapse All
                </Button>

                <Button
                  variant="outline"
                  size="sm"
              onClick={() => {
                external_setAllIsOpenedToTrue();
              }}
            >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Expand All
                </Button>
              </div>

              {/* External Action Plans */}
              <div className="space-y-3">
                {allExtActionPlans?.map((item, index) => {
                const progress = filterNan(
                              (
                                (item?.category
                                  ?.map((cat) => {
                                    return (
                          cat.content?.filter((d) => d.checked)?.length +
                          (cat.checked ? 1 : 0)
                                    );
                                  })
                                  .reduce((acc, v) => acc + v, 0) /
                                  item?.category
                                    ?.map((cat) => {
                                      return cat.content?.length + 1;
                                    })
                                    .reduce((acc, v) => acc + v, 0)) *
                                100
                              ).toFixed(0) || 0
                );

                return (
                  <Card key={`external_plan_${index}`}>
                    <Collapsible
                      open={item.isOpened}
                      onOpenChange={(isOpen) => {
                        external_setIsOpenedForDoc(item._id, isOpen);
                      }}
                    >
                      <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={(checked) => {
                                                  dispatch(
                                markActionPlan({
                                  checked,
                                  actionPlanId: item._id,
                                                    })
                                                  );
                                                }}
                            onClick={(e) => e.stopPropagation()}
                          />

                          <CollapsibleTrigger asChild>
                            <button className="flex items-center gap-2 flex-1 text-left">
                              {item.isOpened ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold text-foreground">{item.name}</span>
                            </button>
                          </CollapsibleTrigger>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {progress}%
                                              </span>
                          <Progress value={progress} className="w-20 h-2" />
                        </div>
                                            </div>

                      <CollapsibleContent>
                        <div className="border-t border-border px-4 py-2 bg-accent/30">
                          {item?.category?.map((singleCategory, catIndex) => {
                            const categoryProgress = filterNan(
                                                    (
                                                      ((singleCategory?.content?.filter(
                                                        (item) => item.checked
                                                      ).length +
                                  (singleCategory.checked ? 1 : 0)) /
                                  (singleCategory?.content?.length + 1)) *
                                                      100
                                                    ).toFixed(0) || 0
                            );

                            return (
                              <Collapsible
                                key={`external_cat_${singleCategory._id}`}
                                open={singleCategory.isOpened}
                                onOpenChange={(isOpen) => {
                                  external_setIsOpenedForCategory(singleCategory._id, isOpen);
                                }}
                                className="border-b border-border last:border-0"
                              >
                                <div className="flex items-center justify-between py-3 hover:bg-accent/50 transition-colors">
                                  <div className="flex items-center gap-3 flex-1">
                                    <Checkbox
                                      checked={singleCategory.checked}
                                      onCheckedChange={(checked) => {
                                                            dispatch(
                                          markCategory({
                                            checked,
                                            categoryId: singleCategory._id,
                                                              })
                                                            );
                                                          }}
                                      onClick={(e) => e.stopPropagation()}
                                    />

                                    <CollapsibleTrigger asChild>
                                      <button className="flex items-center gap-2 flex-1 text-left">
                                        {singleCategory.isOpened ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <Folder className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">{singleCategory.name}</span>
                                      </button>
                                    </CollapsibleTrigger>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      {categoryProgress}%
                                                        </span>
                                    <Progress value={categoryProgress} className="w-16 h-2" />
                                  </div>
                                </div>

                                <CollapsibleContent>
                                  <div className="pl-8 space-y-2 py-2">
                                    {singleCategory.content.map((singleContent) => (
                                      <div
                                        key={`external_content_${singleContent._id}`}
                                        className="flex items-center justify-between py-2 px-3 hover:bg-accent/50 rounded-md transition-colors cursor-pointer"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      e.preventDefault();
                                          dispatch(updatesinglePointerInfo(singleContent));
                                          localStorage.setItem("selected-content-name", singleContent.name);
                                          navigate(`/action-plans/${item._id}/${singleCategory._id}/${singleContent._id}/view`);
                                        }}
                                      >
                                        <div className="flex items-center gap-3 flex-1">
                                          <Checkbox
                                            checked={singleContent.checked}
                                            onCheckedChange={(checked) => {
                                              dispatch(markPointer({
                                                checked,
                                                contentId: singleContent._id,
                                              }));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <FileText className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm font-medium text-foreground">{singleContent.name}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                );
              })}
              </div>
            </div>
        )}
        </div>
      </div>

      <CreateNewActionPlanDialog />
      <ManageActionPlanAccessDialog />
      <DeleteActionPlanDialog />

      <CreateNewCategoryDialog />
      <DeleteCategoryDialog />

      <CreateNewPointerDialog />
      <DeletePointerDialog />
    </>
  );
}

export default ActionPlan;
