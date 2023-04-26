from fastapi import FastAPI, Query, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional, Union

from sqlalchemy import case, desc, func, or_
# from sqlalchemy.sql.functions import func
from .. import models, schemas, oauth2
from ..database import get_db
from datetime import datetime, timedelta


router = APIRouter(
    tags=['Search']
    )





from fastapi import Request

@router.get('/search', response_model=List[Union[schemas.ShowEntry, schemas.ShowComment]])
def search_forum(request: Request, db: Session = Depends(get_db)):
    query = request.query_params.get('q', None)

    if not query:
        return []

    # Search for entries that match the query in the title or content
    entries = db.query(models.Entry).filter(
        or_(
            models.Entry.title.ilike(f"%{query}%"),
            models.Entry.content.ilike(f"%{query}%")
        )
    ).all()

    # Search for comments that match the query in the content
    comments = db.query(models.Comment).filter(
        models.Comment.content.ilike(f"%{query}%")
    ).all()

    # Serialize the entries and comments
    serialized_entries = [schemas.ShowEntry.from_orm(entry) for entry in entries]
    serialized_comments = [schemas.ShowComment.from_orm(comment) for comment in comments]

    return serialized_entries + serialized_comments
