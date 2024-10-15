from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('speechrecognition.urls')),  # Inclui as URLs do app
]
