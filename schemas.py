from pydantic import BaseModel, EmailStr
from datetime import date


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class SaleCreate(BaseModel):
    product_name: str
    category: str
    quantity: int
    price: float
    sale_date: date


class SaleResponse(BaseModel):
    id: int
    product_name: str
    category: str
    quantity: int
    price: float
    sale_date: date

    class Config:
        from_attributes = True