import datetime
import imghdr
import json
from turtle import title
import uuid
from fastapi import FastAPI, File, Form, Response, UploadFile, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func
# from sqlalchemy.sql.functions import func
from .. import models, schemas, oauth2
from ..database import get_db

ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def event_to_dict(event):
    return {
        "id": event.id,
        "title": event.title,
        "content": event.content,
        "date": event.date,
        "organizer_id": event.organizer_id,
        "organizer_name": event.organizer_name,
        "created_at": event.created_at,
        "is_free": event.is_free,
        "images": event.images,
        "tickets": event.tickets if event.tickets else [],
    }



router = APIRouter(
    tags=["Event_Posts"]
)


# Create a new event 
# Requires  folders named "uploads/events" in the root directory
@router.post("/events")
def create_event(
    title: str = Form(...),
    content: str = Form(...),
    date: datetime = Form(...),
    organizer_name: str = Form(...),
    is_free: bool = Form(...),
    tickets: str = Form(None),  # Change this line to have a default value of None
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    new_event = models.Event_Post(
        title=title,
        content=content,
        date=date.strftime("%Y-%m-%d %H:%M:%S"),
        organizer_id=current_user.id,
        organizer_name=organizer_name,
        is_free=is_free
    )

    # Create the event images and add them to the event
    for image in images:
        file_extension = imghdr.what(None, h=image.file.read())  # Get the file extension of the image
        # Reset the file pointer after reading
        image.file.seek(0)
        if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image format not supported")
        
        # Save the image to the server
        image_path = f"{str(uuid.uuid4())}.{file_extension}"
        try:
            with open(f"uploads/events/{image_path}", "wb") as f:
                f.write(image.file.read())  # Read the image file content here
        except IOError as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error saving image: {e}")

        # Add the image record to the database
        new_image = models.Event_Image(
            image_path=image_path,
            image_file_type=file_extension
        )
        new_event.images.append(new_image)

    # If the event is not free, create the tickets and add them to the event
    if not new_event.is_free and tickets is not None:
        # Parse the tickets string into a list of dictionaries
        ticket_dicts = json.loads(tickets)

        # Convert the list of dictionaries to a list of TicketCreate objects
        tickets = [schemas.TicketCreate(**ticket_dict) for ticket_dict in ticket_dicts]

        if len(tickets) == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event is not free but no tickets were provided")

        for ticket in tickets:
            new_ticket = models.Ticket(
                name=ticket.name,
                price=ticket.price,
                available_quantity=ticket.available_quantity
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)
            new_event.tickets.append(new_ticket)

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event




@router.get("/events/upcoming")
def get_upcoming_events(db: Session = Depends(get_db)):
    """
    Returns a list of upcoming events sorted by their dates, with the closest event being first.
    """
    now = datetime.utcnow()
    events = db.query(models.Event_Post).filter(models.Event_Post.date >= now).order_by(models.Event_Post.date.asc()).all()
    if not events:
        return {"message": "No upcoming events yet"}
    
    event_dicts = [event_to_dict(event) for event in events]
    return event_dicts

@router.get("/events/past")
def get_past_events(db: Session = Depends(get_db)):
    """
    Returns a list of past events sorted by their dates, with the closest event being last.
    """
    now = datetime.utcnow()
    events = db.query(models.Event_Post).filter(models.Event_Post.date < now).order_by(models.Event_Post.date.desc()).all()
    if not events:
        return [{"message": "No past events found"}]
    
    event_dicts = [event_to_dict(event) for event in events]
    return event_dicts



#     # IMPORTANT NOTE !!
#     # Issue: In order to avoid receiving id numbers in a non-integer form like this: http://127.0.0.1:8000/posts/asdjsdsfds , 
#     # We need to first validate it as a number and convert into an integer as we define in the get_post function.
#     # Then we have to convert back in to a string when we want execute our SQL Query, OTHERWISE there will be a " TypeError: 'int' object does not support indexing. "
    

# CURL TESTING:
# curl -X POST 'http://localhost:8000/events' \
# -H 'Content-Type: multipart/form-data' \
# -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE2Nzk1MTE1MDd9.37iRK-7Id23U8gcphGQ2y39aIr5wVwVekT-OV3pEIaw' \
# -F 'title=my event' \
# -F 'content=bla bla about the event' \
# -F 'date=2023-04-01 18:00:00' \
# -F 'is_free=false' \
# -F 'organizer_name=süleyman özkeskin' \
# -F 'tickets=[{"name": "General Admission", "price": 25.00, "available_quantity": 100}, {"name": "VIP", "price": 75.00, "available_quantity": 50}]' \
# -F 'images=@/home/orion/Desktop/output.png'
