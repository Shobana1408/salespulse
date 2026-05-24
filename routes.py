from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import User, Sale
from schemas import UserCreate, UserLogin, SaleCreate, SaleResponse
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }


@router.post("/sales")
def add_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_sale = Sale(
        product_name=sale.product_name,
        category=sale.category,
        quantity=sale.quantity,
        price=sale.price,
        sale_date=sale.sale_date,
        user_id=current_user.id
    )

    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    return {"message": "Sale added successfully"}


@router.get("/sales", response_model=list[SaleResponse])
def get_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).filter(Sale.user_id == current_user.id).all()
    return sales


@router.delete("/sales/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sale = db.query(Sale).filter(
        Sale.id == sale_id,
        Sale.user_id == current_user.id
    ).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()

    return {"message": "Sale deleted successfully"}


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sales = db.query(Sale).filter(Sale.user_id == current_user.id).all()

    total_sales = len(sales)
    total_revenue = sum(sale.quantity * sale.price for sale in sales)
    total_quantity = sum(sale.quantity for sale in sales)
    average_sale = total_revenue / total_sales if total_sales > 0 else 0

    return {
        "total_sales": total_sales,
        "total_revenue": total_revenue,
        "total_quantity": total_quantity,
        "average_sale": average_sale
    }


@router.get("/analytics/monthly")
def monthly_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(
        func.month(Sale.sale_date).label("month"),
        func.sum(Sale.quantity * Sale.price).label("revenue")
    ).filter(
        Sale.user_id == current_user.id
    ).group_by(
        func.month(Sale.sale_date)
    ).all()

    data = []

    for row in result:
        data.append({
            "month": row.month,
            "revenue": float(row.revenue)
        })

    return data


@router.get("/analytics/category")
def category_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(
        Sale.category,
        func.sum(Sale.quantity * Sale.price).label("revenue")
    ).filter(
        Sale.user_id == current_user.id
    ).group_by(
        Sale.category
    ).all()

    data = []

    for row in result:
        data.append({
            "category": row.category,
            "revenue": float(row.revenue)
        })

    return data