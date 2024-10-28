import React, { SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, InputLabel } from "@mui/material";
import { ITask, Priority, Status } from "@/interfaces/task.interface";
import { fetchUsers } from "@/store/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface TaskDialogProps {
  open: boolean;
  task?: ITask | null;
  onClose: () => void;
  onSave: (task: any) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose, onSave }) => {
    const { users, loading, error } = useAppSelector((state) => state.users);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(Priority.low);
  const [dueDate, setDueDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");  
  const priorities = Object.keys(Priority);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate((task.dueDate || "") as SetStateAction<string>);
        setSelectedUser((task.assignedTo || "") as SetStateAction<string>);
      } else {
        // Reset fields when adding a new task
        setTitle("");
        setDescription("");
        setPriority(Priority.low);
        setDueDate("");
        setSelectedUser("");
      }
    }
  }, [open, task]);

  const handleSave = () => {
    const updatedTask = { ...task, title, priority, description, dueDate, assignedTo: selectedUser };
    onSave(updatedTask);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Add Task"}</DialogTitle>
      <DialogContent>
        <InputLabel>
          Title
        </InputLabel>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="dense"
        />
        <InputLabel>
          Description
        </InputLabel>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="dense"
        />
        <InputLabel>
          Priority
        </InputLabel>
        <TextField
          select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          fullWidth
          margin="dense"
        >
          {priorities.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        <InputLabel>Assign to User</InputLabel>
        <TextField
          select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          fullWidth
          margin="dense"
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.name || user.email}
            </MenuItem>
          ))}
        </TextField>
        <InputLabel>
          Due Date
        </InputLabel>
        <TextField
          type="date"
          value={dueDate ? dueDate.toString().split("T")[0] : ""}
          onChange={(e) => setDueDate(new Date(e.target.value))}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
