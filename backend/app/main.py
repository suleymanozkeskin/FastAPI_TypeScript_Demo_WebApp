from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import event_post, rate_tutor

import os
from . import models
from .database import engine
from .routers import  entry, user, auth,event_post,feed,comment,search_forum
from .config import settings
    
print(os.environ)






#INTEGRATION OF "models.py" to create database tables: 

models.Base.metadata.create_all(bind=engine)




app = FastAPI()

origins = ["https://www.google.com",
           "http://localhost:8000",
              "http://localhost:3000",
                "http://localhost:3001",
                "https://fastapi-hsrw-demo.vercel.app/"
           ]  # this means that currently only google.com can have access to this website but if it were to be a public domain origins would be defined as following:

# origins = ["*"] # public

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )


app.include_router(entry.router)
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(feed.router)
app.include_router(event_post.router)
app.include_router(comment.router)
app.include_router(search_forum.router)

@app.get("/")
def root():
    return{"message": "welcome to my page  "}
        
    

## IN ORDER TO START THE APP WE WILL USE THE FOLLOWING:
## cd backend and then run:   uvicorn app.main:app --reload


