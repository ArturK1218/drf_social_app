from django.contrib.auth.models import AbstractUser
from django.db import models

# Кастомизируем модель добовляя поля аватарки и описания
class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)

    def __str__(self):
        return self.username