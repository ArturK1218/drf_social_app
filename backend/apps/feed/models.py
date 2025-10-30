from django.db import models
from django.conf import settings


class FriendShip(models.Model):
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,   
        related_name='set_friends_request'   
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,   
        related_name='recieve_friends_request'   
    )
    created_at = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        status = "✅" if self.accepted else "⏳"
        return f'{self.from_user.username} => {self.to_user.username} ({status})'