import logging
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import *
from .serializers import *
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

class ListProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = get_object_or_404(Product, id=product_id)
            cart, created = Cart.objects.get_or_create(user=request.user)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

            if not created:
                cart_item.quantity += int(quantity)
            else:
                cart_item.quantity = int(quantity)

            cart_item.save()

            return Response({'message': 'Product added to cart successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in AddToCartView: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdateCartItemView(APIView):
    def put(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id)
            quantity = request.data.get('quantity')
            cart_item.quantity = quantity
            cart_item.save()
            cart = cart_item.cart
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'CartItem not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RemoveCartItemView(generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart = Cart.objects.get(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

class OrderProductView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            order_data = request.data
            logger.info(f"Order data received: {order_data}")

            # Validate the presence of 'product_id' and 'quantity'
            product_id = order_data.get('product_id')
            quantity = order_data.get('quantity')

            if not product_id:
                return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            if not quantity:
                return Response({"error": "Quantity is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = Product.objects.get(id=product_id)

                if product.TotalStock < int(quantity):
                    return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

                # Update stock
                product.TotalStock -= int(quantity)
                product.save()

                # Create the order
                order = Order.objects.create(
                    user=request.user,
                    product=product,
                    quantity=quantity
                )

                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                logger.error(f"Error in OrderProductView: {e}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

