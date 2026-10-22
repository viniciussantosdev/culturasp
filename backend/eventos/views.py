from rest_framework import viewsets
from .models import Categoria, Usuario, Evento, Interesse
from .serializers import (
    CategoriaSerializer, UsuarioSerializer, EventoSerializer, InteresseSerializer,
)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('data')
    serializer_class = EventoSerializer

    def get_queryset(self):
        queryset = Evento.objects.all().order_by('data')
        categoria_id = self.request.query_params.get('categoria')

        if categoria_id:
            queryset = queryset.filter(categorias__id=categoria_id)

        return queryset.distinct()


class InteresseViewSet(viewsets.ModelViewSet):
    queryset = Interesse.objects.all()
    serializer_class = InteresseSerializer