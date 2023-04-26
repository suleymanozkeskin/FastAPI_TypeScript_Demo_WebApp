from fastapi import FastAPI, Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas, utils
from ..database import get_db

router = APIRouter(
    tags=["Users"]
)

## CREATING USERS:


#NEW WAY:
@router.post("/users", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
    user_data = user.dict()
    
    exist = db.query(models.User).filter(models.User.email == user_data['email']).first()
    if exist is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail=f"This email: {user_data['email']} is already registered. Please use another email or renew your password for this one.")
    
    exist = db.query(models.User).filter(models.User.username == user_data['username']).first()
    if exist is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail=f"This username: {user_data['username']} is already taken. Please choose another username.")
    
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


## Add e-mail verification before registering the user. Once user confirms that they want to register with the email they receive from us , they can log in to platform.






# Get user by id
@router.get("/users/{id}", response_model=schemas.UserOut)   
def get_user(id: int , db: Session = Depends(get_db)):
    
    user= db.query(models.User).filter(models.User.id == id).first()
    
    if not user:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail = f"User with id {id} does not exist.")
    return user

# Get user by username
@router.get("/users/username/{username}", response_model=schemas.UserOut)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail = f"User with username {username} does not exist.")
    return user

# Get user by email
@router.get("/users/email/{email}", response_model=schemas.UserOut)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail = f"User with email {email} does not exist.")
    return user



# reset password
@router.put("/users/{id}/reset-password", response_model=schemas.UserOut)
def reset_password(id: int, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND,
                            detail = f"User with id {id} does not exist.")
    hashed_password = utils.hash(password)
    user.password = hashed_password
    db.commit()
    db.refresh(user)
    return user

