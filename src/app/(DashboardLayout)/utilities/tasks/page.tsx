// Shadow.tsx
"use client";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/container/PageContainer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks, deleteTask, addOrUpdateTask } from "@/store/tasksSlice";
import { ITask } from "@/interfaces/task.interface";
import TaskTable from "./TaskTable";
import TaskDialog from "./TaskDialog";
import { Button } from "@mui/material";

const Shadow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setOpenDialog(true);
  };

  const handleEditTask = (task: ITask) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask(taskId));
    dispatch(fetchTasks());
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleSaveTask = (task: ITask) => {
    dispatch(addOrUpdateTask(task));
    dispatch(fetchTasks());
  };

  return (
    <PageContainer title="Tasks" description="List of tasks">
      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p>Error: {error}</p>} */}
      <Button onClick={handleAddTask}>Add Task</Button>
      <TaskTable tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
      <TaskDialog open={openDialog} task={selectedTask} onClose={handleDialogClose} onSave={handleSaveTask} />
    </PageContainer>
  );
};

export default Shadow;
