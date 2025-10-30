import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import Dialog, Message

User = get_user_model


class DialogConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.dialog_id = self.scope['url_route']['kwargs']['dialog_id']
        self.room_group_name = f'dialog_{self.dialog_id}'


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope['user']

        if not user.is_authenticated:
            await self.send(json.dumps({'error': 'Authentication requiered'}))
            return
        
        dialog = self.get_dialog(self.dialog_id)
        if not dialog:
            await self.send(json.dumps({'error': 'Dialog not found'}))
            return
        
        msg = await self.create_message(dialog, user, message)


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': msg.text,
                'sender': user.username,
                'created_at': msg.created_at.strftime('%H:%M %d-%m-%Y'),
            }
        )

        async def chat_message(self, event):
            await self.send(text_data=json.dumps(event))


        @staticmethod
        async def get_dialog(dialog_id):
            try:
                return await Dialog.objects.aget(id=dialog_id)
            except Dialog.DoesNotExist:
                return None
            
        @staticmethod
        async def create_message(dialog, sender, text):
            return await Message.objects.acreate(dialog=dialog, sender=sender, text=text)