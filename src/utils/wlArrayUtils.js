let wlArrayUtils = {}
// list 随机
wlArrayUtils.randomContent = (arr) => {
    for (let i = arr.length-1; i >=0; i--) {
        let randomIndex = Math.floor(Math.random()*(i+1));
        let itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
}

export default wlArrayUtils
