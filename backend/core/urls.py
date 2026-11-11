from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from eventos.views import (
    CategoriaViewSet,
    UsuarioViewSet,
    EventoViewSet,
    InteresseViewSet,
    cadastro,
    login,
)

router = DefaultRouter()

router.register('categorias', CategoriaViewSet)
router.register('usuarios', UsuarioViewSet)
router.register('eventos', EventoViewSet)
router.register('interesses', InteresseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/cadastro/', cadastro, name='cadastro'),
    path('api/auth/login/', login, name='login'),

    path('api/', include(router.urls)),
]