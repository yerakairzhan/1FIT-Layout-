from django.urls import path
from rest_framework import routers
from api.views import GymViewSet, BookingViewSet, CategoryViewSet, list_categories, gym_detail_crud, list_gyms
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
   
    # CBV paths
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('list_gyms/', GymViewSet.as_view()),
    path('booking/', BookingViewSet.as_view()),
    path('category/', CategoryViewSet.as_view()),

    # 2 FBV paths
    path('list_posts/', list_categories),
    path('list_categories/', list_categories),
    path('list_gyms/', list_gyms),
    path('list_gyms/<int:id>/', gym_detail_crud),
]