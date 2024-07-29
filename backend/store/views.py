from rest_framework import generics, status
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.db import transaction
from rest_framework.permissions import IsAuthenticated

class ListProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        product_variant = serializer.validated_data['product_variant']
        quantity = serializer.validated_data['quantity']
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product_variant=product_variant)
        if not created:
            cart_item.quantity += quantity
        cart_item.save()

class UpdateCartItemView(generics.UpdateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart = Cart.objects.get(user=self.request.user)
        return CartItem.objects.filter(cart=cart)

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
            product_variant_id = order_data['product_variant']
            quantity = order_data['quantity']

            try:
                product_variant = ProductVariant.objects.get(id=product_variant_id)

                if product_variant.stock < quantity:
                    return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

                # Update stock
                product_variant.stock -= quantity
                product_variant.save()

                # Create the order
                Order.objects.create(
                    product_variant=product_variant,
                    quantity=quantity
                )

                return Response({"status": "success", "data": f"Order placed for {quantity} units"}, status=status.HTTP_201_CREATED)

            except ProductVariant.DoesNotExist:
                return Response({"error": "ProductVariant not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)