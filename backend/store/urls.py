from django.urls import path
from user.views import *
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('list-products/', ListProductView.as_view(), name='list-products'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/update/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('cart/remove/<int:pk>/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('order/', OrderProductView.as_view(), name='order-product'),
]