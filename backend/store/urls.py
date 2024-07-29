from django.urls import path
from user.views import *
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('list-products/', ListProductView.as_view(), name='list-products'),
    path('order-product/', OrderProductView.as_view(), name='order-product'),
]
