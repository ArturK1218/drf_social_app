from django.db import models
from django.conf import settings


class Dialog(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='dialogs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        users = ','.join([user.username for user in self.participants.all()])
        return f'Диалог между: {users}'
    

class Message(models.Model):
    dialog = models.ForeignKey(Dialog, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Сообщение от {self.sender.username} ({self.created_at.strftime('%H:%M %d-%m')})'