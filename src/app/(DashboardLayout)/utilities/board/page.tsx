'use client';
import { FC, useEffect, useState } from 'react';
import { OnDragEndNotification, Card, moveCard, KanbanBoard } from '@caldwell619/react-kanban';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks } from '@/store/tasksSlice';
import { v4 as uuid } from 'uuid';

// Import necessary types and data
import { board as initialBoard, CustomCard, TicketType } from '@/data';
import { ITask, Status } from '@/interfaces/task.interface';
import { renderCard } from './components/renderCard';

const ControlledBoard = dynamic(() => import('@caldwell619/react-kanban').then((mod) => mod.ControlledBoard), {
  ssr: false,
});

// Map each status to a column title
const statusToColumnTitle = {
  [Status.pending]: Status.pending,
  [Status.in_progress]: Status.in_progress,
  [Status.completed]: Status.completed,
  [Status.archived]: Status.archived,
};

const TypographyPage: FC = () => {
  const [controlledBoard, setBoard] = useState<KanbanBoard<CustomCard>>({ ...initialBoard });
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (tasks) {
      const newBoard = convertTasksToBoard(tasks);
      setBoard(newBoard);
    }
  }, [tasks]);

  const convertTasksToBoard = (tasks: ITask[]): KanbanBoard<CustomCard> => {
    // Initialize columns based on each status in `Status` enum
    const columns = Object.values(Status)?.map(status => ({
      id: uuid(),
      title: statusToColumnTitle[status],
      cards: [] as CustomCard[],
    }));

    const columnMap = columns.reduce((acc, column) => {
      acc[column.title] = column;
      return acc;
    }, {} as Record<string, typeof columns[0]>);

    tasks?.forEach(task => {
      const card: CustomCard = {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate),
        assigneeId: task.assignedTo?._id,
        assignee: task.assignedTo,
        storyPoints: Math.floor(Math.random() * 10) + 1,
        ticketType: TicketType.Feature,  // Default type or derive as needed
        createdAt: new Date(task.createdAt),
      };

      const column = columnMap[statusToColumnTitle[task.status]];
      if (column) {
        column.cards.push(card);
      }
    });

    return { columns };
  };

  const handleCardMove: OnDragEndNotification<CustomCard> = async (_card, source, destination) => {
    if (!destination) return;
  
    // Find the destination column title and map it to the corresponding status
    const toStatusTitle = controlledBoard.columns.find((board) => board.id === destination.toColumnId)?.title;
    const toStatus = Object.keys(statusToColumnTitle).find(
      (key) => statusToColumnTitle[key as Status] === toStatusTitle
    ) as Status;
  
    if (!toStatus) return;
  
    // Optimistically update the UI by moving the card
    setBoard((currentBoard) => moveCard(currentBoard, source, destination));
  
    try {
      // Send the status update to the server
      await fetch(`/api/tasks/${_card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: toStatus }),
      });
    } catch (error) {
      console.error('Failed to update task status on the server:', error);
      // Optionally, handle errors or rollback UI if needed
    }
  };
  

  return (
    <Box sx={{ padding: 3 }}>
      <ControlledBoard
        onCardDragEnd={handleCardMove}
        disableColumnDrag
        allowAddCard={false}
        allowRemoveColumn={false}
        renderCard={renderCard}
        allowRenameColumn={false}
        allowRemoveCard={false}
      >
        {controlledBoard}
      </ControlledBoard>
    </Box>
  );
};

export default TypographyPage;
