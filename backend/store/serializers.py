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

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'product_variant', 'quantity']
