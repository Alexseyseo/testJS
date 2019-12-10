loadJSON((response) => {
    const testClass = new testFour(JSON.parse(response));
    console.log(testClass.data);

    // 1
    console.log('Метод 1 возвращающий список тегов для категорий, элементы в списке не должны повторяться');
    console.time('Метод 1');
    testClass.getUniqTags();
    // console.log(testClass.getUniqTags());
    console.timeEnd('Метод 1');

    // 2
    let testTag = 'main';
    console.log('Метод 2 возвращающий категории по заданному тегу, в качестве входного параметра принимает имя тега');
    console.time('Метод 2');
    testClass.getCategoryByTag(testTag);
    // console.log(testClass.getCategoryByTag(testTag));
    console.timeEnd('Метод 2');

    // 3
    let testCodeLang = 'ru';
    console.log('Метод 3 возвращающий наименования категорий на заданном языке, в качестве входного параметра принимает 2-х значный код языка');
    console.time('Метод 3');
    testClass.getNamesCategoriesByLang(testCodeLang);
    // console.log(testClass.getNamesCategoriesByLang(testCodeLang));
    console.timeEnd('Метод 3');

    // 4
    console.log('Метод 4 возвращающий список игр, поддерживающих демо режим (hasDemo: 1)');
    console.time('Метод 4');
    testClass.getGamesHasDemo();
    // console.log(testClass.getGamesHasDemo());
    console.timeEnd('Метод 4');

    // 5
    let testIdMerch = '977';
    console.log('Метод 5 возвращающий список игр по заданному ID мерчанта, в качестве входного параметра принимает ID мерчанта');
    console.time('Метод 5');
    testClass.getGamesByIdMerch(testIdMerch);
    // console.log(testClass.getGamesByIdMerch(testIdMerch));
    console.timeEnd('Метод 5');

    // 6
    let testCurrency = 'AZN';
    console.log('Метод 6 возвращающий список мерчантов, поддерживающих заданную валюту, в качестве входного параметра принимает 3-х значное (валюты, которые поддерживают мерчанты хранятся в объекте merchantCurrencies)');
    console.time('Метод 6');
    testClass.getMerchByCurrency(testCurrency);
    // console.log(testClass.getMerchByCurrency(testCurrency));
    console.timeEnd('Метод 6');
});

class testFour {
    constructor(jsonData) {
        this.data = jsonData;
    }
    getUniqTags() {
        if (this.data.categories && this.data.categories.length) {
            let hash = {};
            let resultArray = [];
            this.data.categories.map((category) => {
                const uniqTags = category.Tags.filter((value) => hash.hasOwnProperty(value) ? false : hash[value] = true);
                if (uniqTags.length) {
                    resultArray = resultArray.concat(uniqTags);
                }
            });
            return resultArray;
        }
        return [];
    }
    getCategoryByTag(tag) {
        if (tag && tag.length) {
            return this.data.categories.filter((category) => category.Tags.indexOf(tag) !== -1);
        }
        return [];
    }
    getNamesCategoriesByLang(codeLang) {
        if (codeLang && codeLang.length) {
            let resultArray = [];
            this.data.categories.map((category) => {
                const nameByLang = category.Name.hasOwnProperty(codeLang) ? category.Name[codeLang] : null;
                if (nameByLang) {
                    resultArray.push(nameByLang);
                }
            });
            return resultArray;
        }
        return [];
    }
    getGamesHasDemo(hasDemoBoolean = true) {
        if (this.data.games && this.data.games.length) {
            return this.data.games.filter((game) => game.hasDemo === +hasDemoBoolean);
        }
        return [];
    }
    getGamesByIdMerch(idMerch) {
        if (idMerch) {
            return this.data.games.filter((game) => +game.MerchantID === +idMerch);
        }
        return [];
    }
    getMerchByCurrency(currency) {
        // let merchants = {}; // если нужно получить объект
        let merchants = [];
        this.data.merchantsCurrencies.filter((merchant) => {
            let id = merchant.IDMerchant;
            if (merchant.Currencies.indexOf(currency) !== -1 && this.data.merchants[id]) {
                // merchants[id] = this.data.merchants[id]; // если нужно получить объект
                merchants.push(this.data.merchants[id]);
            }
        });
        return merchants;
    }
}

function loadJSON(callback) {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'games.json');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}
