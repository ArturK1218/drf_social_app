from rest_framework import serializers
from .models import Group, Membership, GroupPost
from apps.users.serializers import UserSerializer


class GroupSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'slug', 'description', 'avatar', 'created_at', 'members_count']

    def get_members_count(self, obj):
        return obj.memberships.count()
    

class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'user', 'group', 'joined_at']


class GroupPostSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = GroupPost
        fields = ['id', 'group', 'author', 'content', 'image', 'created_at'] 