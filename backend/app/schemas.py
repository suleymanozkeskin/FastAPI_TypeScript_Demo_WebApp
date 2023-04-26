import enum
import json
from fastapi import UploadFile
from pydantic import BaseModel, EmailStr, validator,Json
from datetime import datetime
from typing import Optional

from pydantic.types import conint


from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


from typing import List, Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    email: str
    username: str

    @validator('username')
    def username_must_not_contain_spaces(cls, v):
        if ' ' in v:
            raise ValueError('Spaces are not allowed in username')
        return v

    @validator('username')
    def username_must_be_shorter_than_20_chars(cls, v):
        if len(v) > 20:
            raise ValueError('Full name must be shorter than 20 characters')
        return v
    
    @validator('email')
    def email_must_end_with_hsrw_org(cls, v):
        if not v.endswith('@hsrw.org'):
            raise ValueError('Only email addresses ending with "@hsrw.org" are allowed')
        return v

    class Config:
        json_encoders = {datetime: lambda dt: dt.isoformat()}

class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        orm_mode = True


class EntryBase(BaseModel):
    title: str
    content: str
    tag: str


class EntryCreate(EntryBase):
    pass



class Entry(EntryBase):
    id: int
    likes: int
    dislikes: int
    created_at: datetime
    owner: User

    class Config:
        orm_mode = True
        json_encoders = {datetime: lambda dt: dt.isoformat()}




class EntryTitleAndInteractions(BaseModel):
    title: str
    interactions: int

    class Config:
        orm_mode = True

class EntrySummary(BaseModel):
    id: int
    title: str
    content: str
    tag: str
    likes: int
    dislikes: int
    total_interactions: int
    comments_count: int = 0 # This is a default value, it will ensure that the field is always present and prevent the validation error

    class Config:
        orm_mode = True


class EntryOut(EntryBase):
    id: int
    likes: int
    dislikes: int
    created_at: datetime
    owner: UserOut
    total: Optional[int] = None

    class Config:
        orm_mode = True


class EntriesResponse(BaseModel):
    entries: List[EntryOut]
    total: int


class CommentBase(BaseModel):
    content: str


class CommentCreate(BaseModel):
    content: str


class Comment(CommentBase):
    id: int
    likes: int
    dislikes: int
    created_at: datetime
    owner: User
    entry: Entry

    class Config:
        orm_mode = True

class CommentWithoutEntry(BaseModel):
    content: str
    id: int
    likes: int
    dislikes: int
    created_at: datetime
    owner: User

    class Config:
        orm_mode = True

# class EntryWithComments(BaseModel):
#     entry: Entry
#     comments: List[CommentWithoutEntry]
#     total_comments: Optional[int] = 0

#     class Config:
#         orm_mode = True
        
class EntryWithComments(BaseModel):
    entry: Entry
    comments: List[CommentWithoutEntry] = []
    total_comments: int = 0


    class Config:
        orm_mode = True


class ShowEntry(BaseModel):
    id: int
    title: str
    content: str
    tag: str
    likes: int
    dislikes: int
    created_at: datetime
    owner_username: str
    comments: Optional[List[Comment]] = []

    class Config:
        orm_mode = True

class ShowComment(BaseModel):
    id: int
    content: str
    likes: int
    dislikes: int
    created_at: datetime
    owner_username: str
    entry_id: int

    class Config:
        orm_mode = True



class SearchResultEntry(BaseModel):
    entry: ShowEntry

    class Config:
        orm_mode = True


class SearchResultComment(BaseModel):
    comment: ShowComment

    class Config:
        orm_mode = True











# Schema for an event image
class EventImage(BaseModel):
    id: int
    event_id: int
    image_path: str
    image_file_type: str

    class Config:
        orm_mode = True

# Schema for creating an event image
class EventImageCreate(BaseModel):
    image_file: UploadFile

    @validator('image_file')
    def validate_image(cls, v):
        file_ext = v.filename.split('.')[-1]
        allowed_exts = ['jpeg', 'jpg', 'dng', 'gif']
        if file_ext.lower() not in allowed_exts:
            raise ValueError('Invalid file type. Only jpeg, jpg, dng, and gif files are allowed.')
        return v

# Schema for a ticket
class Ticket(BaseModel):
    id: int
    event_id: int
    name: str
    price: float
    available_quantity: int

    class Config:
        orm_mode = True

# Schema for creating a ticket
class TicketCreate(BaseModel):
    name: str
    price: float
    available_quantity: int

# Schema for a ticket sale
class TicketSale(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    quantity: int
    sale_date: datetime

    class Config:
        orm_mode = True

# Schema for an event
class Event(BaseModel):
    id: int
    title: str
    content: str
    date: datetime
    organizer_id: int
    organizer_name: str
    created_at: datetime
    is_free: bool
    images: List[EventImage] = []
    tickets: List[Ticket] = []

    class Config:
        orm_mode = True


# Schema for creating an event
class EventCreate(BaseModel):
    title: str
    content: str
    date: datetime
    organizer_id: int
    organizer_name: str
    is_free: bool
    images: List[EventImageCreate]
    tickets: str

    @validator('tickets')
    def parse_tickets(cls, tickets_str):
        try:
            tickets = json.loads(tickets_str)
            if not isinstance(tickets, list):
                raise ValueError("Invalid tickets data")
        except (json.JSONDecodeError, ValueError):
            raise ValueError("Invalid tickets data")

        return tickets


class EventDisplay(BaseModel):
    id: int
    title: str
    content: str
    date: datetime
    organizer_id: int
    organizer_name: str
    created_at: datetime
    is_free: bool
    images: List[EventImage] = []  # <-- add this field
    tickets: List[Ticket] = []

    class Config:
        orm_mode = True



class UserLogin(BaseModel):
    email: EmailStr 
    password: str
    

class Token(BaseModel):
    access_token: str
    token_type: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut
    

class TokenData(BaseModel):
    id: Optional[str] = None
    

class DeleteEntryMessage(BaseModel):
    message: str

class DeleteCommentMessage(BaseModel):
    message: str

class DeleteUserMessage(BaseModel):
    message: str

class DeleteEventMessage(BaseModel):
    message: str









   