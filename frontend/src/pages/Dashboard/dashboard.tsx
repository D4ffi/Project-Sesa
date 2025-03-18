<html>
<head>
    <script src="https://cdn.tailwindcss.com">
    </script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"/>
    <script>
        function toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
    }
    </script>
</head>
<body class="bg-gray-100 dark:bg-gray-900 font-sans">
<div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div class="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <div class="text-xl font-bold text-gray-900 dark:text-gray-100">
                Sesa Promo
            </div>
        </div>
        <div class="p-4">
            <ul>
                <li class="mb-4">
                    <a class="flex items-center text-gray-700 dark:text-gray-300" href="#">
                        <i class="fas fa-home mr-3">
                        </i>
                        <span>
         Resumen
        </span>
                    </a>
                </li>
                <li>
                    <a class="flex items-center text-gray-700 dark:text-gray-300" href="#">
                        <i class="fas fa-chart-line mr-3">
                        </i>
                        <span>
         Estadísticas
        </span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="absolute bottom-0 p-4">
            <div class="flex items-center text-gray-700 dark:text-gray-300">
                <i class="fas fa-user mr-3">
                </i>
                <span>
       Admin
      </span>
            </div>
        </div>
    </div>
    <!-- Main Content -->
    <div class="flex-1 p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ¡Buenos días!
            </h1>
            <div class="relative">
                <input class="border rounded-full py-2 px-4 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" placeholder="Buscar..." type="text"/>
                <i class="fas fa-bell absolute right-0 top-0 mt-2 mr-4 text-gray-500 dark:text-gray-400">
                </i>
            </div>
            <button class="ml-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full" onclick="toggleDarkMode()">
                <i class="fas fa-moon text-gray-700 dark:text-gray-300">
                </i>
            </button>
        </div>
        <div class="mb-6">
     <span class="text-gray-600 dark:text-gray-400">
      Lo que está pasando:
     </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 class="text-gray-600 dark:text-gray-400">
                    Ganancias
                </h2>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    $45,678.90
                </p>
                <p class="text-green-500">
                    +20% más que el mes pasado
                </p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 class="text-gray-600 dark:text-gray-400">
                    Stock
                </h2>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    2,405
                </p>
                <p class="text-green-500">
                    +33% más que el mes pasado
                </p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 class="text-gray-600 dark:text-gray-400">
                    Ventas totales
                </h2>
                <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    10,353
                </p>
                <p class="text-red-500">
                    -8% menos que el mes pasado
                </p>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 class="text-gray-600 dark:text-gray-400 mb-4">
                    Promedio de ventas
                </h2>
                <table class="w-full">
                    <thead>
                    <tr>
                        <th class="text-left text-gray-600 dark:text-gray-400">
                            Fuente
                        </th>
                        <th class="text-left text-gray-600 dark:text-gray-400">
                            Sesiones
                        </th>
                        <th class="text-left text-gray-600 dark:text-gray-400">
                            Cambio
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            4321
                        </td>
                        <td class="text-green-500">
                            +84%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            4033
                        </td>
                        <td class="text-red-500">
                            -8%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            3128
                        </td>
                        <td class="text-green-500">
                            +2%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            2104
                        </td>
                        <td class="text-green-500">
                            +33%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            2003
                        </td>
                        <td class="text-green-500">
                            +30%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            1894
                        </td>
                        <td class="text-green-500">
                            +15%
                        </td>
                    </tr>
                    <tr>
                        <td class="text-gray-900 dark:text-gray-100">
                            website.net
                        </td>
                        <td class="text-gray-900 dark:text-gray-100">
                            405
                        </td>
                        <td class="text-red-500">
                            -12%
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 class="text-gray-600 dark:text-gray-400 mb-4">
                    Chats recientes
                </h2>
                <ul>
                    <li class="flex items-center mb-4">
                        <img alt="Profile picture of Helena" class="w-10 h-10 rounded-full mr-4" src="https://placehold.co/40x40"/>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">
                                Helena
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                email@figmasfakedomain.net
                            </p>
                        </div>
                    </li>
                    <li class="flex items-center mb-4">
                        <img alt="Profile picture of Oscar" class="w-10 h-10 rounded-full mr-4" src="https://placehold.co/40x40"/>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">
                                Oscar
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                email@figmasfakedomain.net
                            </p>
                        </div>
                    </li>
                    <li class="flex items-center mb-4">
                        <img alt="Profile picture of Daniel" class="w-10 h-10 rounded-full mr-4" src="https://placehold.co/40x40"/>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">
                                Daniel
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                email@figmasfakedomain.net
                            </p>
                        </div>
                    </li>
                    <li class="flex items-center mb-4">
                        <img alt="Profile picture of Daniel Jay Park" class="w-10 h-10 rounded-full mr-4" src="https://placehold.co/40x40"/>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">
                                Daniel Jay Park
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                email@figmasfakedomain.net
                            </p>
                        </div>
                    </li>
                    <li class="flex items-center mb-4">
                        <img alt="Profile picture of Mark Rojas" class="w-10 h-10 rounded-full mr-4" src="https://placehold.co/40x40"/>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-100">
                                Mark Rojas
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                email@figmasfakedomain.net
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</body>
</html>
