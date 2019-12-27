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
document.querySelectorAll('a').forEach((element) => {
    element.onclick = async (event: any) => {
        event.preventDefault();
        getData.makeRequest(event.target.pathname, 1).then((response: PromiseResponse) => {
            getData.displayInformation(response);
            console.log('result', response);
        });
    }
});

interface PromiseResponse {
    dataResponse: {} | [];
    url: string;
    countRequest: number;
}

class getData {
    static categories() {
        this.makeRequest('/GetCategories', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
            console.log('res', response);
        });
    }

    static merchants() {
        this.makeRequest('/GetMerchants', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
            console.log('res', response);
        });
    }

    static countriesRestrictions() {
        this.makeRequest('/GetCountriesRestrictions', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
            console.log('res', response);
        });
    }

    static merchantsCurrencies() {
        this.makeRequest('/GetMerchantsCurrencies', 1).then((response: PromiseResponse) => {
            this.displayInformation(response);
            console.log('res', response);
        });
    }

    static async makeRequest(url: string, countRequest: number, options: object = {}): Promise<PromiseResponse> {
        try {
            const request = await fetch(url, options);
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
        return await this.makeRequest(url, ++countRequest);
    }

    static displayInformation(dataResponse: PromiseResponse) {
        const blockInfo = document.createElement("div");
        blockInfo.innerHTML = `Запрос: ${dataResponse.url}. Количество сделанных запросов: ${dataResponse.countRequest}.`;
        document.body.append(blockInfo);
    }
}

getData.categories();
