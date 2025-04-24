from django.contrib import admin
from .models import Gym, Category, Booking, Posts
# Register your models here.

admin.site.register(Gym)
admin.site.register(Category)
admin.site.register(Booking)
admin.site.register(Posts)