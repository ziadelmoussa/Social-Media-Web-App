from rest_framework import serializers
from .models import Post

class PostSerializers(serializers.ModelSerializer):

    author = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Post

        fields = ['id', 'author', 'content', 'created_at']

        read_only_fields = ['author']