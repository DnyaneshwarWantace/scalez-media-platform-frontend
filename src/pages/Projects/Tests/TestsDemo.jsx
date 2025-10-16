import React from "react";
import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import MoveToLearningDialog from "./MoveToLearningDialog";
import { useNavigate, useParams } from "react-router-dom";
import AvatarGroup from "../../../components/common/AvatarGroup";
import { useEffect } from "react";
import { getAllTests, selecttests, updateTestStatus } from "../../../redux/slices/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../../../components/SortableItem';
import { v4 as uuidv4 } from "uuid";
import { backendServerBaseURL } from "../../../utils/backendServerBaseURL";

const itemsFromBackend = [
  { id: uuidv4(), content: "First task" },
  { id: uuidv4(), content: "Second task" },
  { id: uuidv4(), content: "Third task" },
  { id: uuidv4(), content: "Fourth task" },
  { id: uuidv4(), content: "Fifth task" },
];

const columnsFromBackend = {
  [uuidv4()]: {
    name: "Requested",
    items: itemsFromBackend,
  },
  [uuidv4()]: {
    name: "To do",
    items: [],
  },
  [uuidv4()]: {
    name: "In Progress",
    items: [],
  },
  [uuidv4()]: {
    name: "Done",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function TestsDemo() {
  const allTests = useSelector(selecttests);
  const [tasksList, settasksList] = useState([{ _id: 1, name: 1 }]);
  const [tasksList2, settasksList2] = useState([]);
  const [tasksList3, settasksList3] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const projectId = params.projectId;
  const ideaId = params.ideaId;
  const [columns, setColumns] = useState(columnsFromBackend);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      Object.entries(columns).forEach(([columnId, column]) => {
        const oldIndex = column.items.findIndex(item => item.id === active.id);
        const newIndex = column.items.findIndex(item => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(column.items, oldIndex, newIndex);
          setColumns(prev => ({
            ...prev,
            [columnId]: {
              ...column,
              items: newItems
            }
          }));
        }
      });
    }
  }
  const me = JSON.parse(localStorage.getItem("user", ""));

  useEffect(() => {
    dispatch(getAllTests({ projectId }));
  }, []);

  useEffect(() => {
    settasksList(allTests.filter((test) => test.status === "Up Next"));
    settasksList2(allTests.filter((test) => test.status === "In Progress"));
    // settasksList3(allTests.filter((test) => test.status === "Ready to analyze"));
  }, [allTests]);

  const updateTestStatuses = (list, status) => {
    if (list) {
      console.log(list);
      list.map((test) => {
        dispatch(updateTestStatus({ projectId, testId: test._id, status: status }));
      });
    }
  };

  const TaskCard = (test) => {
    return (
      <div key={`${test._id}`} className="vstack gap-3 border rounded mb-2 p-3 ">
        <h1>AAA</h1>
      </div>
    );
    return (
      <div key={`${test._id}`} className="vstack gap-3 border rounded mb-2 p-3 noselect">
        <div className="d-flex justify-content-between">
          <p className="mb-0 blue-chip">{test.lever}</p>
          <p className="m-0 green-chip">{test.score}</p>
        </div>

        <div className="d-flex justify-content-between">
          <p className="m-0">{test.name}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="m-0">
            <span>
              <img src="/static/icons/u_check-square.svg" alt="" style={{ position: "relative", top: "-1px" }} />
            </span>{" "}
            {test.tasks.filter((task) => task.status === true).length}/{test.tasks.length}
          </p>
          <p className="m-0">Jul 13 - Jul 16</p>
        </div>
        <div className="d-flex justify-content-between">
          <div className="hstack gap-3">
            <img src={`${backendServerBaseURL}/${me.avatar}`} className="avatar2" alt="" />
            <AvatarGroup listOfUrls={["https://www.fillmurray.com/50/50", "https://www.fillmurray.com/50/50"]} show={3} total={5} />
          </div>

          <div className="hstack gap-2">
            <p className="m-0">0</p>
            <i class="bi bi-chat"></i>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex">
        <div>
          <h1 className="mb-1 ">Project Name 1</h1>
          <p className="text-secondary">1 Test</p>
        </div>

        <div className="flex-fill d-flex flex-row-reverse"></div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <SortableContext items={column.items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <div
                      style={{
                        background: "lightgrey",
                        padding: 4,
                        width: 250,
                        minHeight: 500,
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <SortableItem key={item.id} id={item.id}>
                            <div
                              style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                minHeight: "50px",
                                backgroundColor: "#456C86",
                                color: "white",
                              }}
                            >
                              {item.content}
                            </div>
                          </SortableItem>
                        );
                      })}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </DndContext>
      </div>

      <MoveToLearningDialog />
      <button
        className="btn btn-success"
        onClick={() => {
          navigate("/projects/a/tests/a");
        }}
      >
        Open Test
      </button>
    </div>
  );
}

export default TestsDemo;
