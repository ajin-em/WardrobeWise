from django.contrib import admin
from .models import Product, Variant, SubVariant, Cart, CartItem, Order

class SubVariantInline(admin.TabularInline):
    model = SubVariant
    extra = 1

class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [VariantInline]
    list_display = ('ProductName', 'ProductCode', 'ProductID', 'CreatedDate', 'Active')
    search_fields = ('ProductName', 'ProductCode', 'ProductID')

class VariantAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'stock')  # Ensure 'product' is correct
    search_fields = ('name', 'product__ProductName')  # Correct field lookup

admin.site.register(Product, ProductAdmin)
admin.site.register(Variant, VariantAdmin)
admin.site.register(SubVariant)
admin.site.register(Order)
