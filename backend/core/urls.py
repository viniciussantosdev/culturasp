from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from eventos.views import (
        CategoriaViewSet, UsuarioViewSet, EventoViewSet, InteresseViewSet,
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'interesses', InteresseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
