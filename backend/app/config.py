from pydantic import AnyUrl, BaseSettings
import os

class Settings(BaseSettings):
    database_url: AnyUrl = os.environ['DATABASE_URL']
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    database_hostname: str = None
    database_port: str = None
    database_password: str = None
    database_username: str = None
    database_name: str = None

    class Config:
        env_file = ".env"

    @property
    def sqlalchemy_database_url(self):
        if self.database_url:
            # Ensure the correct dialect is used , THIS IS EXTREMELY IMPORTANT WHILE USING SQLALCHEMY 
            # FOR CONNECTING TO POSTGRES DATABASE ON HEROKU. OTHERWISE YOU WILL GET A DIALECT ERROR.
            fixed_url = self.database_url.replace("postgres://", "postgresql://")
            return fixed_url
        else:
            return f'postgresql://{self.database_username}:{self.database_password}@{self.database_hostname}:{self.database_port}/{self.database_name}'


settings = Settings()



# we are creating an instance of Settings class  and pydantic will read all of the environment variables listed in the Settings class 
                      # and its going to perform validations 

