
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth import authenticate, get_user_model

from .models import Categoria, Evento, Interesse
from .serializers import (
    CategoriaSerializer,
    UsuarioSerializer,
    EventoSerializer,
    InteresseSerializer,
    CadastroSerializer,
)

Usuario = get_user_model()


def eh_administrador(usuario):
    return (
        usuario.is_authenticated
        and (
            usuario.tipo == Usuario.Tipo.ADMINISTRADOR
            or usuario.is_staff
            or usuario.is_superuser
        )
    )


class EhAdministrador(BasePermission):
    def has_permission(self, request, view):
        return eh_administrador(request.user)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [EhAdministrador()]


class UsuarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [EhAdministrador]


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('data')
    serializer_class = EventoSerializer

    def get_queryset(self):
        queryset = Evento.objects.all().order_by('data')

        categoria_id = self.request.query_params.get('categoria')

        if categoria_id:
            queryset = queryset.filter(categorias__id=categoria_id)

        return queryset.distinct()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [EhAdministrador()]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)


class InteresseViewSet(viewsets.ModelViewSet):
    queryset = Interesse.objects.all()
    serializer_class = InteresseSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        consulta = Interesse.objects.all()

        if eh_administrador(self.request.user):
            return consulta

        return consulta.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        evento = serializer.validated_data['evento']

        if Interesse.objects.filter(
            usuario=self.request.user,
            evento=evento
        ).exists():
            raise ValidationError(
                'Você já registrou interesse neste evento.'
            )

        serializer.save(usuario=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def cadastro(request):
    serializer = CadastroSerializer(data=request.data)

    if serializer.is_valid():
        usuario = serializer.save()

        return Response({
            'mensagem': 'Conta criada com sucesso.',
            'usuario': {
                'id': usuario.id,
                'nome': usuario.first_name,
                'email': usuario.email,
                'tipo': usuario.tipo
            }
        }, status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    senha = request.data.get('senha')

    if not email or not senha:
        return Response(
            {'erro': 'Informe email e senha.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        usuario_cadastrado = Usuario.objects.get(email=email)

    except Usuario.DoesNotExist:
        return Response(
            {'erro': 'Email ou senha incorretos.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Usuario.MultipleObjectsReturned:
        return Response(
            {'erro': 'Existem contas com este email duplicado.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    usuario = authenticate(
        request,
        username=usuario_cadastrado.username,
        password=senha
    )

    if usuario is None:
        return Response(
            {'erro': 'Email ou senha incorretos.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    token, criado = Token.objects.get_or_create(user=usuario)

    return Response({
        'token': token.key,
        'usuario': {
            'id': usuario.id,
            'nome': usuario.first_name,
            'email': usuario.email,
            'tipo': usuario.tipo,
            'is_staff': usuario.is_staff,
            'is_superuser': usuario.is_superuser
        }
    })
