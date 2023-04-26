from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import database, schemas, models, utils, oauth2

router = APIRouter(tags=["Authentication"])

@router.post("/login",response_model=schemas.LoginResponse,response_model_exclude={"user.id","user.created_at"})
def login(user_credentials: OAuth2PasswordRequestForm = Depends() ,db: Session = Depends(database.get_db)):
    
  
    user = db.query(models.User).filter(
        models.User.email == user_credentials.username).first()
    
    if not user:
        raise HTTPException(status_code= status.HTTP_403_FORBIDDEN,detail=f"Invalid credentials.")
    
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(status_code= status.HTTP_403_FORBIDDEN, detail=f"Invalid credentials.")
    
    # create a token
    # return a token
    
    access_token = oauth2.create_access_token(data= {"user_id": user.id})
     
    
    return{"access_token": access_token , "token_type": "bearer", "user": user}


# Log out route
@router.post("/logout")
def logout(response: Response, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(oauth2.get_current_user)):
    response.set_cookie(key="Authorization", value="null", expires=0)
    return {"message": "Successfully logged out"}
