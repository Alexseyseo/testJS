loadJSON((response) => {
    const testClass = new testFour(JSON.parse(response));
    // console.log(testClass.data.categories);

    // 1
    console.log('Метод возвращающий список тегов для категорий, элементы в списке не должны повторяться');
    console.time('Метод 1');
    testClass.getUniqTags();
    // console.log(testClass.getUniqTags());
    console.timeEnd('Метод 1');
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
        // if (tag && tag.length) {
        //     this.data.categories.filter((category) => {
        //
        //     });
        // }
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
