import axios from "axios";
import { useEffect, useState } from "react";

import { Task } from "@/types/schemas/Task";
import { SignedIn } from "@clerk/nextjs";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import Link from "next/link";

type ServerTask = Omit<Task, "dueDate"> & { dueDate: string };
type GetTasksResponse = { data: ServerTask[] };

export default function TasksPage() {
  const [tasks, setTasks] = useState(new Array<Task>());

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/tasks`;
    axios.get<GetTasksResponse>(url).then((response) => {
      const tasks: Task[] = response.data.data.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));

      setTasks(tasks);
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="inline-block text-2xl font-bold tracking-tight text-gray-900">
          Tasks
        </h2>
        <SignedIn>
          <a href="/tasks/create">
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Task
            </button>
          </a>
        </SignedIn>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-between">
        {tasks.map((task: Task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

const TaskCard = ({ task }: { task: Task }) => {
  const { _id, shortDescription, details, budget, category, status, location } =
    task;

  return (
    <div className="flex-grow block max-w-sm rounded overflow-hidden shadow-lg bg-white my-4 p-6 hover:shadow-xl">
      <Link className="flex flex-col h-full" href={`/tasks/${_id}`}>
        <div className="flex-grow">
          <div className="font-bold text-xl mb-2">{shortDescription}</div>
          <p className="text-gray-700 text-base">{details}</p>
        </div>
        <div>
          <div className="mt-6">
            <span className="text-base text-gray-600">
              {location.city} {location.postal_code}
            </span>
          </div>
          <div className="mt-4">
            <span className="inline-block bg-gray-300 text-gray-700 mr-2 items-center rounded-md px-2 py-1 text-xs font-medium">
              {category}
            </span>
            <TaskStatusBadge status={status} />
            <span className="float-right text-green-500 text-xl">
              ${budget}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
