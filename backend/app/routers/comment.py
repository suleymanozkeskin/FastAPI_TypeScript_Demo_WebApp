from fastapi import APIRouter, Depends, HTTPException, status , Query
from sqlalchemy.orm import Session
from typing import List, Union, Dict, Any
from fastapi.responses import JSONResponse

from .. import schemas, models, oauth2
from ..database import get_db
import logging 

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)


router = APIRouter(
    tags=["Comments"]
)

# CREATE COMMENT FOR ENTRY
@router.post("/entries/{entry_id}/comments", response_model=schemas.Comment)
def create_comment_for_entry(
    entry_id: int,
    comment: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user)
):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    new_comment = models.Comment(
        entry_id=entry_id,
        owner_username=current_user.username,
        content=comment.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment



# LIKE COMMENT
@router.post("/comments/{comment_id}/like", response_model=schemas.Comment)
def like_comment(comment_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if current_user.username == comment.owner_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users cannot like their own comment")

    interaction = db.query(models.CommentInteraction).filter(models.CommentInteraction.comment_id == comment_id,
                                                              models.CommentInteraction.user_id == current_user.id).first()

    if interaction:
        if interaction.like_dislike:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already liked this comment")
        else:
            interaction.like_dislike = True
            comment.dislikes -= 1
    else:
        interaction = models.CommentInteraction(comment_id=comment_id, user_id=current_user.id, like_dislike=True)
        db.add(interaction)

    comment.likes += 1
    db.commit()
    db.refresh(comment)
    return comment


# DISLIKE COMMENT
@router.post("/comments/{comment_id}/dislike", response_model=schemas.Comment)
def dislike_comment(comment_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if current_user.username == comment.owner_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users cannot dislike their own comment")

    interaction = db.query(models.CommentInteraction).filter(models.CommentInteraction.comment_id == comment_id,
                                                              models.CommentInteraction.user_id == current_user.id).first()

    if interaction:
        if not interaction.like_dislike:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already disliked this comment")
        else:
            interaction.like_dislike = False
            comment.likes -= 1
    else:
        interaction = models.CommentInteraction(comment_id=comment_id, user_id=current_user.id, like_dislike=False)
        db.add(interaction)

    comment.dislikes += 1
    db.commit()
    db.refresh(comment)
    return comment






# Get the entry and all comments for that entry
@router.get("/entries/{entry_id}/comments", response_model=schemas.EntryWithComments)
def get_comments_for_entry(entry_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    comments = (
        db.query(models.Comment)
        .filter(models.Comment.entry_id == entry_id)
        .order_by(models.Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {"entry": entry, "comments": comments}



# Get the entry and all comments for that entry paginated
# WORKS
@router.get("/entries/{entry_id}/comments/paginated", response_model=schemas.EntryWithComments)
def get_comments_for_entry(entry_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")

    comments = (
        db.query(models.Comment)
        .filter(models.Comment.entry_id == entry_id)
        .order_by(models.Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    total_comments = db.query(models.Comment).filter(models.Comment.entry_id == entry_id).count()

    response_data = {
        "entry": schemas.Entry.from_orm(entry).dict(),
        "comments": [schemas.CommentWithoutEntry.from_orm(comment) for comment in comments],
        "total_comments": total_comments
    }

    return response_data








# GET COMMENTS WITH ID
@router.get("/comments/{comment_id}", response_model=schemas.Comment)
def get_comment_by_id(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    return comment



# DELETE COMMENT
@router.delete("/comments/{comment_id}", response_model=schemas.Comment)
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    deleted_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not deleted_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if current_user.username != deleted_comment.owner_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can only delete your own comment")
    db.delete(deleted_comment)
    db.commit()

    

    


