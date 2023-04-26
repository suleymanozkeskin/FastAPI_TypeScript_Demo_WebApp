from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(
    tags=["Feed"]
)


# A list to keep track of all active WebSocket connections
active_connections: List[WebSocket] = []


# Function to send an entry to all active connections
async def send_entry(entry: schemas.Entry):
    for connection in active_connections:
        await connection.send_json({"type": "entry", "data": entry})


# WebSocket endpoint to receive new connections
@router.websocket("/feed")
async def feed_websocket(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Wait for new entries
            data = await websocket.receive_json()
            if data["type"] == "new_entry":
                # Create a new entry in the database
                db = get_db()
                entry = models.Entry(
                    title=data["title"],
                    content=data["content"],
                    tag=data["tag"],
                    owner_username=data["owner_username"],
                    created_at=datetime.utcnow(),
                )
                db.add(entry)
                db.commit()
                db.refresh(entry)
                # Send the new entry to all active connections
                await send_entry(entry)
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# This code defines a WebSocket endpoint at /feed and a function to send an entry to all active connections.
# When a new entry is created, it is saved in the database and then sent to all active connections.