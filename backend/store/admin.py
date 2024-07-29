# admin.py

from django.contrib import admin
from .models import Product, Variant, SubVariant, ProductVariant

class SubVariantInline(admin.TabularInline):
    model = SubVariant
    extra = 1

class VariantAdmin(admin.ModelAdmin):
    inlines = [SubVariantInline]

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline]
    list_display = ('ProductName', 'ProductCode', 'ProductID', 'CreatedDate', 'Active')
    search_fields = ('ProductName', 'ProductCode', 'ProductID')

admin.site.register(Product, ProductAdmin)
admin.site.register(Variant, VariantAdmin)
admin.site.register(SubVariant)
