from rest_framework.routers import DefaultRouter
from .views import DialogViewSet


router = DefaultRouter()
router.register(r'dialogs', DialogViewSet, basename='dialog')

urlpatterns = router.urls
