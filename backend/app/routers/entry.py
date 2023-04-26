from fastapi import FastAPI, Query, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

from sqlalchemy import case, desc, func, or_
# from sqlalchemy.sql.functions import func
from .. import models, schemas, oauth2
from ..database import get_db
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


router = APIRouter(
    tags=["Entries"]
)

## IMPORTANT NOTE: ALWAYS PUT GETTING BY ID AT THE END OF THE FILE, OTHERWISE IT WILL CONFLICT WITH THE OTHER GETTING FUNCTIONS. ORDER MATTERS.



# Create an entry 
# WORKS
@router.post("/entries", status_code=status.HTTP_201_CREATED, response_model=schemas.Entry)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    new_entry = models.Entry(owner_username=current_user.username, **entry.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


# Get all entries
# WORKS
@router.get("/entries", response_model=List[schemas.Entry])
def get_all_entries(db: Session = Depends(get_db)):
    entries = db.query(models.Entry).all()
    return entries


# Get all entries sorted by date , newest first. paginated by 10
# WORKS BUT NOD ADDED TO POSTMAN COLLECTION YET
@router.get("/entries/sort_by_date", response_model=List[schemas.Entry])
def get_all_entries_sorted_by_date(page: int = 1, db: Session = Depends(get_db)):
    # Calculate the offset and limit values based on the page number
    offset = (page - 1) * 10
    limit = 10

    # Get the entries sorted by date, newest first, for the current page
    entries = (
        db.query(models.Entry)
        .order_by(models.Entry.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return entries



# Get entries by username
# WORKS
@router.get("/entries/username/{username}", response_model=List[schemas.Entry])
def get_entries_by_username(username: str, skip: Optional[int] = Query(0), limit: Optional[int] = Query(10), db: Session = Depends(get_db)):
    entries = db.query(models.Entry).filter(models.Entry.owner_username == username).order_by(models.Entry.created_at.desc()).offset(skip).limit(limit).all()
    if not entries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with username: {username} does not have any entries.")
    return entries



# Get Entries by tag
# WORKS
from sqlalchemy import desc

@router.get("/entries/tag/{tag}", response_model=List[schemas.Entry])
def get_entries_by_tag(tag: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    entries = (
        db.query(models.Entry)
        .filter(models.Entry.tag == tag)
        .order_by(desc(models.Entry.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    if not entries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No entries with tag: {tag} were found.")
    return entries




# Get Entries with most interactions (Where interactions = likes + abs(dislikes))
# WORKS
@router.get("/entries/most_interactions", response_model=List[schemas.Entry])
def get_entries_with_most_interactions(db: Session = Depends(get_db)):
    entries = db.query(models.Entry).order_by(desc(func.abs(models.Entry.likes) + func.abs(models.Entry.dislikes))).all()
    if not entries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No entries were found.")
    return entries



# Get Entries with most likes
# WORKS BUT IT GETS THE ENTRIES EVEN THERE IS NO LIKES
# UPDATE THIS!
@router.get("/entries/most-liked", response_model=List[schemas.Entry])
def get_entries_with_most_likes(db: Session = Depends(get_db)):
    entries = db.query(models.Entry).order_by(models.Entry.likes.desc()).all()
    return entries

# Get Entries with most dislikes
# WORKS BUT IT GETS THE ENTRIES EVEN THERE IS NO LIKES
# UPDATE THIS!
@router.get("/entries/most-disliked", response_model=List[schemas.Entry])
def get_entries_with_most_dislikes(db: Session = Depends(get_db)):
    entries = db.query(models.Entry).order_by(models.Entry.dislikes.desc()).all()
    return entries





# Get all entries with pagination
# WORKS
@router.get("/entries/paginate", response_model=List[schemas.Entry])
def get_all_entries(page: int = 1, db: Session = Depends(get_db)):
    per_page = 10
    offset = (page - 1) * per_page

    entries = db.query(models.Entry).offset(offset).limit(per_page).all()

    return entries



# Like an entry
# WORKS
@router.post("/entries/{entry_id}/like", response_model=schemas.Entry)
def like_entry(entry_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    if current_user.username == entry.owner_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users cannot like their own entry")

    # Check if the user has already liked the entry
    interaction = db.query(models.EntryInteraction).filter(models.EntryInteraction.entry_id == entry_id, models.EntryInteraction.user_id == current_user.id).first()
    if interaction:
        if interaction.like_dislike:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has already liked this entry")
        else:
            interaction.like_dislike = True
            entry.likes += 1
            entry.dislikes -= 1
    else:
        new_interaction = models.EntryInteraction(entry_id=entry_id, user_id=current_user.id, like_dislike=True)
        db.add(new_interaction)
        entry.likes += 1

    db.commit()
    db.refresh(entry)
    return entry




# dislike entry
# WORKS
@router.post("/entries/{entry_id}/dislike", response_model=schemas.Entry)
def dislike_entry(entry_id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    if current_user.username == entry.owner_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users cannot dislike their own entry")

    # Check if the user has already disliked the entry
    interaction = db.query(models.EntryInteraction).filter(models.EntryInteraction.entry_id == entry_id, models.EntryInteraction.user_id == current_user.id).first()
    if interaction:
        if not interaction.like_dislike:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has already disliked this entry")
        else:
            interaction.like_dislike = False
            entry.likes -= 1
            entry.dislikes += 1
    else:
        new_interaction = models.EntryInteraction(entry_id=entry_id, user_id=current_user.id, like_dislike=False)
        db.add(new_interaction)
        entry.dislikes += 1

    db.commit()
    db.refresh(entry)
    return entry




# most liked entries of all time  with its number of interactions (paginated by 20) 
# WORKS
@router.get("/entries/most-liked-of-all-time", response_model=List[schemas.EntrySummary])
def get_most_liked_entries(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    entries = db.query(models.Entry).outerjoin(models.Entry.interactions).group_by(models.Entry.id).filter(models.EntryInteraction.like_dislike.is_(True)).order_by(
        func.count(models.EntryInteraction.like_dislike == True).desc()
    ).offset(skip).limit(limit).all()

    def to_entry_summary(entry: models.Entry) -> schemas.EntrySummary:
        if entry is None or not all(hasattr(entry, field) for field in ('content', 'tag', 'likes', 'dislikes')):
            raise ValueError('Entry object is missing required fields')
        return schemas.EntrySummary(
            id=entry.id,
            title=entry.title,
            content=entry.content,
            tag=entry.tag,
            likes=entry.likes,
            dislikes=entry.dislikes,
            total_interactions=entry.likes + entry.dislikes,
            comments_count=len(entry.comments)
        )

    return list(map(to_entry_summary, entries))




# most disliked entries of all time  with its number of interactions (paginated by 20)
# WORKS
@router.get("/entries/most-disliked-of-all-time", response_model=List[schemas.EntrySummary])
def get_most_disliked_entries(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    entries = db.query(models.Entry).outerjoin(models.Entry.interactions).group_by(models.Entry.id).filter(models.EntryInteraction.like_dislike.is_(False)).order_by(
        func.count(models.EntryInteraction.like_dislike == False).desc(), models.Entry.id
    ).offset(skip).limit(limit).all()

    entry_summaries = []
    for entry in entries:
        entry_summaries.append({
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "tag": entry.tag,
            "likes": entry.likes,
            "dislikes": entry.dislikes,
            "total_interactions": entry.likes + entry.dislikes,
            "comments_count": len(entry.comments)
        })

    return entry_summaries






# Get entries with most commented in the last 24h (top 20) 
# WORKS
@router.get("/entries/most-commented-last-24h-top-20", response_model=List[schemas.EntrySummary])
def get_most_commented_entries_last_24h(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    last_24h = datetime.utcnow() - timedelta(hours=24)
    entries = (
        db.query(models.Entry, func.count(models.Comment.id))
        .filter(models.Entry.created_at >= last_24h, models.Entry.comments.any())
        .outerjoin(models.Entry.comments)
        .group_by(models.Entry.id)
        .order_by(desc(func.count(models.Comment.id)))
        .offset(skip)
        .limit(limit)
        .all()
    )

    entry_summaries = []
    for entry, comments_count in entries:
        entry_summaries.append({
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "tag": entry.tag,
            "likes": entry.likes,
            "dislikes": entry.dislikes,
            "total_interactions": entry.likes + entry.dislikes,
            "comments_count": comments_count
        })

    return entry_summaries



# Get entries with most interactions of all time paginated by 20
# WORKS
@router.get("/entries/most-interacted-of-all-time", response_model=List[schemas.EntrySummary])
def get_most_interacted_entries_all_time(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    entries = db.query(models.Entry).filter(
        (models.Entry.likes + models.Entry.dislikes) > 0  # Only consider entries with at least one interaction
    ).order_by(desc(models.Entry.likes + models.Entry.dislikes)).offset(skip).limit(limit).all()

    entry_summaries = []
    for entry in entries:
        entry_summaries.append({
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "tag": entry.tag,
            "likes": entry.likes,
            "dislikes": entry.dislikes,
            "total_interactions": entry.likes + entry.dislikes,
            "comments_count": len(entry.comments)
        })

    return entry_summaries


# Get entries with most interactions  (top 20)
# WORKS
@router.get("/entries/most-interacted-top-20", response_model=List[schemas.EntrySummary])
def get_most_interacted_entries_all_time(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    entries = (
        db.query(models.Entry)
        .outerjoin(models.Comment)
        .filter(models.Entry.likes + models.Entry.dislikes > 0)
        .group_by(models.Entry.id)
        .order_by(desc(models.Entry.likes + models.Entry.dislikes),
                  desc(func.count(models.Comment.entry_id)),
                  models.Entry.id.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    def to_entry_summary(entry: models.Entry) -> schemas.EntrySummary:
        if entry is None or not all(hasattr(entry, field) for field in ('content', 'tag', 'likes', 'dislikes')):
            raise ValueError('Entry object is missing required fields')
        return schemas.EntrySummary(
            id=entry.id,
            title=entry.title,
            content=entry.content,
            tag=entry.tag,
            likes=entry.likes,
            dislikes=entry.dislikes,
            total_interactions=entry.likes + entry.dislikes,
            comments_count=len(entry.comments)
        )

    return list(map(to_entry_summary, entries))



# Get entries with most interactions in the last 24h (top 20)
# WORKS 
@router.get("/entries/most-interacted-last-24h-top-20", response_model=List[schemas.EntrySummary])
def get_most_interacted_entries_last_24h_top_20(db: Session = Depends(get_db)):
    last_24h = datetime.utcnow() - timedelta(hours=24)
    entries = (
        db.query(models.Entry)
        .outerjoin(models.Entry.interactions)
        .outerjoin(models.Comment)
        .filter(models.Entry.created_at >= last_24h)
        .group_by(models.Entry.id)
        .order_by(
            desc(
                func.count(models.EntryInteraction.like_dislike)
                + models.Entry.likes
                + models.Entry.dislikes
            ),
            desc(func.count(models.Comment.id)),
            desc(models.Entry.created_at)
        )
        .limit(20)
        .all()
    )

    entry_summaries = []
    for entry in entries:
        entry_summaries.append({
            "id": entry.id,
            "title": entry.title,
            "content": entry.content,
            "tag": entry.tag,
            "likes": entry.likes,
            "dislikes": entry.dislikes,
            "total_interactions": entry.likes + entry.dislikes + len(entry.comments),
            "comments_count": len(entry.comments)
        })

    return entry_summaries




# Get entries with most likes of in the last 24h (top 20)
# WORKS
@router.get("/entries/most-liked-last-24h-top-20", response_model=List[schemas.EntrySummary])
def get_most_liked_entries_last_24h(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)

    entries = (
        db.query(models.Entry)
        .outerjoin(models.Entry.interactions)
        .group_by(models.Entry.id)
        .filter(models.EntryInteraction.like_dislike.is_(True))
        .filter(models.Entry.created_at > yesterday)
        .order_by(func.count(models.EntryInteraction.like_dislike == True).desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    def to_entry_summary(entry: models.Entry) -> schemas.EntrySummary:
        if entry is None or not all(hasattr(entry, field) for field in ('content', 'tag', 'likes', 'dislikes')):
            raise ValueError('Entry object is missing required fields')
        comments_count = len(entry.comments) if hasattr(entry, "comments") and entry.comments is not None else 0
        return schemas.EntrySummary(
            id=entry.id,
            title=entry.title,
            content=entry.content,
            tag=entry.tag,
            likes=entry.likes,
            dislikes=entry.dislikes,
            total_interactions=entry.likes + entry.dislikes,
            comments_count=comments_count
        )


    return list(map(to_entry_summary, entries))



# Get entries with most dislikes of in the last 24h (top 20)
# WORKS
@router.get("/entries/most-disliked-last-24h-top-20", response_model=List[schemas.EntrySummary])
def get_most_disliked_entries_last_24h(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)

    entries = (
        db.query(models.Entry)
        .outerjoin(models.Entry.interactions)
        .group_by(models.Entry.id)
        .filter(models.EntryInteraction.like_dislike.is_(False))
        .filter(models.Entry.created_at > yesterday)
        .order_by(func.count(models.EntryInteraction.like_dislike == False).desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    def to_entry_summary(entry: models.Entry) -> schemas.EntrySummary:
        if entry is None or not all(hasattr(entry, field) for field in ('content', 'tag', 'likes', 'dislikes')):
            raise ValueError('Entry object is missing required fields')
        comments_count = len(entry.comments) if hasattr(entry, "comments") and entry.comments is not None else 0
        return schemas.EntrySummary(
            id=entry.id,
            title=entry.title,
            content=entry.content,
            tag=entry.tag,
            likes=entry.likes,
            dislikes=entry.dislikes,
            total_interactions=entry.likes + entry.dislikes,
            comments_count=comments_count
        )

    return list(map(to_entry_summary, entries))







# get entries by user
# If user does not exist, return a message that says "User not found"
# COME BACK TO THIS:
@router.get("/entries/user/{username}", response_model=List[schemas.Entry])
def get_entries_by_user(username: str, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    entries = db.query(models.Entry).filter(models.Entry.owner_username == username).offset(skip).limit(limit).all()
    return entries



# Get entry by ID
@router.get("/entries/{entry_id}", response_model=schemas.Entry)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return entry


# Delete entry by ID
@router.delete("/entries/{entry_id}", response_model=schemas.DeleteEntryMessage)
def delete_entry(
    entry_id: int, current_user: schemas.User = Depends(oauth2.get_current_user), db: Session = Depends(get_db)
):
    entry = db.query(models.Entry).filter(models.Entry.id == entry_id).first()

    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    if entry.owner_username != current_user.username:
        raise HTTPException(status_code=403, detail="You can only delete your own entries")

    db.delete(entry)
    db.commit()

    return {"message": f"Entry with id {entry_id} has been deleted"}
