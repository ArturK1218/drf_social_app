from django.contrib import admin
from .models import Group, Membership, GroupPost

admin.site.register([Group, Membership, GroupPost])