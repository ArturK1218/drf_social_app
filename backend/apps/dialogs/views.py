from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Message, Dialog
from .serializers import MessageSerializer, DialogSerializer
from apps.users.models import User


class DialogViewSet(viewsets.ModelViewSet):
    serializer_class = DialogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Dialog.objects.filter(participants=self.request.user).distinct()
    
    @action(detail=False, methods=['post'], url_path='create')
    def create_dialog(self, request):
        """Создать диалог"""
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id обязателен!'}, status=400)
        
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({'error': 'Пользователь не найден!'}, status=404)
        
        dialog, created = Dialog.objects.get_or_create()
        dialog.participants.add(request.user, user)
        dialog.save()


        return Response(DialogSerializer(dialog).data, status=201 if created else 200)
    

    @action(detail=True, methods=['get'], url_path='send')
    def get_messages(self, request, pk=None):
        """Получить все сообщения из диалога"""
        dialog = self.get_object()
        messages = dialog.messages.order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    

    @action(detail=True, methods=['post'], url_path='send')
    def send_message(self, request, pk=None):
        """Отправить сообщение"""
        dialog = self.get_object()
        text = request.data.get('text')
        if not text:
            return Response({'error': 'Нельзя отправить пустое сообщение!'}, status=400)
        
        message = Message.objects.create(dialog=dialog, sender=request.user, text=text)
        return Response(MessageSerializer(message).data, status=201)