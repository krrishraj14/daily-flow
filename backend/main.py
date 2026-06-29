from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import services

app = FastAPI(title="DailyPulse Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskCreate(BaseModel):
    title: str


class TaskBreakdownRequest(BaseModel):
    task_description: str


@app.get("/")
def root():
    return {"message": "DailyPulse Backend", "status": "running"}


@app.get("/briefing")
def get_briefing():
    return services.get_or_generate_briefing()


@app.get("/ai-news")
def get_ai_news():
    return {"news": services.get_ai_news()}


@app.get("/tasks")
def get_tasks():
    return services.load_tasks()


@app.post("/tasks")
def create_task(task_create: TaskCreate):
    task = services.build_task(task_create.title)
    tasks = services.load_tasks()
    tasks.append(task)
    services.save_tasks(tasks)
    return task


@app.post("/tasks/breakdown")
def breakdown_task(request: TaskBreakdownRequest):
    return services.generate_detailed_breakdown(request.task_description)


@app.put("/tasks/{task_id}/complete")
def complete_task(task_id: str):
    task = services.complete_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}/uncomplete")
def uncomplete_task(task_id: str):
    task = services.uncomplete_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}/subtasks/{subtask_index}")
def toggle_subtask(task_id: str, subtask_index: int):
    task = services.toggle_subtask_by_id(task_id, subtask_index)
    if not task:
        raise HTTPException(status_code=404, detail="Task or subtask not found")
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    deleted = services.delete_task_by_id(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted", "task_id": task_id}


@app.get("/standup")
def get_standup():
    return {"standup": services.generate_standup()}


@app.get("/insights")
def get_insights():
    return {"insights": services.generate_insights()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
