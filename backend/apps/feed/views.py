from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.posts.models import Post
from apps.groups.models import Membership, GroupPost
from apps.posts.serializers import PostSerializer
from apps.groups.serializers import GroupPostSerializer
from .models import FriendShip

class FeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        sort = request.query_params.get('sort', 'recent')

        #Собираем друзей
        friends = FriendShip.objects.filter(
            Q(from_user=user, accepted=True) | Q(to_user=user, accepted=True)
        )
        friend_ids = {
            f.to_user_id if f.from_user_id == user.id else f.from_user_id
            for f in friends
        }

        #Посты пользователя и друзей
        user_and_friends_posts = Post.objects.filter(
            Q(author=user) | Q(author__in=friend_ids)
        ).annotate(
            likes_count = Count('likes'),
            comments_count = Count('comments')
        )

        #Посты из групп, на которые подписан пользователь
        group_ids = Membership.objects.filter(user=user).values_list('group_id', flat=True)
        group_posts = GroupPost.objects.filter(group_id__in=group_ids).annotate(
            likes_count = Count('group__group_posts'),
        )

        #Сортировка
        if sort == 'popular':
            user_and_friends_posts = user_and_friends_posts.order_by('-likes_count', '-comments_count', '-created_at')
            group_posts = group_posts.order_by('-likes_count', '-created_at')
        else:
            user_and_friends_posts = user_and_friends_posts.order_by('-created_at')
            group_posts = group_posts.order_by('-created_at')

        #Сериализация и объединение 
        serialized_posts = PostSerializer(user_and_friends_posts, many=True).data
        serialized_group_posts = GroupPostSerializer(group_posts, many=True).data

        feed = sorted(
            serialized_posts + serialized_group_posts,
            key=lambda x: x['created_at'],
            reverse=True
        )


        return Response(feed)