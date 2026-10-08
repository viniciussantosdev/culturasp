from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Evento, Categoria, Interesse, Usuario

admin.site.register(Evento)
admin.site.register(Categoria)
admin.site.register(Interesse)
admin.site.register(Usuario, UserAdmin)