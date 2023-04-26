from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

SQLALCHEMY_DATABASE_URL = settings.sqlalchemy_database_url

# Print the DATABASE_URL value to debug
print("DATABASE_URL:", SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# We need to have an independent database session/connection (SessionLocal) per request, use the same session through all the request and then close it after the request is finished.
# And then a new session will be created for the next request.This is much more efficient than keeping one open.
# For that, we will create a new dependency with yield


#-------------------------------------------------------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db # The yielded value is what is injected into path operations and other dependencies
    finally: 
        db.close()
        
        
#-------------------------------------------------------------------------------------




