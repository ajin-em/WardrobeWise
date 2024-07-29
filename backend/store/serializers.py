from rest_framework import serializers
from .models import *

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['id', 'name']

class ProductVariantSerializer(serializers.ModelSerializer):
    subvariant = SubVariantSerializer()

    class Meta:
        model = ProductVariant
        fields = ['id', 'subvariant', 'stock']

class ProductSerializer(serializers.ModelSerializer):
    product_variants = ProductVariantSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate', 'UpdatedDate', 'IsFavourite', 'Active', 'HSNCode', 'TotalStock', 'CreatedUser', 'product_variants']

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product_variant', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'product_variant', 'quantity']