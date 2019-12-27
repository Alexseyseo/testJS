'use strict';
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
interface PromiseResponse {
    dataResponse: any;
    url: string;
    countRequest: number;
}

class getData {
    static async games() {
        let games: any[] = [];
        let params = {
            limit: 50,
            start: 0,
            sort: 'id',
        };

        await this.makeRequest('/GetGamesCount', 1).then((response: PromiseResponse) => {
            this.paintLoading();
            return response.dataResponse.count;
        }).then((gamesCount) => {
            let currentRequestIndex = 1;
            for (let receivedGames = 0; receivedGames < gamesCount; receivedGames += 50) {
                params.start = receivedGames;
                let request = this.makeRequest('/GetGames', 1, params).then((response: PromiseResponse) => {
                    this.paintLoading(currentRequestIndex++, games.length);
                    return response;
                });
                games.push(request);
            }
        });

        let results = await Promise.all(games);

        // После успешного завершения всех запросов вывести сообщение об этом, а также распределение (количество) игр по провайдерам и категориям.
        // TODO вывод в DOM информации об успешном завершении
        console.log('all complete', results);
    }

    static categories() {
        this.makeRequest('/GetCategories', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
        });
    }

    static merchants() {
        this.makeRequest('/GetMerchants', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
        });
    }

    static countriesRestrictions() {
        this.makeRequest('/GetCountriesRestrictions', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
        });
    }

    static merchantsCurrencies() {
        this.makeRequest('/GetMerchantsCurrencies', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
        });
    }

    static async makeRequest(url: string, countRequest: number, params: object = null): Promise<PromiseResponse> {
        try {
            if (params) {
                // @ts-ignore
                url = url + `?${Object.keys(params).map(key => key + '=' + params[key]).join('&')}`;
            }
            const request = await fetch(url);
            if (!request.ok) {
                throw new Error(`Ошибка запроса сервера.`);
            }
            const dataResponse = await request.json();
            if (typeof dataResponse === 'string') {
                return {
                    dataResponse: JSON.parse(dataResponse),
                    url,
                    countRequest,
                };
            }
            return {
                dataResponse,
                url,
                countRequest,
            };
        } catch (error) {
            console.log(error.message);
        }
        // В случае получения ошибки получения данных выводить сообщение об ошибке и
        // осуществлять повторную попытку.
        // TODO выводить сообщение об ошибке в DOM
        return await this.makeRequest(url, ++countRequest);
    }

    static displayInformation(dataResponse: PromiseResponse) {
        const blockInfo = document.createElement("div");
        console.log(dataResponse.url, dataResponse.dataResponse);
        blockInfo.innerHTML = `Запрос: ${dataResponse.url}. Количество сделанных запросов: ${dataResponse.countRequest}.`;
        document.body.append(blockInfo);
    }

    private static paintLoading(current: number = 0, all: number = 100) {
        // В процессе выводить в DOM количество сделанных и оставшихся запросов, а также
        // процент выполнения.
        let box = document.getElementById('loadingGames');
        if (box) {
            let range = document.getElementById('rangeLoading');
            range.innerText = `${current} из ${all}`;
            range.style.width = `${100 / all * current}%`;
        } else {
            const blockLoading = document.createElement("div");
            blockLoading.id = 'loadingGames';
            blockLoading.style.backgroundColor = 'silver';
            blockLoading.style.height = '1.5rem';
            blockLoading.style.width = `100%`;
            blockLoading.style.position = 'relative';
            blockLoading.style.textAlign = 'center';
            blockLoading.style.color = 'white';
            blockLoading.style.fontSize = '1 rem';
            blockLoading.style.lineHeight = '1.5 rem';
            const rangeLoading = document.createElement("div");
            rangeLoading.id = 'rangeLoading';
            rangeLoading.style.backgroundColor = 'green';
            rangeLoading.style.position = 'absolute';
            rangeLoading.style.top = '0';
            rangeLoading.style.left = '0';
            rangeLoading.style.height = '1.5rem';
            rangeLoading.style.width = `0%`;
            blockLoading.append(rangeLoading);
            document.body.append(blockLoading);
        }
    }
}

getData.games();

// небольшая функция для вызова данных в консоль при клике по ссылке
document.querySelectorAll('a').forEach((element) => {
    element.onclick = async (event: any) => {
        event.preventDefault();
        getData.makeRequest(event.target.pathname, 1).then((response: PromiseResponse) => {
            getData.displayInformation(response);
        });
    }
});
