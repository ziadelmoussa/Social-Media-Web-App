from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Post

class DevPulseAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create two test users
        self.user1 = User.objects.create_user(username='alice', password='password123')
        self.user2 = User.objects.create_user(username='bob', password='password123')

        # Create a sample post owned by user1
        self.post = Post.objects.create(author=self.user1, content="Hello World!")

    def test_get_posts_list(self):
        """Verify anyone can retrieve the feed"""
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_create_post_fails(self):
        """Verify unauthenticated users cannot post"""
        response = self.client.post('/api/posts/', {'content': 'Unauthenticated post'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_create_post(self):
        """Verify authenticated users can create posts"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.post('/api/posts/', {'content': 'Authenticated post'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_post_ownership_protection(self):
        """Verify users cannot edit or delete posts created by others"""
        # Log in as user2 and attempt to delete user1's post
        self.client.force_authenticate(user=self.user2)
        delete_response = self.client.delete(f'/api/posts/{self.post.id}/')
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to edit user1's post
        edit_response = self.client.put(f'/api/posts/{self.post.id}/', {'content': 'Hacked!'})
        self.assertEqual(edit_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_toggle_like(self):
        """Verify liking and unliking a post updates the like counter"""
        self.client.force_authenticate(user=self.user2)
        
        # Like post
        like_response = self.client.post(f'/api/posts/{self.post.id}/like/')
        self.assertEqual(like_response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post.likes.count(), 1)

        # Unlike post
        unlike_response = self.client.post(f'/api/posts/{self.post.id}/like/')
        self.assertEqual(unlike_response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.post.likes.count(), 0)

# Create your tests here.
