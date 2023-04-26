from datetime import date, datetime
from sqlalchemy import ARRAY, JSON, Column, Integer, LargeBinary, String, Boolean, ForeignKey,Float, REAL,DateTime,Enum
from sqlalchemy.orm import relationship,backref
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
import enum
from .database import Base

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, TIMESTAMP, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base


## IMPORTANT NOTE: SQLAlchemy does not allow us to modify an existing table.We have to drop it and create it again.However there are database migration tools such as ALEMBIC.
#  Which allows us to work around this limitation.
# !pip install alembic

# alembic --help

# alembic init alembic  --> This creates a directory for alembic and alembic.ini out of directory.

# alembic revision --help  



# from .database import Base


## CREATING A TABLE THROUGH ORM:



Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    email = Column(String, nullable=False, unique=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

    entries = relationship("Entry", back_populates="owner", cascade="all, delete")
    comments = relationship("Comment", back_populates="owner")
    entry_interactions = relationship("EntryInteraction", back_populates="user")
    comment_interactions = relationship("CommentInteraction", back_populates="user")

    def __repr__(self):
        return f"User({self.username})"

class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    tag = Column(String, nullable=False)
    likes = Column(Integer, nullable=False, default=0)
    dislikes = Column(Integer, nullable=False, default=0)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    owner_username = Column(String, ForeignKey("users.username"), nullable=False)

    owner = relationship("User", back_populates="entries")
    comments = relationship("Comment", back_populates="entry", cascade="all, delete")
    interactions = relationship("EntryInteraction", back_populates="entry")

    def __repr__(self):
        return f"Entry({self.title})"
    
class EntryInteraction(Base):
    __tablename__ = "entry_interactions"
    entry_id = Column(Integer, ForeignKey("entries.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    like_dislike = Column(Boolean, nullable=False)

    entry = relationship("Entry", back_populates="interactions")
    user = relationship("User", back_populates="entry_interactions")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    content = Column(String, nullable=False)
    likes = Column(Integer, nullable=False, default=0)
    dislikes = Column(Integer, nullable=False, default=0)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    owner_username = Column(String, ForeignKey("users.username"), nullable=False)
    entry_id = Column(Integer, ForeignKey("entries.id"), nullable=False)

    owner = relationship("User", back_populates="comments")
    entry = relationship("Entry", back_populates="comments")
    interactions = relationship("CommentInteraction", back_populates="comment")

    def __repr__(self):
        return f"Comment({self.content})"
    
class CommentInteraction(Base):
    __tablename__ = "comment_interactions"
    comment_id = Column(Integer, ForeignKey("comments.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    like_dislike = Column(Boolean, nullable=False)

    comment = relationship("Comment", back_populates="interactions")
    user = relationship("User", back_populates="comment_interactions")



class Event_Post(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    organizer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    organizer_name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    is_free = Column(Boolean, nullable=False, default=True)  # Adds a boolean column to indicate if the event is free of charge

    images = relationship("Event_Image", back_populates="event", cascade="all, delete")
    tickets = relationship("Ticket", back_populates="event", cascade="all, delete")  # Add relationship for tickets


class Event_Image(Base):
    __tablename__ = "event_images"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"))
    image_path = Column(String, nullable=False)
    image_file_type = Column(String, nullable=False)

    event = relationship("Event_Post", back_populates="images")


class Ticket(Base):
    # Each ticket has a name, price, and available quantity
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    available_quantity = Column(Integer, nullable=False)

    event = relationship("Event_Post", back_populates="tickets")
    sales = relationship("Ticket_Sale", back_populates="ticket", cascade="all, delete")  # Add relationship for ticket sales



class Ticket_Sale(Base):
    # Each sale is associated with a user and a ticket, and it includes the quantity of tickets purchased and the date of the sale.
    __tablename__ = "ticket_sales"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    quantity = Column(Integer, nullable=False)
    sale_date = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))

    ticket = relationship("Ticket", back_populates="sales")
    user = relationship("User", backref="ticket_sales")






    
# class Tutor_List(Base):
#     __tablename__ = "tutor_lists"
#     id = Column(Integer,primary_key=True, nullable=False,autoincrement=True)
#     email = Column(String, ForeignKey("users.email",ondelete="CASCADE"),primary_key=True)
#     grade = Column(Float, nullable=False) 
#     class_name = Column(String, nullable=False)
    
    
# class Be_Tutor(Base):
#     __tablename__ = "be_tutor_posts"
#     id = Column(Integer, primary_key=True,nullable=False,unique=True,autoincrement=True)
#     profile_title = Column(String, nullable=False)
#     profile_explanation = Column(String, nullable=False)
#     faculty_name = Column(String, nullable=False)
#     created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
#     tutor_gpa = Column(Float, nullable=False)
#     hourly_rate =Column(Float)
    
#     email = Column(String, ForeignKey("users.email",ondelete="CASCADE"),primary_key=True)
    
    
# class Hire_Tutor(Base):
#     __tablename__ = "hiring_tutors_posts"
#     id = Column(Integer, primary_key=True,nullable=False,autoincrement=True)
#     post_title = Column(String, nullable=False)
#     post_content = Column(String, nullable=False)
#     created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
#     employer_email = Column(String, ForeignKey("users.email",ondelete="CASCADE"),primary_key=True)
    
 
 
