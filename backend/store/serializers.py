from rest_framework import serializers
from .models import *

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'name', 'stock']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)  

    class Meta:
        model = Product
        fields = '__all__'
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity']  

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  

    class Meta:
        model = Order
        fields = ['id', 'product', 'quantity'] 
