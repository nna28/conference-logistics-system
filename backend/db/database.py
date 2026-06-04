from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = (
    "postgresql+psycopg2://postgres:131284@localhost/conference_logistics"
)

engine = create_engine(
    DATABASE_URL
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()