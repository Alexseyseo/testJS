// Задание
// Используя предоставленный тестовый сервер, написать класс, получающий по
// отдельности все части каталога игр, а именно: категории, провайдеры, ограничения по странам, ограничения по валютам, игры (документация по api встроена в сервер).
// Ограничение на количество игр получаемое за один раз - 50 шт.
//
// В процессе выводить в DOM количество сделанных и оставшихся запросов, а также
// процент выполнения.
//
// В случае получения ошибки получения данных выводить сообщение об ошибке и
// осуществлять повторную попытку.
//
// После успешного завершения всех запросов вывести сообщение об этом, а также распределение (количество) игр по провайдерам и категориям.
document.querySelectorAll('a').forEach((element) => {
    element.onclick = async (event: any) => {
        event.preventDefault();
        try {
            const url = event.target.pathname;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка сервера.`);
            }
            const myJson = await response.json();
            if (typeof myJson === 'string') {
                console.log(JSON.parse(myJson));
            }
            console.log(myJson);
        } catch (error) {
            console.log(error.message);
        }
    }
});
