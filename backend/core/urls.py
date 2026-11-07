from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from eventos.views import (
        CategoriaViewSet, UsuarioViewSet, EventoViewSet, InteresseViewSet,
)
from eventos.views import cadastro, login

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'interesses', InteresseViewSet, basename='interesse')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/cadastro/', cadastro),
    path('api/auth/login/', login),

    path('api/', include(router.urls)),
]