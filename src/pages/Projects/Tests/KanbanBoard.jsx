import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "../../../components/ui/badge";
import { updateTestStatus } from "../../../redux/slices/projectSlice";
import TestKanbanCard from "./TestKanbanCard";

// Droppable Column Component
function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex-1 bg-gray-50 rounded-lg p-3 min-h-[500px] border-2 border-dashed border-gray-200 transition-colors">
      {children}
    </div>
  );
}

function KanbanBoard({ tests, projectId, onTestClick }) {
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: "Up Next", title: "Up Next", color: "bg-blue-500" },
    { id: "In Progress", title: "In Progress", color: "bg-yellow-500" },
    { id: "Ready to analyze", title: "Ready to Analyze", color: "bg-green-500" },
  ];

  // Debug: Log all test statuses and full test objects
  console.log('All test statuses:', tests?.map(t => ({ name: t.name, status: t.status })));
  console.log('Full test objects:', JSON.parse(JSON.stringify(tests)));

  const getTestsByStatus = (status) => {
    // Case-insensitive comparison
    return tests?.filter((test) => test.status?.toLowerCase() === status.toLowerCase()) || [];
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTest = tests.find((t) => t._id === active.id);

    // Find which column the item was dropped into
    let newStatus = over.id;

    // If dropped on another card, find the parent column
    const droppedOnTest = tests.find((t) => t._id === over.id);
    if (droppedOnTest) {
      newStatus = droppedOnTest.status;
    }

    // Check if the newStatus is a valid column ID
    const validStatuses = columns.map(col => col.id);
    if (!validStatuses.includes(newStatus)) {
      console.error('Invalid status:', newStatus, 'Valid statuses:', validStatuses);
      setActiveId(null);
      return;
    }

    console.log('Drag end - Active test:', activeTest?.name, 'Current status:', activeTest?.status, 'New status:', newStatus);

    if (activeTest && activeTest.status?.toLowerCase() !== newStatus.toLowerCase()) {
      console.log('Updating test status to:', newStatus);
      dispatch(updateTestStatus({
        testId: activeTest._id,
        status: newStatus,
        projectId
      }));
    } else {
      console.log('Status unchanged, no update needed');
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTest = tests?.find((t) => t._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTests = getTestsByStatus(column.id);

          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h3 className="font-semibold text-sm text-gray-900">{column.title}</h3>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {columnTests.length}
                  </Badge>
                </div>
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className={`h-full ${column.color} rounded-full transition-all`} style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Droppable Column */}
              <DroppableColumn id={column.id}>
                <SortableContext
                  items={columnTests.map((t) => t._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnTests.map((test) => (
                      <TestKanbanCard
                        key={test._id}
                        test={test}
                        onClick={() => onTestClick(test)}
                      />
                    ))}
                    {columnTests.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No tests in {column.title.toLowerCase()}
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTest ? (
          <div className="opacity-50">
            <TestKanbanCard test={activeTest} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
