from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Group, Membership, GroupPost
from .serializers import GroupSerializer, MembershipSerializer, GroupPostSerializer


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Вступить в группу"""
        group = self.get_object()
        membership, created = Membership.objects.get_or_create(user=request.user, group=group)
        if not created:
            return Response({'detail':'Вы уже состоите в этой группе'}, status=400)
        return Response(MembershipSerializer(membership).data, status=201)
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Ливнуть из группы"""
        group = self.get_object()
        deleted, _ = Membership.objects.filter(user=request.user, group=group).delete()
        if deleted:
            return Response({'detail':'Вы покинули группу'}, status=201)
        return Response({'detail':'Вы не стоите в этой группе'}, status=400)
    
    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """Посты группы"""
        group = self.get_object()
        posts = group.group_posts.order_by('-created_at')
        serializer = GroupPostSerializer(posts, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def create_post(self, request, pk=None):
        """Создать пост в группе"""
        group = self.get_object()
        serializer = GroupPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, group=group)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)