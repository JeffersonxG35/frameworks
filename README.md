# Práctica de Programación Web: Vue y Angular

En esta práctica se desarrolló una app con Vue y otra con Angular. Ambas consultan la misma API y permiten buscar usuarios por nombre, marcarlos como favoritos y abrir su detalle.

## Ejecutar Vue
En una terminal en la carpeta principal del repositorio ejecutamos:

```powershell
cd vue
npm ci
npm run dev
```

## Ejecutar Angular

En otra terminal en la carpeta principal del repositorio se ejecuta:

```powershell
cd angular
npm ci
npm start
```

## Pruebas y compilación
Se ejecutaron estos comandos para correr las pruebas unitarias y generar la compilación de producción:

```powershell
npm test
npm run build
```
### Vue

![Pruebas unitarias de Vue](evidencias/vue/05-pruebas-unitarias.png)

### Angular
![Pruebas unitarias de Angular](evidencias/angular/05-pruebas-unitarias.png)

## Evidencias de funcionamiento

### Vue

El directorio carga los 10 usuarios de la API y muestra sus nombres, correos y ciudades. El contador de favoritos comienza en 0.

![Directorio de usuarios en Vue](evidencias/vue/01-directorio.png)

Al escribir "Che", el listado se reduce a Chelsey Dietrich y el indicador muestra 1 de 10 usuarios.

![Búsqueda por nombre en Vue](evidencias/vue/02-busqueda.png)

Después de marcar tres usuarios como favoritos, el contador muestra 3 y sus botones cambian a "Quitar favorito".

![Favoritos y contador en Vue](evidencias/vue/03-favoritos.png)

La ruta /users/1 muestra el detalle de Leanne Graham, con su identificador, correo y ciudad.
![Detalle del usuario en Vue](evidencias/vue/04-detalle-usuario.png)

### Angular

La pantalla inicial de Angular muestra los 10 usuarios y el contador de favoritos en 0.

![Directorio de usuarios en Angular](evidencias/angular/01-directorio.png)

La búsqueda "LEA" encuentra a Leanne Graham aunque el texto esté escrito en mayúsculas. El indicador muestra 1 de 10 usuarios.

![Búsqueda por nombre en Angular](evidencias/angular/02-busqueda.png)

Al seleccionar tres favoritos, el contador cambia a 3.

![Favoritos y contador en Angular](evidencias/angular/03-favoritos.png)

El detalle de Leanne Graham se abre en /users/1. La captura muestra que el contador conserva los 3 favoritos y que este usuario sigue marcado al cambiar de vista.

![Detalle del usuario en Angular](evidencias/angular/04-detalle.png)

