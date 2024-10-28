# Task Management App with Kanban Board

A task management application built with **Next.js 14**. The app allows users to manage their tasks effectively using a Kanban board interface, where tasks can be organized into various columns like "Pending," "In Progress," "Completed, etc."

## Features

- **Task Management**: Create, edit, and delete tasks with ease.
- **Kanban Board**: Visualize tasks in different states, making it easier to track progress.
- **Drag-and-Drop Interface**: Move tasks between columns seamlessly with drag-and-drop.
- **Priority and Due Dates**: Assign priorities and due dates to tasks for effective task organization.

## Technology Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) for a fast, SSR-enabled React framework.
- **Backend**: Built-in API routes provided by Next.js for server-side logic.
- **Database**: Configure with your choice of database (e.g., MongoDB, PostgreSQL).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for modern, utility-first styling.
- **State Management**: Redux as a state management library.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MohamedMoumen/task-app.git
   cd task-kanban-app```
   
   
   
### Install Dependencies
```bash
   git clone https://github.com/MohamedMoumen/task-app.git
   cd task-kanban-app
```



### Environment Variables: Create a .env.local file at the root of the project and add the necessary environment variables:
```
MONGODB_URI=mongodb://localhost:27017/practiceez
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123
```

### Run the Development Server:

```
npm run dev
```

Open http://localhost:3000 to view the app.

### Docker Deployment
For deploying using Docker, you can use the included Dockerfile.

- Build the Docker image:
```
docker build -t task--app .
```
- Run the Docker container:

```
docker run -p 3000:3000 task-kanban-app
```

## Usage
### Managing Tasks
- Add Task: Use the "Add Task" button to create a new task with details like title, description, priority, and due date.
- Edit Task: Select a task to edit its details.
- Delete Task: Remove a task from the Kanban board.
- Using the Kanban Board
- Move Tasks: Drag and drop tasks between columns to update their status.
- Columns: Default columns are "To Do," "In Progress," and "Completed." You can customize these based on your workflow.

## Folder Structure
```
.
├── public              # Static files
├── src
│   ├── app             # Project root
│   ├── data            # Faker generated Data for Kanban board
│   ├── interfaces      # Global types
│   ├── lib             # DB Connection Utilities
│   └── models          # DB Models
│   └── store           # Redux Toolkit
│   └── utils           # Theme, emojis, etc
├── middleware.ts       # Auth Middleware
├── Dockerfile          # Docker configuration
└── README.md           # Project documentation

```

## Contact
- For any questions, please reach out to mohamedmoumen17@gmail.com.

## This task was made for Unicodesolutions
