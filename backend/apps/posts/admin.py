from django.contrib import admin
from .models import Post, Like, Comment

admin.site.register([Post, Like, Comment])
