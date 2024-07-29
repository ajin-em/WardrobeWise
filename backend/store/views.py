from rest_framework import generics, status
from rest_framework.views import APIView
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

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_variant_id = request.data.get('product_variant_id')
        quantity = request.data.get('quantity', 1)

        if not product_variant_id:
            return Response({"error": "Product variant ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_variant = ProductVariant.objects.get(id=product_variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": f"Product variant with ID {product_variant_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get or create the cart for the user
        cart, created = Cart.objects.get_or_create(user=request.user)

        # Try to get existing CartItem, or create a new one if it doesn't exist
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_variant=product_variant,
            defaults={'quantity': quantity}
        )

        if not created:
            # If the CartItem already existed, update its quantity
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

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